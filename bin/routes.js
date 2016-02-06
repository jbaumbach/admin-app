var
  express = require('express')
  , router = express.Router()
  , indexController = require(process.cwd() + '/controllers/index')
  , usersController = require(process.cwd() + '/controllers/users')
;

module.exports = function(app) {
  //
  // Pages
  //
  app.get('/', indexController.index);

  //
  // API
  //
  app.get('/api/v1/users', usersController.index);
};

