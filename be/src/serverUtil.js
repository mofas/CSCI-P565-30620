import HTTPStatus from 'http-status';
import crypto from 'crypto';

import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogleOAuth from 'passport-google-oauth20';

import { sign_request } from 'duo_web';
import session from 'express-session';

import config from './config';
import bodyParser from 'body-parser';

import { createAccount, hashPassword } from './accountUtil';
import { duoSigTokenStore, duoPass, userInfo } from './cache';

const setupPassport = (app, { config, db }) => {
  app.use(session(config.session));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new passportLocal.Strategy(async (email, password, done) => {
      const hashpwd = hashPassword(password);

      const ret = await db
        .collection('accounts')
        .findOne({ email, password: hashpwd });

      if (ret) {
        const duotoken = await sign_request(
          config.duo.integrationKey,
          config.duo.secretKey,
          crypto
            .createHash('sha256')
            .update(ret.email + config.server.salt)
            .digest('base64'),
          email
        );
        duoSigTokenStore[ret.email] = duotoken;
        if (config.duo.disable) {
          duoPass[email] = true;
        }
        return done(null, ret.email);
      }

      return done(null, false);
    })
  );

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
        duoPass[email] = true;
        if (!ret) {
          await createAccount(db)({ email, status: 0 });
          cb(null, email);
        } else {
          cb(null, email);
        }
      }
    )
  );

  passport.serializeUser((email, cb) => {
    cb(null, email);
  });

  passport.deserializeUser((email, cb) => {
    if (userInfo[email]) {
      cb(null, userInfo[email]);
    } else {
      db
        .collection('accounts')
        .findOne({ email })
        .then(({ _id, email, role, status, ban }) => {
          userInfo[email] = {
            _id: String(_id),
            email,
            role,
            status,
            ban,
          };
          cb(null, userInfo[email]);
        });
    }
  });
};

const checkAuth = (req, rsp, next) => {
  if (req.user) {
    if (duoPass[req.user.email]) {
      return next();
    } else {
      rsp.status(HTTPStatus.UNAUTHORIZED).send({
        errMsg: 'Please do duo verify',
        loginUrl: '/duo_login/' + duoSigTokenStore[req.user.email],
      });
    }
  } else {
    rsp.status(HTTPStatus.UNAUTHORIZED).send({
      errMsg: 'Please Login',
      loginUrl: '/login',
    });
  }
};

const checkPermission = (req, rsp, next) => {
  if (req.user && req.user.ban) {
    rsp.status(HTTPStatus.OK).send({
      err: 3,
      message: 'you are banned',
      email: req.user.email,
    });
  } else {
    next();
  }
};

export const setup = (app, { config, db, wsUserMap }) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  setupPassport(app, { config, db });

  app.use('/*', setCrossDomainHeader);

  app.options('/*', (req, rsp, next) => {
    rsp.sendStatus(HTTPStatus.OK).end();
  });

  app.use('/account/get_user_info', checkAuth);
  app.use('/graphql', checkPermission);

  app.locals.db = db;
  app.locals.config = config;
  app.locals.ws = wsUserMap;
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
