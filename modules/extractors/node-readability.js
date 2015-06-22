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
  NodeReadabilityExtractor.super_.call(this);
  this.name = 'Node\'s Readability Extractor';
  this.description = 'Uses a node-readability module as an extractor.';
}

util.inherits(NodeReadabilityExtractor, ExtractorPrototype);

/**
 * @inheritDoc
 */
NodeReadabilityExtractor.prototype.fetch = function (link, cb) {
  var self = this;
  node_readability(link, {gzip: true}, function (error, article, meta) {
    if (error || article === undefined || article.content === false) {
      if (self.fallback) {
        self.fallback.fetch(link, cb);
        return;
      } else {
        cb({'error': error, 'url': link}, null);
        return;
      }
    }

    article.close();
    cb(null, article.content);

    return;
  });
};

module.exports = NodeReadabilityExtractor;