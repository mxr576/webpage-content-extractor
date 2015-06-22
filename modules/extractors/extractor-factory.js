'use strict';

var config = require('../config');

var extractorBackendFactory = {};

/**
 * Factory to get the exporter backend based on the config settings.
 *
 * @returns
 *   Extractor backend.
 */
extractorBackendFactory.get = function () {
  var ExtractorBackend;
  var FallbackExtractorBackend;
  var extractorBackendInstance;

  switch (config.get('extractor')) {
    case 'node-readability':
      ExtractorBackend = require('./node-readability.js');
      extractorBackendInstance = new ExtractorBackend();
      // Set node-unfluff as a fallback.
      FallbackExtractorBackend = require('./node-unfluff.js');
      extractorBackendInstance.setFallback(new FallbackExtractorBackend());
      break;

    case 'readability-com':
      ExtractorBackend = require('./readability-com.js');
      extractorBackendInstance = new ExtractorBackend(config.get('readability:token'));
      // Set node-readability as fallback.
      // It will be useful if we exhausted the limit of the Readability Parser's API.
      FallbackExtractorBackend = require('./node-readability.js');
      extractorBackendInstance.setFallback(new FallbackExtractorBackend());
      break;

    case 'node-unfluff':
      ExtractorBackend = require('./node-unfluff.js');
      extractorBackendInstance = new ExtractorBackend();
      // Set node-readability as a fallback.
      FallbackExtractorBackend = require('./node-readability.js');
      extractorBackendInstance.setFallback(new FallbackExtractorBackend());
      break;
  }

  return extractorBackendInstance;
};

module.exports = extractorBackendFactory;
