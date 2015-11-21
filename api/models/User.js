/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    avatar: {
      type: 'string'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    verified: {
      type: 'boolean',
      defaultsTo: false
    },
    deleted: {
      type: 'date',
      defaultsTo: null
    },
    fullName: function () {
      return this.firstName + ' ' + this.lastName;
    },
    toJSON: function () {
      var obj = this.toObject();
      obj = _.pick(obj, User.publicFields);
      return obj;
    }
  },

  // TODO: Add initialFields

  editableFields: [
    'password',
    'email',
    'firstName',
    'lastName'
  ],

  publicFields: [
    'id',
    'email',
    'avatar',
    'verified',
    'firstName',
    'lastName'
  ],

  comparePassword: function (password, user, cb) {
    bcrypt.compare(password, user.password, function (err, match) {
      if(err) return cb(err);
      cb(null, match);
    })
  },

  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function () {}, function (err, hash) {
        if (err) {
          sails.log.error(err);
          return cb(err);
        }
        user.password = hash;
        cb(null, user);
      });
    });
  }
};
