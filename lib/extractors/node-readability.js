'use strict';

var util = require('util');
var node_readability = require('node-readability');
var ExtractorPrototype = require('./extractor-prototype');

/**
 * Node-readability extractor backend.
 *
 * @constructor
 */
function NodeReadabilityExtractor() {
  ExtractorPrototype.call(this);
  this.name = 'Node\'s Readability Extractor';
  this.description = 'Uses the node-readability module as an extractor.';
}

util.inherits(NodeReadabilityExtractor, ExtractorPrototype);

/**
 * @inheritDoc
 */
NodeReadabilityExtractor.prototype.extract = function (url, cb) {
  var self = this;
  node_readability(url, {gzip: true, jar: true, maxRedirects: 5}, function (error, article, meta) {
    if (error || article === undefined || article.content === false) {
      return cb({error: error, component: self.name}, null);
    }
    else {
      article.close();
      return cb(null, {content: article.content, component: self.name});
    }
  });
};

module.exports = NodeReadabilityExtractor;
