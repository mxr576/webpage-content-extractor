'use strict';

var express = require('express');
var validator = require('validator');
var router = express.Router();
var config = require('../modules/config');
var extractorFactory = require('../modules/extractors/extractor-factory.js');

var extractorInstance = extractorFactory.get(config.get('extractor'));

if (extractorInstance !== undefined) {
  console.log('[extractor] Selected extractor: ' + extractorInstance.getName());
}
else {
  console.log('[extractor] Extractor not found: ' + config.get('extractor'));
}

/**
 * Validate the given url.
 *
 * @param string url
 *   Valid url with http or https protocol.
 *
 * @returns boolean
 */
function isValidUrl(url) {
  var validatorOptions = {
    require_protocol: true,
    protocols: ['http', 'https']
  };

  return validator.isURL(url, validatorOptions);
};

router.get('/', function (req, res, next) {
  if (extractorInstance === undefined) {
    res.json({
      error: 'extractor not found',
      details: 'Extractor not found: ' + config.get('extractor')
    });
    return;
  }

  var url = req.query.url;

  if (url == undefined) {
    res.json({
      error: 'missing url parameter',
      details: 'Please provide an ?url=... parameter. (Example: http://cnn.com)'
    });
    return;
  }

  if (!isValidUrl(url)) {
    res.json({
      error: 'invalid url',
      details: url + ' is not a valid url parameter. (Example: http://cnn.com)'
    });
    return;
  }

  extractorInstance.fetch(url, function (error, data) {
    if (error) {
      res.statusCode = 400;
      res.json(error);
      return;
    }

    res.json({'content': data});
    return;
  });
});

module.exports = router;
