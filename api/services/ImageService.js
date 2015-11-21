var AWS = require('aws-sdk');
var shortId = require('shortid');
var mime = require('mime');
var Q = require('q');

shortId.seed(process.pid * new Date());

module.exports = {
  clientKeyS3: 's3',
  init: function () {
    AWS.config.update({accessKeyId: sails.config.amazon.s3.accessKeyId, secretAccessKey: sails.config.amazon.s3.secretAccessKey});
    _.forEach(sails.config.amazon.s3.buckets, function (v, k) {
      this[this.clientKeyS3 + k] = new AWS.S3({param: {Bucket: v}});
    }.bind(this));
  },

  sign: function (mimeType, prefix, bucket) {
    bucket = bucket || sails.config.amazon.s3.defaultBucket;
    var s3Object = prefix + '_' + shortId.generate() + '.' + mime.extension(mimeType);

    var params = {
      Bucket: sails.config.amazon.s3.buckets[bucket],
      Key: s3Object,
      Expires: 900,
      ContentType: mimeType
    };

    var url = this[this.clientKeyS3 + bucket].getSignedUrl('putObject', params);
    var finalImageUrl = url.substring(0, url.indexOf('?'));

    return {
      url: url,
      token: UtilsService.signToken(finalImageUrl)
    };
  },

  deleteObject: function (key, bucket) {
    bucket = bucket || sails.config.amazon.s3.defaultBucket;
    var defer = Q.defer();
    var params = {
      Bucket: sails.sails.config.amazon.s3.buckets[bucket],
      Key: key
    };

    this[this.clientKeyS3 + bucket].deleteObject(params, defer.makeNodeResolver());
    return defer.promise;
  }
};

