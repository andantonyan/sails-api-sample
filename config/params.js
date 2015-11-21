var sails = require('sails');

module.exports.params = [
  {
    name: 'tokenUser',
    param: 'tokenUser',
    func: function(token) {
      return sails.services.utilsservice.verifyToken(token)
        .then(function (user) {
          return sails.models.user.findOne({id: user.id, deleted: null});
        });
    }
  },
  {
    name: 'entityOwner',
    param: 'entityOwnerId',
    func: function(userId) {
      return sails.models.user.findOne({id: userId, deleted: null});
    }
  },
  {
    name: 'model',
    param: 'modelName',
    func: function(modelName) {
      return sails.models[modelName];
    }
  }
];
