var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sails = require('sails');

passport.use(new LocalStrategy({usernameField: 'email'},
    function(email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, 'incorrectEmail');

        User.comparePassword(password, user, function (err, match) {
          if (err || !match) return done(null, false, { message: 'incorrectPassword' });
          done(null, user);
        });
      });
    })
);

module.exports.passport = passport;
