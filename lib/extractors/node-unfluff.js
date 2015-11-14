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
  this.description = 'Uses the node-unfluff module as a backend which extracts HTML free (plain) text content.';
}

util.inherits(NodeUnfluffExtractor, ExtractorPrototype);

/**
 * @inheritDoc
 */
NodeUnfluffExtractor.prototype.extract = function (url, cb) {
  var self = this;
  var handleResponse = function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var article = unfluff.lazy(body);
      return cb(null, {content: article.text(), component: self.name});
    }
    else {
      var details = body ? JSON.parse(body) : error;
      return cb({error: details, component: self.name}, null);
    }
  };

  request({url: url, gzip: true, jar: true, maxRedirects: 5}, handleResponse);
};

module.exports = NodeUnfluffExtractor;
