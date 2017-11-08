import HTTPStatus from 'http-status';

import { verify_response } from 'duo_web';

import { ObjectId } from 'mongodb';
import config from '../config';
import { createAccount, genValCode, hashPassword } from '../accountUtil';
import {
  sendVerifyEmail,
  sendResetPasswordEmail,
  sendInvitationEmail,
} from '../emailService';
import { duoSigTokenStore, duoPass } from '../cache';

export const indexHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 0,
    message: 'Work',
  });
};

export const getUserInfoHandler = (req, rsp, next) => {
  if (req.user) {
    if (duoPass[req.user.email]) {
      if (req.user.status === -1) {
        rsp.status(HTTPStatus.OK).send({
          err: 1,
          message: 'Please verify your email',
          email: req.user.email,
        });
      } else if (req.user.ban) {
        rsp.status(HTTPStatus.OK).send({
          err: 3,
          message: 'you are banned',
          email: req.user.email,
        });
      } else {
        rsp.status(HTTPStatus.OK).send(
          Object.assign(
            {},
            {
              err: 0,
            },
            req.user
          )
        );
      }
    } else {
      rsp.status(HTTPStatus.OK).send({
        err: 2,
        message: 'fail to login',
        loginUrl: '/duo_login/' + duoSigTokenStore[req.user.email],
      });
    }
  }
};

export const successLoginHandler = (req, rsp, next) => {
  if (duoPass[req.user.email]) {
    rsp.status(HTTPStatus.OK).send({
      err: 0,
    });
  } else {
    rsp.status(HTTPStatus.OK).send({
      err: 2,
      message: 'duo check',
      duoUrl: '/duo_login/' + duoSigTokenStore[req.user.email],
    });
  }
};

export const failLoginHandler = (req, rsp, next) => {
  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'fail to login',
  });
};

export const verifyDuoHandler = async (req, rsp) => {
  const { sigResponse } = req.body;
  const result = await verify_response(
    config.duo.integrationKey,
    config.duo.secretKey,
    hashPassword(req.user.email),
    sigResponse
  );
  if (result === req.user.email) {
    duoPass[result] = true;
    rsp.status(HTTPStatus.OK).send({
      err: 0,
      message: 'success verify duo',
    });
  } else {
    rsp.status(HTTPStatus.OK).send({
      err: 1,
      message: 'fail to verify duo',
    });
  }
};

export const accountCreateHandler = db => async (req, rsp) => {
  const { email, password } = req.body;
  const ret = await db.collection('accounts').count({ email });

  const hashpwd = hashPassword(password);

  if (!ret) {
    await createAccount(db)({ email, hashpwd });
    await sendVerifyEmail(db)(email);

    rsp.status(HTTPStatus.OK).send({
      err: 0,
      message: 'Create account successfully.',
      email,
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

export const sendinvitation = db => async (req, rsp) => {
  const { inviter, receiver, leagueName } = req.body;
  if (inviter && receiver && leagueName) {
    sendInvitationEmail({ inviter, receiver, leagueName });
    return rsp.status(HTTPStatus.OK).send({
      err: 0,
      message: 'Send invitation successfully.',
    });
  }

  rsp.status(HTTPStatus.OK).send({
    err: 1,
    message: 'Some thing goes wrong!',
  });
};
