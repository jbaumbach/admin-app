var
  indexController = require(process.cwd() + '/controllers/index')
  , usersController = require(process.cwd() + '/controllers/users')
;

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(403).send({msg: 'Unauthenticated, please log in'});
  }
}

module.exports = function(app) {
  //
  // API
  //
  app.get('/api/v1/users', usersController.index);
};

