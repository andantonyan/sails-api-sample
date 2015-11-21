#!/usr/bin/env node

process.env.NODE_ENV = 'development';

//process.env.NODE_ENV = 'production';
//process.env.MONGOLAB_URI = '';

var sails = require('sails');
var rc = require('rc');
var sailsApp;

sails.load(rc('sails'), function (err, server) {
  sailsApp = server;
  if (err) return sails.log.error(err);
  sample();
});

function sample() {

}
