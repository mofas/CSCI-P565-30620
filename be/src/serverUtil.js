import HTTPStatus from 'http-status';

import session from 'express-session';
import config from './config';
import bodyParser from 'body-parser';

export const setup = (app, {config}) => {

  app.use(session({
    secret: config.server.session.secret,
    saveUninitialized: config.server.session.saveUninitialized,
    resave: config.server.session.resave,
  }));

  app.use('/*', setCrossDomainHeader);

  app.locals.config = config;
  return app;
};

const setCrossDomainHeader = (req, rsp, next) => {
  rsp.set({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': `${req.headers.origin}`,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'accept, content-type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });
  next();
};
