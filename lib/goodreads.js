var GoodreadsStrategy = require('passport-goodreads').Strategy;

exports.configureAuthentication = function(host, passport, app) {

  console.log(`(info) setting up Goodreads login on host: ${host}`);

  var GOODREADS_KEY = "--insert-goodreads-key-here--";
  var GOODREADS_SECRET = "--insert-goodreads-secret-here--";

  // Use the GoodreadsStrategy within Passport.
  //   Strategies in passport require a `verify` function, which accept
  //   credentials (in this case, a token, tokenSecret, and Goodreads profile), and
  //   invoke a callback with a user object.

  passport.use(new GoodreadsStrategy({
      consumerKey: GOODREADS_KEY,
      consumerSecret: GOODREADS_SECRET,
      callbackURL: host + '/auth/goodreads/callback'
    },
    function verify(token, tokenSecret, profile, done) {

      console.log(`Got goodreadsId: ${profile.id}`);

      // To keep the example simple, the user's Goodreads profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Goodreads account with a user record in your database,
      // and return that user instead.

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
    }
  ));

  //
  // Add a route to our app at this endpoint, which passport handles.  It'll send a redirect the browser
  // to the Goodreads site with our key and secret.
  //
  app.get('/auth/goodreads', passport.authenticate('goodreads'));

  //
  // Add a route to our app to handle the redirection back from Goodreads to us.  This middleware
  // calls the "verify" function above and sets up the session.
  //
  app.get('/auth/goodreads/callback', passport.authenticate('goodreads', { failureRedirect: '/login' }), function success(req, res) {
    // Successful authentication, redirect home.
    console.log(`Got passport success! Redirecting home`);
    res.redirect('/');
  });
};