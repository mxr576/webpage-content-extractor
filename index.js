'use strict';

var EventEmitter = require('events').EventEmitter;
var extractorFactory = require('./lib/extractors/extractor-factory');
var util = require('util');
var _ = require('underscore');
var helper = require('./lib/helper');

function WebPageContentExtractor(extractors, options) {
  this.extractor = extractorFactory.get(extractors, options);
  this.proxy = _.indexOf(extractors, 'wce-proxy') == '-1' ? null : extractorFactory.get(['wce-proxy'], options);
}

WebPageContentExtractor.prototype.extract = function (url, extractor, emitter, errors) {
  var self = this;
  var emitter = emitter ? emitter : new EventEmitter();
  var error_log = errors ? errors : [];
  if (!extractor) {
    extractor = self.extractor;
    helper.isValidUrl(url, function (error) {
      if (error) {
        throw new Error(util.format('Invalid URL: "%s"', url));
      }
    });
  }

  extractor.extract(url, function (error, result) {
    if (error) {
      if (extractor.fallback) {
        error_log.push(error);
        self.extract(url, extractor.fallback, emitter, error_log);
      }
      else {
        error_log.push(error);
        return emitter.emit('error', error_log);
      }
    }
    else {
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
