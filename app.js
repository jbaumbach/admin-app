var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require(process.cwd() + '/config/config');
var indexController = require(process.cwd() + '/controllers/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//
// All assets in "public" directory served by static file server
//
app.use(express.static(path.join(__dirname, 'public')));


//
// Sample OAuth login - using Goodreads as our passport provider.  This
// should come AFTER the static file server and BEFORE routes and HTML
// server.  Passports inspects every server call and adds req.user if
// we have one in our session.
//
var passport = require(process.cwd() + '/lib/authenticate')(app);
require(process.cwd() + '/lib/goodreads').configureAuthentication(GLOBAL.Config.get('host'),
  passport, app);


//
// API Routes
//
var routes = require('./bin/routes')(app);


//
// Web Pages - server-rendered view engine setup
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//
// All routes not API and static get the index page so Angular can handle the route
//
app.use(function(req, res, next) {
  if (req.path.match(/\/api\/v[0-9]*\//)) {
    // catch 404 and forward to error handler
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    indexController.index(req, res);
  }
});

//
// error handlers
//
// production error handler - no stacktraces leaked to user
// development error handler - will print stacktrace
//
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

console.log(`Running with env: ${app.get('env') || 'not set'}`);

module.exports = app;
