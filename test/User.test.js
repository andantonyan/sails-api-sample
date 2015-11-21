'use strict';

var should = require('chai').should();
var fs = require('fs');
var agent;
var sailsApp;

function generateEmail() {
  return Math.random().toString(36).substring(7) + '@email.com';
}

describe('User handler', function() {
  before(function() {
    agent = global.agent;
    sailsApp = global.sails;
  });

  describe('Create account', function () {
    var userEmail = generateEmail();
    describe('validation', function () {
      it('should send 400 error if email, password missing', function (done) {
        agent
          .post('/api/user/create')
          .expect(400, done);
      });

      it('should send 400 error if email missing', function (done) {
        agent
          .post('/api/user/create')
          .send({
            password: 'password'
          })
          .expect(400, done);
      });

      it('should send 400 error if email invalid', function (done) {
        agent
          .post('/api/user/create')
          .send({
            password: 'password',
            email: 'inv'
          })
          .expect(400, done);
      });

      it('should send 400 error if password missing', function (done) {
        agent
          .post('/api/user/create')
          .send({
            email: userEmail
          })
          .expect(400, done);
      });


      it('should send 400 error if password length is less than 6', function (done) {
        agent
          .post('/api/user/create')
          .send({
            email: userEmail,
            password: 'inv'
          })
          .expect(400, done);
      });

      it('should send 400 error if password length is more than 20', function (done) {
        agent
          .post('/api/user/create')
          .send({
            email: userEmail,
            password: 'invaliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiid1#'
          })
          .expect(400, done);
      });
    });

    describe('user account', function () {
      var newUserResponse;

      before(function (done) {
        agent
          .post('/api/user/create')
          .send({
            email: userEmail,
            password: 'validPassword1#'
          })
          .expect(200, function (err, res) {
            if (err) {
              return done(err);
            }
            newUserResponse = res.body;
            done();
          });
      });

      it('should send success message', function () {
        newUserResponse.success.should.have.equal(true);
      });

      it('should send created user with required properties (email)', function () {
        newUserResponse.data.user.email.should.have.equal(userEmail);
      });

      it('should send user valid token', function () {
        sailsApp.services.utilsservice.verifyToken(newUserResponse.data.token.data.token)
          .then(function (fromToken) {
            fromToken.email.should.have.equal(newUserResponse.data.user.email);
          });
      });

      it('should send 400 if email already exist', function (done) {
        var existingUserEmail = generateEmail();
        agent
          .post('/api/user/create')
          .send({
            email: existingUserEmail,
            password: 'validPassword1#'
          })
          .expect(200, function (err) {
            if (err) {
              return done(err);
            }

            agent
              .post('/api/user/create')
              .send({
                email: existingUserEmail,
                password: 'validPassword1#'
              })
              .expect(400, done);
          });
      });

      describe('email verification', function () {
        var newUserResponse;
        var emailContent;

        before(function (done) {
          fs.unlink('.tmp/email.txt', function () {
            agent
              .post('/api/user/create')
              .send({
                email: generateEmail(),
                password: 'validPassword1#'
              })
              .expect(200, function (err, res) {
                if (err) return done(err);
                newUserResponse = res.body;
                fs.readFile('.tmp/email.txt', 'utf-8', function (err, text) {
                  if (err) return done(err);
                  emailContent = text;
                  done();
                });
              });
          });
        });

        it('should set token in email', function () {
          emailContent.match(newUserResponse.data.token).length.should.have.equal(1);
        });

        it('should set webapp uri in email', function () {
          emailContent.match(sailsApp.config.webAppUri).length.should.have.equal(1);
        });
      })
    });
  });

  describe('Update method', function () {
    var token;
    var user;

    before(function(done) {
      agent
        .post('/api/user/create')
        .send({
          email: generateEmail(),
          password: 'validPassword1#'
        })
        .expect(200, function (err, res) {
          if (err) {
            return done(err);
          }
          token = 'Bearer ' + res.body.data.token;
          user = res.body.data.user;

          done();
        });
    });

    describe('authorization', function () {
      it('should send 401 if token does not exist', function (done) {
        agent
          .put('/api/user/' + user.id)
          .expect(401, done);
      });
    });

    describe('permission', function () {
      var otherUser;
      before(function(done) {
        sailsApp.models.user
          .create({
            email: generateEmail(),
            password: 'validPassword1#'
          })
          .then(function (user) {
            otherUser = user;
            done();
          });
      });

      it('should send 403 error when trying to update other user profile', function (done) {
        agent
          .put('/api/user/' + otherUser.id)
          .set('authorization', token)
          .expect(403, done);
      });
    });

    describe('update', function () {
      //TODO:
    });

  });

  describe('Me method', function () {
    var token;
    var userEmail = generateEmail();

    before(function(done) {
      agent
        .post('/api/user/create')
        .send({
          email: userEmail,
          password: 'validPassword1#'
        })
        .expect(200, function (err, res) {
          if (err) {
            return done(err);
          }
          token = 'Bearer ' + res.body.data.token;
          done();
        });
    });

    describe('authorization', function () {
      it('should send 401 if token does not exist', function (done) {
        agent
          .get('/api/user/me')
          .expect(401, done);
      });
    });

    describe('should send user', function () {
      var meResponse;
      before(function(done) {
        agent
          .get('/api/user/me')
          .set('authorization', token)
          .expect(200, function (err, res) {
            if (err) {
              return done(err);
            }

            meResponse = res.body;
            done();
          });
      });

      it('should send success message', function () {
        meResponse.success.should.have.equal(true);
      });

      it('should send current user', function () {
        meResponse.data.email.should.have.equal(userEmail);
      });
    });
  });

  describe('Verify method', function () {
    describe('token validation', function () {
      it('should send 404 if token is invalid', function (done) {
        agent
          .put('/api/user/verify/' + 'invalid-token')
          .expect(404, done);
      });
    });

    describe('should send verified user', function () {
      var verifyResponse;
      var token;

      before(function(done) {
        agent
          .post('/api/user/create')
          .send({
            email: generateEmail(),
            password: 'validPassword1#'
          })
          .expect(200, function (err, res) {
            if (err) {
              return done(err);
            }

            token = res.body.data.token;

            agent
              .put('/api/user/verify/' + token)
              .expect(200, function (err, res) {
                if (err) {
                  return done(err);
                }

                verifyResponse = res.body;
                done();
              });
          });
      });

      it('should send success message', function () {
        verifyResponse.success.should.have.equal(true);
      });

      it('should set verified true', function () {
        verifyResponse.data.verified.should.have.equal(true);
      });

      it('should send 404 if user already verified account ', function (done) {
        agent
          .put('/api/user/verify/' + token)
          .expect(404, done);
      });
    });
  });
});
