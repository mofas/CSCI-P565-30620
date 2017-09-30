import sgMail from '@sendgrid/mail';

import config from './config';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerifyEmail = db => async email => {
  // TODO: search id and code by email on DB.

  const ret = await db.collection('accounts').findOne({ email });
  const id = ret._id;
  const code = ret.valCode;
  const verifyLink = `${config.fe.url}/verify_email/${id}/${code}`;

  const html = `<h2>Hi:</h2>
    <p>Please visite : <a href="${verifyLink}" target="_blank">${verifyLink}</a>
    to activate your fantasy football account.</p>
  `;

  const msg = {
    to: 'cli3@iu.edu',
    from: 'cli3@iu.edu',
    subject: 'Verify your email on Football Fantasy Game',
    text: verifyLink,
    html: html,
  };

  sgMail.send(msg);
};
