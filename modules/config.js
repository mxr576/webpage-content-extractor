'use strict';

var nconf = require('nconf');
var path = require('path');

/**
 * Handle the configuration management.
 *
 * @constructor
 */
function Config() {
  nconf.argv().env("_");
  var environment = nconf.get("NODE:ENV") || "development";
  nconf.file(environment, {file: path.resolve(__dirname, '../conf/' + environment + '.json')});
  nconf.file('default', {file: path.resolve(__dirname, '../conf/default.json')});
}

/**
 * Return the value of the provided key from the configuration object.
 *
 * @param string key
 *   Key from the configuration object.
 */
Config.prototype.get = function (key) {
  return nconf.get(key);
};

module.exports = new Config();