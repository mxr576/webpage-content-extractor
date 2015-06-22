'use strict';

var util = require('util');
var request = require('request');
var ExtractorPrototype = require('./extractor-prototype');

/**
 * Readability.com extractor backend.
 *
 * @param token
 *   Readability Parser API key.
 *
 * @constructor
 */
function ReadabilityComExtractor(token) {
  ReadabilityComExtractor.super_.call(this);
  this.token = token;
  this.name = 'Readability.com Parser';
  this.description = 'Uses readability.com\'s parser as a backend, which is an external service so it is less processor intensive on your computer.\n';
  this.description += 'Readability.com access token must be set up beforehand!';
}

util.inherits(ReadabilityComExtractor, ExtractorPrototype);

/**
 * @inheritDoc
 */
ReadabilityComExtractor.prototype.fetch = function (link, cb) {
  var url = 'http://readability.com/api/content/v1/parser?url=' + encodeURIComponent(link) + '&token=' + this.token;
  var self = this;

  var handleResponse = function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var article = JSON.parse(body);
      cb(null, article.content);
      return;
    }

    if (self.fallback) {
      self.fallback.fetch(link, cb);
      return;
    } else {
      cb({
        'error': response.statusCode,
        'message': JSON.parse(body).message,
        'url': url
      }, null);
      return;
    }
  };

  request(url, handleResponse);
};

module.exports = ReadabilityComExtractor;