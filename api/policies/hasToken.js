module.exports = function (req, res, next) {
  var token = req.headers['authorization'] || req.headers['x-access-token'] || (req.body && req.body.token) || (req.query && req.query.token);
  if (!token) {
    return res.unauthorized({
      success: false,
      message: 'unauthorizedError',
      error: UtilsService.errorFormatter(sails.__('noToken'))
    });
  }

  if (!/Bearer/.test(token)) {
    return res.unauthorized({
      success: false,
      message: 'unauthorizedError',
      error: UtilsService.errorFormatter(sails.__('noTokenKey'))
    });
  }

  token = token.split(' ')[1];

  if (!token) {
    return res.unauthorized({
      success: false,
      message: 'unauthorizedError',
      error: UtilsService.errorFormatter(sails.__('noToken'))
    });
  }

  return UtilsService.verifyToken(token)
    .then(function (decodedUser) {
      return User.findOne({id: decodedUser.id, deleted: null});
    })
    .then(function (user) {
      if (!user) {
        return res.unauthorized({
          success: false,
          message: 'unauthorizedError',
          error: UtilsService.errorFormatter(sails.__('failedAuthenticateUserDeletedOrTokenExpires'))
        });
      }
      req.user = user;
      next();
    })
    .catch(function (err) {
      sails.log.error(err);
      return res.unauthorized({
        success: false,
        message: 'unauthorizedError',
        error: UtilsService.errorFormatter(sails.__('invalidToken'))
      });
    });
};
