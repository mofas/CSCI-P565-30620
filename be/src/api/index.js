import HTTPStatus from 'http-status';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import config from '../config';
import { sendVerifyEmail, sendResetPasswordEmail } from '../emailService';

const genValCode = () => {
  return encodeURIComponent(
    crypto
      .createHash('sha256')
      .update(new Date().valueOf().toString() + config.server.salt)
      .digest('base64')
  );
};

const hashPassword = password => {
  return crypto
    .createHash('sha256')
    .update(password + config.server.salt)
    .digest('base64');
};

export const indexHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
    message: 'Work',
  });
};

export const getUserInfoHandler = (req, rsp, next) => {
  if (req.user) {
    rsp.status(HTTPStatus.OK).send(
      Object.assign(
        {},
        {
          err: 0,
        },
        req.user
      )
    );
  } else {
    rsp.status(HTTPStatus.OK).send({
      err: 1,
      message: 'Please verify your email',
    });
  }
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

  const hashpwd = hashPassword(password);

  if (!ret) {
    await db.collection('accounts').insertOne({
      email,
      password: hashpwd,
      role: 'player',
      status: -1,
      valCode: genValCode(),
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

export const forgetPasswordHandler = db => async (req, rsp) => {
  const { email } = req.body;
  if (email) {
    const code = genValCode();

    const { result } = await db
      .collection('accounts')
      .updateOne({ email: email }, { $set: { valCode: code } });

    if (result.ok && result.n > 0) {
      sendResetPasswordEmail(db)(email);
      return rsp.status(HTTPStatus.OK).send({
        err: 0,
        message: 'Send reset password email.',
      });
    }
  }

  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'We cannot find this email, please register at first.',
  });
};

export const resetPasswordHandler = db => async (req, rsp) => {
  const { id, code, password } = req.body;
  if (id && code) {
    const hashpwd = hashPassword(password);

    const { result } = await db
      .collection('accounts')
      .updateOne(
        { _id: ObjectId(id), valCode: code },
        { $set: { password: hashpwd, valCode: genValCode() } }
      );

    if (result.ok && result.n > 0) {
      return rsp.status(HTTPStatus.OK).send({
        err: 0,
        message: 'Reset password successfully.',
      });
    }
  }

  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'This code is used before or not valid.',
  });
};
