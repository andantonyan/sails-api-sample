'use strict';

var should = require('chai').should();
var agent;
var sailsApp;

function generateEmail() {
  return Math.random().toString(36).substring(7) + '@email.com';
}

describe('Image handler', function() {
  before(function() {
    agent = global.agent;
    sailsApp = global.sails;
  });

  describe('Get Upload Url', function () {
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
          token = 'Bearer ' + res.body.data.token;
          done();
        });
    });

    describe('authorization', function () {
      it('should send 401 if token does not exist', function (done) {
        agent
          .get('/api/image/upload-url?type=image/png')
          .expect(401, done);
      });
    });

    describe('validation', function () {
      it('should send 400 if type is missing', function (done) {
        agent
          .get('/api/image/upload-url')
          .set('authorization', token)
          .expect(400, done);
      });
    });

    describe('validation', function () {
      it('should send 400 if type is invalid', function (done) {
        agent
          .get('/api/image/upload-url?type=invalid')
          .set('authorization', token)
          .expect(400, done);
      });
    });

    describe('should send upload url', function () {
      var response;
      before(function(done) {
        agent
          .get('/api/image/upload-url?type=image/png')
          .set('authorization', token)
          .expect(200, function (err, res) {
            if (err) {
              return done(err);
            }

            response = res.body;
            done();
          });
      });

      it('should send success message', function () {
        response.success.should.have.equal(true);
      });

      it('should send token', function () {
        response.data.should.have.property('token')
      });

      it('should send url', function () {
        response.data.should.have.property('url')
      });
    });
  });
});
