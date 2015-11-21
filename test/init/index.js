process.env.NODE_ENV = 'testing';

var sails = require('sails');
var rc = require('rc');
var supertest = require('supertest');
var _ = require('lodash');
var Q = require('q');
var agent;
var sailsApp;

before(function(done) {
  this.timeout(10000);
  sails.load(rc('sails'), function (err, server) {
    if (err) return done(err);
    sailsApp = server;
    agent = supertest(sailsApp.hooks.http.app);
    global.agent = agent;
    global.sailsApp = sailsApp;

    sailsApp.services.imageservice.init();

    var dropPromise = _.map(sailsApp.models, function(model) {
      return model.destroy();
    });

    return Q.all(dropPromise)
      .finally(function () {
        done();
      });
  });
});
