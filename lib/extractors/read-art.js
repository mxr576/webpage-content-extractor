'use strict';

var util = require('util');
var read = require('read-art');
var ExtractorPrototype = require('./extractor-prototype');

/**
 * Read-art extractor backend.
 *
 * @constructor
 */
function ReadArt() {
  ExtractorPrototype.call(this);
  this.name = 'Read-art Extractor';
  this.description = 'Uses the read-art module as an extractor.';
}

util.inherits(ReadArt, ExtractorPrototype);

/**
 * @inheritDoc
 */
ReadArt.prototype.extract = function (url, cb) {
  var self = this;
  read(url, {agent: true, trackCookie: true, maxRedirects: 5}, function (error, article, options, resp) {
    if (error) {
      return cb({error: error, component: self.name}, null);
    }
    else {
      return cb(null, {content: article.content, component: self.name});
    }
  });
};

module.exports = ReadArt;
