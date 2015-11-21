var Q = require('q');
var util = require('util');

module.exports = {
  sendUserVerificationEmail: function (user, token) {
    var defer = Q.defer();

    sails.hooks.email.send('verifyAccount', {
      link: util.format(sails.config.email.emailLinks.verifyAccount.link, sails.config.webAppUri, token)
    }, {
      to: user.email,
      subject: sails.config.email.emailLinks.verifyAccount.subject,
      from: sails.config.email.emailLinks.verifyAccount.from
    }, function (err) {
      if(err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });

    return defer.promise;
  }
};
