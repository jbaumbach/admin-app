/* GET home page. */
exports.index = function(req, res, next) {
  res.render('index', { title: 'Express' });
};

exports.renderPage = function(pageFile) {
  return function(req, res, next) {
    res.render(pageFile, { title: 'Express' })
  }
};
