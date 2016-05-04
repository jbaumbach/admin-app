var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require(process.cwd() + '/config/config');
var indexController = require(process.cwd() + '/controllers/index');
var util = require('util');
var passport = require('passport');
var GoodreadsStrategy = require('passport-goodreads').Strategy;
var session = require('express-session');


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



// temp location - to move to lib/authenticate.js


var GOODREADS_KEY = "--insert-goodreads-key-here--";
var GOODREADS_SECRET = "--insert-goodreads-secret-here--";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Goodreads profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  console.log(`todo: persist user to database: ${util.inspect(user)}`);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function (err, user) {
  console.log(`todo: read user from db with id: ${util.inspect(id)}`);
  done(null, id);
});


// Use the GoodreadsStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Goodreads profile), and
//   invoke a callback with a user object.
//const serverHost = 'http://localhost:3000';
//const authPath = 'auth/goodreads';

passport.use(new GoodreadsStrategy({
    consumerKey: GOODREADS_KEY,
    consumerSecret: GOODREADS_SECRET,
    callbackURL: "http://localhost:3000/auth/goodreads/callback"
  },
  function verify(token, tokenSecret, profile, done) {

    console.log(`Got goodreadsId: ${profile.id}`);

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Goodreads profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Goodreads account with a user record in your database,
      // and return that user instead.

      //console.log(`Passport gotGoodreadsResponse: token=${token} tokenSecret=${tokenSecret} profile=${util.inspect(profile)} `);

      // todo: User.findOrCreate({ goodreadsId: profile.id }, function (err, user) {
      var user = {
        provider: profile.provider,
        id: profile.id,
        displayName: profile.displayName,
        oauth: {
          token: token,
          tokenSecret: tokenSecret
        }
      };

      return done(null, user);
    });
  }
));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/goodreads', passport.authenticate('goodreads'));

app.get('/auth/goodreads/callback', passport.authenticate('goodreads', { failureRedirect: '/login' }), function success(req, res) {
    // Successful authentication, redirect home.
    console.log(`Got passport success! Redirecting home`);
    res.redirect('/');
  });



// end temp location


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
