var
  indexController = require(process.cwd() + '/controllers/index')
  , usersController = require(process.cwd() + '/controllers/users')
;

module.exports = function(app) {
  //
  // Pages
  //
  app.get('/', indexController.index);
  app.get('/home.html', indexController.renderPage('home'));
  app.get('/about.html', indexController.renderPage('about'));

  //
  // API
  //
  app.get('/api/v1/users', usersController.index);
};

