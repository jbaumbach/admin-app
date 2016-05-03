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
    minified: process.env.NODE_ENV !== 'development',
    jsDir: process.env.NODE_ENV === 'development' ? 'dev' : 'dist'
  };

  res.render('index', {
    title: 'Sample Admin Application',
    cacheBustKey: GLOBAL.Config.get('cacheBustKey') || '0123456789',
    frontEndConfig: JSON.stringify(frontEndConfig),
    config: config
  });
};
