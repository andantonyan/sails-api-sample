/**
 * UserController
 *
 * @description :: Server-side logic for managing user
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    req.checkBody('password', sails.__('passwordRequired')).notEmpty();
    req.checkBody('password', sails.__('passwordRequirements')).passwordValidator();
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

    var body = _.pick(req.body, User.editableFields);
    var token;

    function create() {
      var newUser;

      return User.create(body)
        .then(function (user) {
          newUser = user;
          token = UtilsService.signToken(newUser);
          return EmailService.sendUserVerificationEmail(newUser, token);
        })
        .then(function () {
          res.ok({
            success: true,
            data: {
              user: newUser,
              token: token
            }
          });
        })
    }

    return UserService.isEmailTaken(body.email)
      .then(function (exists) {
        if (exists) {
          return res.badRequest({
            success: false,
            message: 'validationError',
            error: UtilsService.errorFormatter(sails.__('emailTaken'))
          });
        }
        return create();
      })
      .catch(function (err) {
        res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      });
  },

  update: function (req, res) {
    var body = _.pick(req.body, _.without(User.editableFields, 'email', 'password'));
    req.user = _.extend(req.user, body);

    return req.user.save()
      .then(function (user) {
         res.ok({
          success: true,
          data: user
        });
      })
      .catch(function (err) {
        res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      });
  },

  me: function (req, res) {
    return User.findOne({id: req.user.id, deleted: null})
      .then(function (user) {
        res.ok({
          success: true,
          data: user
        });
      })
      .catch(function (err) {
        res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      });
  },

  getById: function (req, res) {
    if (!req.entityOwner) return res.notFound();
    return User.findOne({id: req.entityOwner.id, deleted: null})
      .then(function (user) {
        res.ok({
          success: true,
          data: user
        });
      })
      .catch(function (err) {
        res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      });
  },

  verify: function (req, res) {
    if (!req.tokenUser || req.tokenUser.verified) return res.notFound();

    req.tokenUser.verified = true;
    return req.tokenUser.save()
      .then(function (user) {
        res.ok({
          success: true,
          data: user
        });
      })
      .catch(function (err) {
        res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      });
  },

  updateAvatar: function (req, res) {
    return UtilsService.verifyToken(req.body.avatar)
      .then(function (avatar) {
        req.user.avatar = avatar;
        return req.user.save();
      })
      .then(function (user) {
        res.ok({
          success: true,
          data: user
        });
      })
      .catch(function (err) {
        res.serverError({
          success: false,
          message: 'serverError',
          error: UtilsService.errorFormatter(sails.__('serverError')),
          serverError: UtilsService.errorFormatter(err)
        });
      });
  }
};
