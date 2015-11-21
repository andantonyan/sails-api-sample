/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#/documentation/concepts/Logging
 */

var path = require('path');
var pkgJSON = require(path.resolve('package.json'));

module.exports.log = {

  /***************************************************************************
   *                                                                          *
   * Valid `level` configs: i.e. the minimum log level to capture with        *
   * sails.log.*()                                                            *
   *                                                                          *
   * The order of precedence for log levels from lowest to highest is:        *
   * silly, verbose, info, debug, warn, error                                 *
   *                                                                          *
   * You may also set the level to "silent" to suppress all logs.             *
   *                                                                          *
   ***************************************************************************/

   level: 'info',
  //timestamp: true,

  // unlock dailyRorate transport!
  // more information: https://github.com/winstonjs/winston#daily-rotate-file-transport
  dailyRotate: {
    dirname: path.resolve('logs'),
    datePattern: '.yyyy-MM-dd.log',
    filename: pkgJSON.name,
    prettyPrint: true,
    timestamp: true,
    level: 'error'
  },

  // unlock mongoDB transport!
  // more information: https://github.com/winstonjs/winston/blob/master/docs/transports.md#mongodb-transport
  //mongoDB: {
  //  level: 'silly',
  //  db: pkgJSON.name,
  //  collection: 'logs',
  //  host: 'localhost',
  //  port: 27017
  //},

  // unlock custom transport!
  // more information: https://github.com/winstonjs/winston/blob/master/docs/transports.md
  //transports: [
  //  {
  //    module: require('winston-logio').Logio,
  //    config: {
  //      port: 28777,
  //      node_name: pkgJSON.name,
  //      host: '127.0.0.1'
  //    }
  //  }
  //]
};
