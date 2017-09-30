import express from 'express';
import config from './config';
import mongodb from 'mongodb';
import passport from 'passport';

// import graphqlHTTP from 'express-graphql';
// import { schema } from './graphql/schema';

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

  app.get('/account/getUserInfo', getUserInfoHandler);
  app.post('/account/create', accountCreateHandler(db));
  app.post('/account/resend_email', resendEmailHandler(db));
  app.post('/account/verify_email', verifyEmailHandler(db));

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

  /**
  //read
  app.get('/account/read/:username', async (req, rsp) => {
    const ret = await db
      .collection('accounts')
      .find({ username: req.params.username })
      .toArray();
    rsp.status(HTTPStatus.OK).send(ret);
  });

  //create

  //list
  app.get('/account/list', async (req, rsp) => {
    const ret = await db
      .collection('accounts')
      .find({})
      .toArray();
    rsp.status(HTTPStatus.OK).send(ret);
  });
  **/

  app.listen(config.server.port);
};

main();
