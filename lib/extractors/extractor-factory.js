'use strict';
var _ = require('underscore');
var winston = require('winston');
var logger = new (winston.Logger)({});
logger.add(winston.transports.Console, {
  prettyPrint: true,
  colorize: true
});

/**
 * Exporter factory.
 */
module.exports = {
  get: function (extractors, options, parent_instance) {
    if (!_.isArray(extractors)) {
      throw new Error('extractors is not an array!');
    }
    if (!_.isObject(options)) {
      throw new Error('options is not an object!');
    }
    // Clean up the extractors array from duplicates and false values.
    extractors = _.compact(extractors);
    extractors = _.uniq(extractors);
    // Validate the content of the extractors array.
    if (_.indexOf(extractors, 'readability-parser-api') != '-1' && !_.has(options, 'readability_token') && _.isEmpty(options.readability_token)) {
      logger.log('warn', 'Readability Parser API is in the selected extractors, but the Parser API token is missing, that is why it will be removed from the selected extractors!');
      extractors.splice(extractors.indexOf('readability-parser-api'), 1);
      extractors = _.without(extractors, 'readability-parser-api');
    }
    if (_.indexOf(extractors, 'wce-proxy') != '-1' && !_.has(options, 'wce_proxy_url') && _.isEmpty(options.wce_proxy_url)) {
      logger.log('warn', 'WCE Proxy is in the selected extractors, but the URL of the proxy is missing from the configuration file, that is why it will be removed from the selected extractors!');
      extractors = _.without(extractors, 'wce-proxy');
    }
    if (_.size(extractors) === 0) {
      throw new Error('extractors is an empty array!');
    }

    var Extractor, instance;
    var valid_extractors = ['node-readability', 'node-unfluff', 'readability-parser-api', 'read-art', 'wce-proxy'];
    var primary_extractor = _.first(extractors);

    if (_.indexOf(valid_extractors, primary_extractor) == '-1') {
      logger.log('warn', '"%s" extractor is unknown, continue with read-art as the primary extractor!\nAvailable extractors: %s', primary_extractor, valid_extractors.toString());
      extractors = _.without(extractors, primary_extractor);
      primary_extractor = 'read-art';
    }

    Extractor = require('./' + primary_extractor + '.js');
    if (primary_extractor === 'readability-parser-api') {
      instance = new Extractor(options.readability_token);
    }
    else if (primary_extractor === 'wce-proxy') {
      instance = new Extractor(options.wce_proxy_url);
    }
    else {
      instance = new Extractor();
    }
    extractors = _.without(extractors, primary_extractor);

    if (_.size(extractors) !== 0) {
      this.get(extractors, options, instance);
    }

    if (parent_instance) {
      parent_instance.setFallback(instance);
    }

    return parent_instance ? parent_instance : instance;
  }
};