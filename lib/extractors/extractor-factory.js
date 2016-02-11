'use strict';
var _ = require('underscore');
var winston = require('winston');
var logger = new (winston.Logger)({});
logger.add(winston.transports.Console, {
  prettyPrint: true,
  colorize: true
});

/**
 * Extractor Factory.
 *
 * @param {string[]} extractors - Name of the extractors in order.
 * @param {string[]} options - Settings of the extractors.
 *
 * @param {Object} parent_instance - Extractor object, which fallback should be
 * set this time.
 *
 * @return {Object} - The (first) extractor object and the recursively set
 * fallbacks, if any.
 */
module.exports = {
  get: function (extractors, options, parent_instance) {
    if (!_.isArray(extractors)) {
      throw new Error('Extractors is not an array!');
    }
    if (!_.isObject(options)) {
      throw new Error('Options is not an object!');
    }
    // Clean up the extractors array from duplicates and false values.
    // This is only necessary, if the parent_instance is not set, in other
    // words: on the first run.
    if (!parent_instance) {
      extractors = _.compact(extractors);
      extractors = _.uniq(extractors);
      // Validate the content of the extractors array, first part.
      // If readability.com API selected, then the API token must be provided.
      if (_.indexOf(extractors, 'readability-parser-api') != '-1' && !_.has(options, 'readability_token') && _.isEmpty(options.readability_token)) {
        logger.log('warn', 'Readability Parser API is in the selected extractors, but the Parser API token is missing, that is why it will be removed from the selected extractors!');
        extractors.splice(extractors.indexOf('readability-parser-api'), 1);
        extractors = _.without(extractors, 'readability-parser-api');
      }
      // If WCE-Proxy selected, then the url of the WCE-Proxy must be provided.
      if (_.indexOf(extractors, 'wce-proxy') != '-1' && !_.has(options, 'wce_proxy_url') && _.isEmpty(options.wce_proxy_url)) {
        logger.log('warn', 'WCE Proxy is in the selected extractors, but the URL of the proxy is missing from the configuration file, that is why it will be removed from the selected extractors!');
        extractors = _.without(extractors, 'wce-proxy');
      }
      // If nothing left after the validation, then drop an error.
      if (_.size(extractors) === 0) {
        throw new Error('Extractors is an empty array!');
      }
    }

    var Extractor, instance;
    var valid_extractors = ['node-readability', 'node-unfluff', 'readability-parser-api', 'read-art', 'wce-proxy'];
    var primary_extractor = _.first(extractors);
    // Validate the extractors, second part.
    if (_.indexOf(valid_extractors, primary_extractor) == '-1') {
      logger.log('warn', '"%s" extractor is unknown, continue with read-art as the primary extractor!\nAvailable extractors: %s', primary_extractor, valid_extractors.toString());
      extractors = _.without(extractors, primary_extractor);
      primary_extractor = 'read-art';
    }

    Extractor = require('./' + primary_extractor + '.js');
    // Initialize Readability Parser API wrapper properly.
    if (primary_extractor === 'readability-parser-api') {
      instance = new Extractor(options.readability_token);
    }
    // Initialize WCE properly.
    else if (primary_extractor === 'wce-proxy') {
      instance = new Extractor(options.wce_proxy_url);
    }
    else {
      instance = new Extractor();
    }
    extractors = _.without(extractors, primary_extractor);

    // There were more than 1 valid extractor selected, so
    // call the function again recursively.
    if (_.size(extractors) !== 0) {
      this.get(extractors, options, instance);
    }

    // If the parent instance set, then set the current extractor
    // instance as its fallback.
    if (parent_instance) {
      parent_instance.setFallback(instance);
    }

    return parent_instance ? parent_instance : instance;
  }
};
