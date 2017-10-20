import HTTPStatus from 'http-status';
import crypto from 'crypto';

import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogleOAuth from 'passport-google-oauth20';

import session from 'express-session';

import config from './config';
import bodyParser from 'body-parser';

import { createAccount } from './accountUtil';

const setupPassport = (app, { config, db }) => {
  app.use(session(config.session));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new passportLocal.Strategy(async (email, password, done) => {
      const hashpwd = crypto
        .createHash('sha256')
        .update(password + config.server.salt)
        .digest('base64');

      const ret = await db
        .collection('accounts')
        .findOne({ email, password: hashpwd });
      if (ret) {
        return done(null, ret.email);
      }

      return done(null, false);
    })
  );

  // console.log(
  //   config.oauth.clientID,
  //   config.oauth.clientSecret,
  //   config.oauth.callbackURL
  // );

  passport.use(
    new passportGoogleOAuth.Strategy(
      {
        clientID: config.oauth.clientID,
        clientSecret: config.oauth.clientSecret,
        callbackURL: config.oauth.callbackURL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails[0].value;
        const ret = await db.collection('accounts').findOne({ email });
        console.log(ret);
        if (!ret) {
          await createAccount(db)({ email, status: 0 });
          cb(null, email);
        } else {
          cb(null, email);
        }
      }
    )
  );

  passport.serializeUser(function(email, cb) {
    cb(null, email);
  });

  passport.deserializeUser(function(email, cb) {
    db
      .collection('accounts')
      .findOne({ email })
      .then(({ _id, email, role, status }) => {
        cb(null, { _id: String(_id), email, role, status });
      });
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

  app.use('/account/get_user_info', checkAuth);
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
