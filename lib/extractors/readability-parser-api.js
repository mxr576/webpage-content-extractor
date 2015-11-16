'use strict';

var util = require('util');
var readability = require('readability-api');
var ExtractorPrototype = require('./extractor-prototype');

/**
 * Readability.com extractor backend.
 *
 * @constructor
 *
 * @param {string} parser_token - Readability Parser API key.
 */
function ReadabilityComExtractor(parser_token) {
  ExtractorPrototype.call(this);
  readability.configure({
    parser_token: parser_token
  });
  this.parser = new readability.parser();
  this.name = 'Readability.com: Parser API';
  this.description = 'Uses the readability.com\'s Parser API as a backend, which is an external service so it is less processor intensive on your computer.\n';
  this.description += 'Readability.com Parser API access token must be set up beforehand!';
}

util.inherits(ReadabilityComExtractor, ExtractorPrototype);

/**
 * @inheritDoc
 */
ReadabilityComExtractor.prototype.extract = function (url, cb) {
  var self = this;
  this.parser.parse(url, function (error, parsed) {
    if (!error) {
      return cb(null, {content: parsed.content, component: self.name});
    }
    else {
      return cb({error: error, component: self.name}, null);
    }
  });
};

module.exports = ReadabilityComExtractor;
