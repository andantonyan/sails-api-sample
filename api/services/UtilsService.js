var jwt = require('jsonwebtoken');
var Q = require('q');

module.exports = {
  errorFormatter: function (errors) {
    errors = errors || [];
    if (!Array.isArray(errors)) errors = [errors];
    errors = _.map(errors, function (error) {
      return {message: error};
    });
    return errors;
  },

  errorResponseMap: function (err) {
    var map = {
      JsonWebTokenError: {
        method: 'notFound',
        message: ''
      }
    };

    return map[err.name] ? {
      method: map[err.name].method,
      message: map[err.name].message
    } : {
      method: 'serverError',
      message: 'serverError',
      body: true
    };
  },

  verifyToken: function (token) {
    var defer = Q.defer();

    jwt.verify(token, sails.config.session.secret, function(err, data) {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(data);
      }
    });

    return defer.promise;
  },

  signToken: function (payload) {
    return jwt.sign(payload, sails.config.session.secret, {expiresInMinutes: sails.config.session.token.maxAge});
  }
};
