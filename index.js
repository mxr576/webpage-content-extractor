'use strict';

var EventEmitter = require('events').EventEmitter;
var extractorFactory = require('./lib/extractors/extractor-factory');
var util = require('util');
var _ = require('underscore');
var helper = require('./lib/helper');

/**
 * WebPage Content Extractor.
 *
 * @param {string[]} extractors - Name of the extractors in order.
 * @param {string[]} options - Settings of the extractors.
 *
 * @constructor
 */
function WebPageContentExtractor(extractors, options) {
  this.extractor = extractorFactory.get(extractors, options);
  this.proxy = _.indexOf(extractors, 'wce-proxy') == '-1' ? null : extractorFactory.get(['wce-proxy'], options);
}

/**
 * Extract the content of the url with the extractors.
 *
 * @param {string} url - Valid URL.
 * @param {Object} extractor - Current Extractor object.
 * @param {Object} emitter - EventEmitter object.
 * @param {Object[]} errors - Array of error objects.
 * @returns {Object}
 */
WebPageContentExtractor.prototype.extract = function (url, extractor, emitter, errors) {
  var self = this;
  // Make sure that these variables are initialized.
  var emitter = emitter ? emitter : new EventEmitter();
  var error_log = errors ? errors : [];

  if (!extractor) {
    extractor = self.extractor;
    // Validate the URL first.
    helper.isValidUrl(url, function (error) {
      if (error) {
        throw new Error(util.format('Invalid URL: "%s"', url));
      }
    });
  }

  // Call the current extractor's extract function.
  extractor.extract(url, function (error, result) {
    if (error) {
      // If this extractor has fallback, call this function with fallback
      // recursively.
      // Pass the the current extractor's error too.
      if (extractor.fallback) {
        error_log.push(error);
        return self.extract(url, extractor.fallback, emitter, error_log);
      }
      else {
        error_log.push(error);
        return emitter.emit('error', error_log);
      }
    }
    else {
      // Check, if WCE-Proxy in use. If yes. try to store the extracted content.
      if (self.proxy) {
        self.proxy.store(url, result.content, function (error) {
          if (error) {
            error_log.push(error);
          }
        });
      }
      return emitter.emit('success', result, error_log);
    }
  });

  return emitter;
};

module.exports = WebPageContentExtractor;
