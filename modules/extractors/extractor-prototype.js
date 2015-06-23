'use strict';

/**
 * Parent prototype of Extractor backends.
 *
 * @constructor
 */
function ExtractorPrototype() {
  this.name = 'Parent Extractor Prototype';
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
}

/**
 * Set the fallback extractor backend of the current backend.
 *
 * @param fallback
 */
ExtractorPrototype.prototype.setFallback = function (fallback) {
  this.fallback = fallback;
};

/**
 * Fetch the content from the link.
 *
 *
 * @param link
 *   Valid URL.
 * @param cb
 *   Callback function which returns the error or the data.
 *
 * @returns {*}
 */
ExtractorPrototype.prototype.fetch = function (link, cb) {
  return cb(null, {'content': 'Fetched content of ' + link});
};

module.exports = ExtractorPrototype;
