'use strict';

var util = require('util');

/**
 * Prototype of Extractor backends.
 *
 * @constructor
 */
function ExtractorPrototype() {
  this.name = 'Extractor Prototype';
  this.description = '';
  this.fallback = null;
}

/**
 * Return the human readable name of the extractor backend.
 *
 * @returns {string}
 */
ExtractorPrototype.prototype.getName = function () {
  var result = this.name;
  if (this.fallback) {
    result += ' [fallback: ' + this.fallback.name + ']';
  }
  if (this.description) {
    result += '\n' + this.description;
  }
  return result;
};

/**
 * Set the fallback extractor backend of the current backend.
 *
 * @param fallback
 */
ExtractorPrototype.prototype.setFallback = function (fallback) {
  this.fallback = fallback;
};

/**
 * Extract the content of the webpage in the given url.
 *
 * @param url
 *   Valid URL.
 */
ExtractorPrototype.prototype.extract = function (url, cb) {
  cb(null, {content: '', component: this.name})
};

module.exports = ExtractorPrototype;
