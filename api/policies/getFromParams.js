var Q = require('q');

module.exports = function(req, res, next) {
  var promises;

  promises = _.map(sails.config.params, function (item) {
    var id = req.params[item.param];
    if (id) {
      return item.func(id);
    } else {
      return null;
    }
  });

  return Q.all(promises)
    .then(function (results) {
      _.forEach(sails.config.params, function (item, index) {
        req[item.name] = results[index];
      });
      next();
    })
    .catch(function (err) {
      var responseMap = UtilsService.errorResponseMap(err);
      var responseBody = {
        success: false,
        message: responseMap.message,
        error: UtilsService.errorFormatter(sails.__('serverError')),
        serverError: UtilsService.errorFormatter(err)
      };
      res[responseMap.method](responseMap.body ? responseBody : undefined);
    });
};
