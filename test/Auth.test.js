'use strict';

var should = require('chai').should();
var agent;
var sailsApp;

function generateEmail() {
  return Math.random().toString(36).substring(7) + '@email.com';
}

describe('Auth handler', function() {
  before(function() {
    agent = global.agent;
    sailsApp = global.sails;
  });

  describe('Login method', function () {
    var userData;
    var userEmail = generateEmail();

    before(function(done) {
      agent
        .post('/api/user/create')
        .send({
          email: userEmail,
          password: 'validPassword1#'
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          userData = res.body.data.user;
          done();
        });
    });

    describe('validation', function () {
      it('should send 400 error if email, password missing', function (done) {
        agent
          .post('/api/login')
          .expect(400, done);
      });

      it('should send 400 error if email missing', function (done) {
        agent
          .post('/api/login')
          .send({
            password: 'password'
          })
          .expect(400, done);
      });

      it('should send 400 error if password missing', function (done) {
        agent
          .post('/api/login')
          .send({
            email: userEmail
          })
          .expect(400, done);
      });

      it('should send 400 error if email invalid', function (done) {
        agent
          .post('/api/login')
          .send({
            password: 'validPassword1#',
            email: 'invalidEmail'
          })
          .expect(400, done);
      });

      it('should send 400 error if password invalid', function (done) {
        agent
          .post('/api/login')
          .send({
            password: 'inv',
            email: userEmail
          })
          .expect(400, done);
      });
    });

    describe('sign in user', function () {
      var signInResponse;
      before(function(done) {
        agent
          .post('/api/login')
          .send({
            email: userEmail,
            password: 'validPassword1#'
          })
          .expect(200, function (err, res) {
            if (err) return done(err);

            signInResponse = res.body;
            done();
          });
      });

      it('should send success message', function () {
        signInResponse.success.should.have.equal(true);
      });

      it('should send success message', function () {
        signInResponse.success.should.have.equal(true);
      });

      it('should send created user with required properties (email)', function () {
        signInResponse.data.user.email.should.have.equal(userEmail);
      });

      it('should send user valid token', function () {
        sailsApp.services.utilsservice.verifyToken(signInResponse.data.token)
          .then(function (fromToken) {
            fromToken.email.should.have.equal(signInResponse.data.user.email);
          })
      });
    });
  });
});
