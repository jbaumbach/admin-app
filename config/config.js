var nconf = require('nconf')
  , fs = require('fs')
  , configUtilities = require(process.cwd() + '/config/config-utilities')
  ;

//
// Include this file anywhere you need to access the app's config variables
//
// Access a variable like:
//
//  GLOBAL.Config.get('Facebook:app_id');
//
// nconf is cooler than you imagine.  see: https://github.com/indexzero/nconf
//
// Set a default env
process.env.NODE_ENV = (process.env.NODE_ENV || "development");

// Set up a namespace
GLOBAL.Config = nconf;

var configFName = configUtilities.getConfigFileName(process.env.NODE_ENV);

if (!fs.existsSync(configFName)) {
  throw new Error('Missing config file: ' + configFName);
}

console.log('(info) using config file: ' + configFName);

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
GLOBAL.Config
  .argv()
  .env()
  .file({ file: configFName })
;

//
// Set all defaults here - use these if not found in any source above
//
nconf.defaults({
  "host": "http://localhost:3000",
  "REDISCLOUD_URL": "localhost:6379"
});

