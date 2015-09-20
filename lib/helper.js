'use strict';

var FieldVal = require('fieldval');
var BasicVal = FieldVal.BasicVal;

/**
 * Helper function for async url validation.
 */
exports.isValidUrl = function (url, cb) {
  var validator = new FieldVal({
    'url': url
  });
  validator.get_async('url', [BasicVal.url(true)], function (val) {
  });
  validator.end(function (error) {
    cb(error);
  });
};
