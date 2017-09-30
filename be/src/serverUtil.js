import HTTPStatus from 'http-status';
import crypto from 'crypto';

import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';

import config from './config';
import bodyParser from 'body-parser';

const setupPassport = (app, { config, db }) => {
  app.use(session(config.session));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new passportLocal.Strategy(async (email, password, done) => {
      const hashpwd = crypto
        .createHash('sha256')
        .update(password + config.server.sal)
        .digest('base64');

      const ret = await db
        .collection('accounts')
        .findOne({ email, password: hashpwd });

      if (ret) {
        return done(null, {
          email: ret.email,
          role: ret.role,
          status: ret.status,
        });
      }

      return done(null, false);
    })
  );

  passport.serializeUser(function(user, cb) {
    // console.log('serializeUser', user.username)
    cb(null, user.username);
  });

  passport.deserializeUser(function(username, cb) {
    // console.log('deserializeUser', username)
    cb(null, { username });
  });
};

const checkAuth = (req, rsp, next) => {
  if (req.user) {
    return next();
  }
  rsp.status(HTTPStatus.UNAUTHORIZED).send({
    errMsg: 'Please Login',
    loginUrl: '/login',
  });
};

export const setup = (app, { config, db }) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  setupPassport(app, { config, db });

  app.use('/*', setCrossDomainHeader);

  app.options('/*', (req, rsp, next) => {
    rsp.sendStatus(HTTPStatus.OK).end();
  });

  app.use('/getUserInfo', checkAuth);
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
