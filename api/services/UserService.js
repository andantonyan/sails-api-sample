var Q = require('q');

module.exports = {
  isEmailTaken: function (email) {
    return User.count({email: email});
  }
};
