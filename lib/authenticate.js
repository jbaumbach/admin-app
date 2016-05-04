var util = require('util');
var passport = require('passport');
var session = require('express-session');

module.exports = function(app) {
  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Goodreads profile is
  //   serialized and deserialized.

  //
  // To add database support, modify "serializeUser" to return just the user id.  This goes
  // in the session.  The user is returned from the "verify" function when the user
  // first logs in.  Then modify "deserializeUser" to accept the user id and use it to
  // look up the full user record, and return that.
  //
  // Also - do NOT use the default express-session as shown here.  This uses memory
  // sessions, which are all lost when the process is restarted.  Ok for dev only, but
  // would be incredibly annoying to your users in production.
  //

  passport.serializeUser(function(user, done) {
    console.log(`todo: (serializeUser) persist user to database: ${util.inspect(user)}`);
    done(null, user);
  });

  //
  // Called by passport for each request handled by the app.  It grabs the
  // session obj, and  you can use that to look up the user in your db.
  // Just for this example, we stuffed a bunch of extra stuff in the session
  // obj that you ordinarly wouldn't.  Just return it.
  //
  passport.deserializeUser(function(obj, done) {
    // User.findById(obj.id, function (err, user) {
    console.log(`todo: (deserializeUser) read user from db with id: ${util.inspect(obj)}`);
    done(null, obj);
  });

  app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  //
  // Add a route to the app for logging out.  This will clear the session.
  //
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return passport;
};