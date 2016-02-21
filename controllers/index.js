/* GET home page. */
exports.index = function(req, res, next) {
  //
  // All items you want to pass from the server to the front end app
  //
  var frontEndConfig = {
    sampleConfigItem: 32
  };

  //
  // Items to pass to the server-side renderer
  //
  var config = {
    minified: process.env.NODE_ENV !== 'development'
  };

  res.render('index', {
    title: 'Sample Admin Application',
    cacheBustKey: GLOBAL.Config.get('cacheBustKey') || '0123456789',
    frontEndConfig: JSON.stringify(frontEndConfig),
    config: config
  });
};

//
// Generic helper function to render the passed file with title
//
exports.renderPage = function(pageFile, title) {
  return function(req, res, next) {
    res.render(pageFile, { title: title || 'Untitled Application' });
  }
};
