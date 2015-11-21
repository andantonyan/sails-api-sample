var sails = require('sails');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports.email = {
  //auth: {
  //  user: '',
  //  pass: ''
  //},
  transporter: sgTransport({
      auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENDGRID_PASSWORD
      }
    }
  ),

  testMode: process.env.NODE_ENV !== 'production',
  templateDir: 'views/email',
  emailLinks: {
    verifyAccount: {
      link: '%s/#/verify?token=%s',
      subject: 'Account Verification',
      from: 'noreply@sails-sample.com'
    }
  }
};
