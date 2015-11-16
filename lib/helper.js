'use strict';

var FieldVal = require('fieldval');
var BasicVal = FieldVal.BasicVal;

/**
 * Helper function for async url validation.
 *
 * @param {string} url - URL to validate.
 * @param {callback} cb - Callback.
 */
exports.isValidUrl = function (url, cb) {
  var validator = new FieldVal({
    'url': url
  });
  validator.get_async('url', [BasicVal.url(true)], function (val) {
  });
  validator.end(function (error) {
    return cb(error);
  });
};
