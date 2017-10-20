import express from 'express';
import config from './config';
import mongodb from 'mongodb';
import passport from 'passport';

import graphqlHTTP from 'express-graphql';
import { schema } from './graphql/schema';

import HTTPStatus from 'http-status';
import { setup } from './serverUtil';

import {
  indexHandler,
  getUserInfoHandler,
  successLoginHandler,
  failLoginHandler,
  accountCreateHandler,
  resendEmailHandler,
  verifyEmailHandler,
  forgetPasswordHandler,
  resetPasswordHandler,
} from './api';

const main = async () => {
  // setup DB
  let db;
  try {
    db = await mongodb.MongoClient.connect(config.mongo.url, {});
  } catch (err) {
    console.warn({ err }, 'Cannot connect to mongodb');
    throw err;
  }

  let app = setup(express(), { config, db });

  app.get('/', indexHandler);
  app.get('/success_login', successLoginHandler);
  app.get('/fail_login', failLoginHandler);

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['email'] })
  );

  app.get(
    '/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/fail_login' }),
    (req, res) => {
      res.redirect(config.fe.url);
    }
  );

  app.get('/account/get_user_info', getUserInfoHandler);
  app.post('/account/create', accountCreateHandler(db));
  app.post('/account/resend_email', resendEmailHandler(db));
  app.post('/account/verify_email', verifyEmailHandler(db));
  app.post('/account/forget_password', forgetPasswordHandler(db));
  app.post('/account/reset_password', resetPasswordHandler(db));

  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/success_login',
      failureRedirect: '/fail_login',
    })
  );

  app.get('/logout', (req, rsp) => {
    req.logout();
    rsp.redirect('/');
  });

  app.use('/graphql', (req, rsp, next) => {
    const context = {
      cfg: config,
      db,
      req,
    };
    return graphqlHTTP({
      schema,
      context: context,
      rootValue: context,
      graphiql: true,
    })(req, rsp, next);
  });

  app.listen(config.server.port);
};

main();
