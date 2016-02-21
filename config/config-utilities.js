
var getConfigFileName = exports.getConfigFileName = function(environment) {
  return process.cwd() + '/config/' + environment + '.json';
}

exports.persistConfigValue = function(environment, keyUsingColons, value, cb) {
  var configFName = getConfigFileName(environment);
  var nconf = require('nconf');
  nconf.file({ file: configFName });
  nconf.set(keyUsingColons, value);
  nconf.save(configFName, cb);
};

