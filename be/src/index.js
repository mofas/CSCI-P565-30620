import http from 'http';
import express from 'express';
import config from './config';
import mongodb from 'mongodb';
import passport from 'passport';
import WebSocket from 'ws';

import graphqlHTTP from 'express-graphql';
import { schema } from './graphql/schema';

import HTTPStatus from 'http-status';
import { setup } from './serverUtil';

import {
  indexHandler,
  getUserInfoHandler,
  verifyDuoHandler,
  successLoginHandler,
  failLoginHandler,
  accountCreateHandler,
  resendEmailHandler,
  verifyEmailHandler,
  forgetPasswordHandler,
  resetPasswordHandler,
  sendinvitation,
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

  let wsUserMap = {};

  let app = setup(express(), {
    config,
    db,
    wsUserMap,
  });
  const server = http.createServer(app);
  const wss = new WebSocket.Server({
    server,
  });

  wss.on('connection', (ws, req) => {
    ws.on('message', message => {
      try {
        const msg = JSON.parse(message);
        if (msg.type === 'initial') {
          wsUserMap[Math.random()] = ws;
        }
      } catch (e) {
        //do nothing ...
      }
    });
  });

  app.use('/graphql', (req, rsp, next) => {
    const context = {
      cfg: config,
      db,
      req,
      ws: wsUserMap,
    };
    return graphqlHTTP({
      schema,
      context: context,
      rootValue: context,
      graphiql: true,
    })(req, rsp, next);
  });

  app.get('/', indexHandler);
  app.get('/success_login', successLoginHandler);
  app.get('/fail_login', failLoginHandler);

  app.post('/verify_duo', verifyDuoHandler);

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['email'] })
  );

  app.get(
    '/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/fail_login' }),
    (req, res) => {
      res.redirect(config.fe.url + '/#/app/news');
    }
  );

  app.get('/account/get_user_info', getUserInfoHandler);
  app.post('/account/create', accountCreateHandler(db));
  app.post('/account/resend_email', resendEmailHandler(db));
  app.post('/account/verify_email', verifyEmailHandler(db));
  app.post('/account/forget_password', forgetPasswordHandler(db));
  app.post('/account/reset_password', resetPasswordHandler(db));
  app.post('/league/invitation', sendinvitation(db));

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

  server.listen(config.server.port);
};

main();
