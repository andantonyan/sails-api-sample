'use strict';

var should = require('chai').should();
var agent;

describe('Api main handler', function() {

  before(function() {
    agent = global.agent;
  });

  it('should return app version and name', function (done) {
    agent.get('/')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        res.body.name.should.be.equal('sails-api-sample');
        res.body.version.should.be.equal('0.0.1');
      })
      .expect(200, done);
  });

});
