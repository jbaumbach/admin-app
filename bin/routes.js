var
  indexController = require(process.cwd() + '/controllers/index')
  , usersController = require(process.cwd() + '/controllers/users')
;

module.exports = function(app) {
  //
  // API
  //
  app.get('/api/v1/users', usersController.index);
};

