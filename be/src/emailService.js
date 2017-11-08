import sgMail from '@sendgrid/mail';

import config from './config';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerifyEmail = db => async email => {
  const ret = await db.collection('accounts').findOne({ email });
  const id = ret._id;
  const code = ret.valCode;
  const verifyLink = `${config.fe.url}/verify_email/${id}/${code}`;

  const html = `<h2>Hi:</h2>
    <p>Please visite : <a href="${verifyLink}" target="_blank">${verifyLink}</a>
    to activate your fantasy football account.</p>
  `;

  const msg = {
    to: email,
    from: 'cli3@iu.edu',
    subject: 'Verify your email on Football Fantasy Game',
    text: verifyLink,
    html: html,
  };

  sgMail.send(msg);
};

export const sendResetPasswordEmail = db => async email => {
  const ret = await db.collection('accounts').findOne({ email });
  const id = ret._id;
  const code = ret.valCode;
  const verifyLink = `${config.fe.url}/reset_password/${id}/${code}`;

  const html = `<h2>Hi:</h2>
    <p>Please visite : <a href="${verifyLink}" target="_blank">${verifyLink}</a>
    to reset password of your fantasy football account.</p>
  `;

  const msg = {
    to: email,
    from: 'cli3@iu.edu',
    subject: 'Verify your email on Football Fantasy Game',
    text: verifyLink,
    html: html,
  };

  sgMail.send(msg);
};

export const sendInvitationEmail = async ({
  inviter,
  receiver,
  leagueName,
}) => {
  const text = `${config.fe.url}`;
  const html = `<h2>Hi:</h2>
    <p>Your friends ${inviter} invite you to join his league "<bold>${
    leagueName
  }</bold>" on
    <a href="${config.fe.url}" target="_blank">Football Fantasy Game</a></p>
  `;

  const msg = {
    to: receiver,
    from: inviter,
    subject:
      'Your friends invite to join his/her league in Football Fantasy Game',
    text: text,
    html: html,
  };

  sgMail.send(msg);
};
