import crypto from 'crypto';
import config from './config';

export const genValCode = () => {
  return encodeURIComponent(
    crypto
      .createHash('sha256')
      .update(new Date().valueOf().toString() + config.server.salt)
      .digest('base64')
  );
};

export const createAccount = db => async ({
  email,
  hashpwd = genValCode(),
  status = -1,
}) => {
  await db.collection('accounts').insertOne({
    email,
    password: hashpwd,
    role: 'player',
    status,
    valCode: genValCode(),
    ban: false,
  });
};

export const hashPassword = password => {
  return crypto
    .createHash('sha256')
    .update(password + config.server.salt)
    .digest('base64');
};
