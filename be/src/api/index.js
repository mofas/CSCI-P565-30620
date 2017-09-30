import HTTPStatus from 'http-status';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import config from '../config';
import { sendVerifyEmail } from '../emailService';

export const indexHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
    message: 'Work',
  });
};

export const getUserInfoHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send(
    Object.assign(
      {},
      {
        err: 0,
      },
      req.user
    )
  );
};

export const successLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
    message: 'success login',
  });
};

export const failLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'fail to login',
  });
};

export const accountCreateHandler = db => async (req, rsp) => {
  const { email, password } = req.body;
  const ret = await db.collection('accounts').count({ email });

  if (!ret) {
    const hashpwd = crypto
      .createHash('sha256')
      .update(password + config.server.salt)
      .digest('base64');

    await db.collection('accounts').insertOne({
      email,
      password: hashpwd,
      role: 'player',
      status: -1,
      valCode: crypto
        .createHash('sha256')
        .update(new Date().valueOf().toString())
        .digest('base64'),
    });

    await sendVerifyEmail(db)(email);

    rsp.status(HTTPStatus.OK).send({
      err: 0,
      message: 'Create account successfully.',
    });
  } else {
    rsp.status(HTTPStatus.OK).send({
      err: 1,
      message: 'Email is already registered.',
    });
  }
};

export const resendEmailHandler = db => async (req, rsp) => {
  const { email } = req.body;
  if (email) {
    sendVerifyEmail(db)(email);

    rsp.status(HTTPStatus.OK).send({
      err: 0,
      message: 'send email successfully.',
    });
  } else {
    rsp.status(HTTPStatus.OK).send({
      err: 1,
      message: 'Email is not given.',
    });
  }
};

export const verifyEmailHandler = db => async (req, rsp) => {
  const { id, code } = req.body;
  if (id && code) {
    const { result } = await db
      .collection('accounts')
      .updateOne(
        { _id: ObjectId(id), valCode: code, status: -1 },
        { $set: { status: 0 } }
      );

    if (result.ok) {
      return rsp.status(HTTPStatus.OK).send({
        err: 0,
        message: 'verify email successfully.',
      });
    }
  }

  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'Id or code is not matched',
  });
};
