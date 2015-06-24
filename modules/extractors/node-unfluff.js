'use strict';

var util = require('util');
var request = require('request');
var unfluff = require('unfluff');
var ExtractorPrototype = require('./extractor-prototype');

/**
 * Node-unfluff extractor backend.
 *
 * @constructor
 */
function NodeUnfluffExtractor() {
  ExtractorPrototype.call(this);
  this.name = 'Node\'s Unfluff Extractor';
  this.description = 'Uses a node-unfluff module as a backend which extracts HTML free (plain) text content.';
}

util.inherits(NodeUnfluffExtractor, ExtractorPrototype);

/**
 * @inheritDoc
 */
NodeUnfluffExtractor.prototype.fetch = function (link, cb) {
  var self = this;
  var handleResponse = function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var article = unfluff.lazy(body);
      var content = article.text();
      cb(null, content);
      return;
    }

    if (self.fallback) {
      self.fallback.fetch(link, cb);
      return;
    } else {
      var details = body ? JSON.parse(body) : error.toString();
      cb({error: 'fetch error', details: details,  url: link, extractor: self.name}, null);
      return;
    }
  };

  request(link, handleResponse);
};

module.exports = NodeUnfluffExtractor;
