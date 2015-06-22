'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
var config = require('./modules/config');
var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  // Todo import settings from the config file.
  res.header('Access-Control-Allow-Origin', config.get('allowed-origins'));
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
