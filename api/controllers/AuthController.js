/**
 * AuthController
 *
 * @description :: Server-side logic for managing auth
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
  login: function(req, res) {
    req.checkBody('password', sails.__('passwordRequired')).notEmpty();
    req.checkBody('email', sails.__('emailRequired')).notEmpty();
    req.checkBody('email',  sails.__('invalidEmail')).isEmail();

    var errors = req.validationErrors();

    if (errors) {
      return res.badRequest({
        success: false,
        message: 'validationError',
        error: errors
      });
    }

    passport.authenticate('local', function (err, user) {
      if (err) {
        return res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      }

      if (!user) {
        return res.badRequest({
          success: false,
          message: 'unauthorizedError',
          error:  UtilsService.errorFormatter(sails.__('incorrectEmailPassword'))
        });
      }

      var token = UtilsService.signToken(user);
      res.ok({
        success: true,
        data: {
          user: user,
          token: token
        }
      });
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.ok({
      success: true
    });
  }
};
