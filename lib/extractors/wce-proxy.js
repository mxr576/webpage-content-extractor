'use strict';

var util = require('util');
var request = require('request');
var ExtractorPrototype = require('./extractor-prototype');

/**
 * WCEProxy extractor backend.
 *
 * @constructor
 */
function WCEProxy(url) {
  ExtractorPrototype.call(this);
  this.name = 'Webpage Content Extractor Proxy';
  this.url = url;
  this.description = 'Uses a Webpage Content Extractor Proxy (which searches in a database) as a backend to find the previously saved content of the website.';
}

util.inherits(WCEProxy, ExtractorPrototype);

/**
 * @inheritDoc
 */
WCEProxy.prototype.extract = function (url, cb) {
  var self = this;
  var handleResponse = function (error, response, body) {
    if (error) {
      var details = error ? error : body;
      return cb({error: details, component: self.name}, null);
    }
    else if (response.statusCode === 200) {
      return cb(null, {content: body, component: self.name});
    }
    else if (response.statusCode === 204) {
      return cb({error: 'Not found!', component: self.name}, null);
    }
    else {
      var details = error ? error : body;
      return cb({error: details, component: self.name}, null);
    }
  };

  request({
    url: self.url,
    //json: true,
    headers: {
      "Accept": "application/json"
    },
    qs: {url: url}
  }, handleResponse);
};


/**
 * Store the extracted content of the webpage on the Proxy server.
 *
 * @param {string} url - URL of the webpage.
 * @param {string} content - Extracted content of the site.
 * @param {callback} cb - Callback.
 */
WCEProxy.prototype.store = function (url, content, cb) {
  var self = this;
  var handleResponse = function (error, response, body) {
    if (error) {
      return cb({error: error, component: self.name + ': Store'}, null);
    }
    else if (response.statusCode === 200 && body !== 'Success') {
      return cb({error: body, component: self.name + ': Store'}, null);
    }
    else {
      return cb({error: body, component: self.name + ': Store'}, null);
    }
  };

  request({
    url: self.url,
    json: true,
    body: {url: url, content: content},
    headers: {
      "Accept": "application/json"
    },
    method: 'POST'
  }, handleResponse);
};

module.exports = WCEProxy;
