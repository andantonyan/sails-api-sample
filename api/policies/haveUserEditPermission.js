module.exports = function(req, res, next) {
  if (req.entityOwner && req.entityOwner.id === req.user.id) return next();
  return res.forbidden({
    success: false,
    message: 'permissionError',
    error: UtilsService.errorFormatter(sails.__('haveNotUserEditPermission'))
  });
};
