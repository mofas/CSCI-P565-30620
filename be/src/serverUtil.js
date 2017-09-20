import HTTPStatus from 'http-status';

import session from 'express-session';
import config from './config';
import bodyParser from 'body-parser';

export const setup = (app, { config, db }) => {
  app.use(
    session({
      secret: config.session.secret,
      saveUninitialized: config.session.saveUninitialized,
      resave: config.session.resave,
    })
  );

  app.use('/*', setCrossDomainHeader);

  app.options('/*', (req, rsp, next) => {
    rsp.sendStatus(HTTPStatus.OK).end();
  });

  app.use('/*', bodyParser.json());
  app.use('/*', bodyParser.urlencoded({ extended: true }));

  //app.use('/graphql', checkAuth);

  app.locals.db = db;
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
