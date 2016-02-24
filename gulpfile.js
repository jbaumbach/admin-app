"use strict";

var
  gulp = require('gulp')
  , uglify = require('gulp-uglify')
  , concat = require('gulp-concat')
  , babel = require('gulp-babel')
  , sourcemaps = require('gulp-sourcemaps')
  , nodemon = require('gulp-nodemon')
  , fs = require('fs')
  , util = require('util')
  , program = require('commander')
  , configUtilities = require(process.cwd() + '/config/config-utilities')
  , shell = require('shelljs')
  , path = require('path')
;

// todo: implement live es2015 transpiling during dev using gulp-connect
// see example page: https://github.com/timroes/angular-es6-sample/blob/master/gulpfile.js

const startPage = 'views/index.ejs';
const bowerComponents = '\/javascripts\/components\/';

//
// Look for all .js files in the directory /javascripts/components/ in the startPage html file and return an array
// By selecting specific files, we can grab just the files we need.
//
function getComponentFiles(sourceFile) {
  var scriptSource = fs.readFileSync(sourceFile).toString();
  var pattern = `src=["'](${bowerComponents}.*)["']`;
  return scriptSource.
    match(new RegExp(pattern, "gi")).
    map((scriptItem) => `public${scriptItem.match(new RegExp(pattern), "i")[1]}`);
}

var src = {
  scripts: {
    app: 'public/javascripts/application/**',
    components: getComponentFiles(startPage)
  }
};

var dest = {
  scripts: {
    development: 'public/javascripts/dev',
    deploy: 'public/javascripts/dist'
  }
};

//
// Development build - should be exactly the same as build-app-deploy except without the minification step
//
gulp.task('build-app-dev', function() {
  return gulp.src(src.scripts.app)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('adm.application.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest.scripts.development))
    ;
});

//
// Build all files for deploying to a remote server
//
gulp.task('build-app-deploy', function() {
  return gulp.src(src.scripts.app)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('adm.application.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest.scripts.deploy))
    ;
});

//
// Build the libraries in the bower components directory.  Typically only done during deployment since these don't
// change very often.
//
gulp.task('build-components', function() {
  return gulp.src(src.scripts.components)
    .pipe(uglify())
    .pipe(concat('adm.components.min.js'))
    .pipe(gulp.dest(dest.scripts.deploy))
});

//
// Run the function that lists the bower components to bundle and output to the console
//
gulp.task('list-components', function() {
  console.log(getComponentFiles(startPage));
});

//
// Watch these source directories, then run the build task(s)
//
gulp.task('watch', function() {
  gulp.watch(src.scripts.app, ['build-app-dev']);
});

//
// Default task - start the node.js server and watch/build the front end files
//
gulp.task('default', ['build-app-dev', 'watch'], function() {
  // Note: nodemon has a bug where it won't ignore directories.  In our case,
  // it won't ignore the public dir.  So, explicitly watch only our node.js dirs.
  nodemon({
    script: './bin/www',
    watch: ['bin','controllers','lib','views']
  });
});

gulp.task('gitcheckin', function() {
  //
  // Everything is done building - check in to Git for Heroku
  //
  var result = shell.exec(`git commit -am "Build and deploy to environment: ${program.environment}"`).code;
  if (result === 0) {
    console.log(`All files committed to git.  You can now deploy to Heroku.`);
  } else {
    console.log('Got git error - aborting');
  }
});

gulp.task('dockerize', function(done) {

  function logInspect(result) {
    if (false) {
      console.log(util.inspect(result));
    }
  }

  if (!shell.which('docker')) {
    console.log(`Oops, can't find docker!  Make sure to install it.\nCheckout the guide: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/`);
    done();
    return;
  }

  if (!process.env.DOCKER_HOST) {
    console.log(`Oops, docker appears to be installed but this shell isn't enabled. If you're on OSX, be sure to run this first:\n\teval "$(docker-machine env default)"`);
    done();
    return;
  }

  var originalDir = process.cwd();
  var tempDirPath = require('os').tmpdir();
  var tempBuildDir = `admin-app-build-${(new Date).valueOf()}`;
  var fullDir = path.join(tempDirPath, tempBuildDir);

  var dockerImageName = 'admin-app/sample-build';
  var exampleLocalPort = 49160;
  var exampleInstanceName = 'web';

  // Get git origin
  console.log('Note: all files must already be pushed to origin/master');
  var gitOrigin = shell.exec(`git config --get remote.origin.url`).output.trim();

  console.log(`Cloning from "${gitOrigin}" into build directory "${fullDir}"`);
  logInspect(shell.exec(`git clone ${gitOrigin} ${fullDir}`));
  logInspect(shell.cd(fullDir));
  logInspect(shell.ls());

  console.log('NPM Install...');
  logInspect(shell.exec('npm install'));

  console.log('Building deployable files (staging)...');
  logInspect(shell.exec('gulp deploy -e staging'));

  // Just in case - stop and remove any running/existing instances/images
  var stopCommand = `docker stop ${exampleInstanceName} && docker rm ${exampleInstanceName}`;
  logInspect(shell.exec(stopCommand));
  logInspect(shell.exec(`docker rmi -f ${dockerImageName}`));

  console.log(`Building docker image "${dockerImageName}"...`);
  logInspect(shell.exec(`docker build -t ${dockerImageName} .`));

  // Cleanup
  console.log(`Cleaning up build files from "${fullDir}"...`);
  logInspect(shell.cd(originalDir));
  logInspect(shell.rm('-rf', fullDir));

  console.log(`Docker build complete.`);
  var exampleLaunchCommand = `docker run -p ${exampleLocalPort}:3000 --name ${exampleInstanceName} --env NODE_ENV=staging ${dockerImageName}`;
  console.log(`You can launch an instance with:\n\t${exampleLaunchCommand}\n\n`);
  console.log(`You can stop the instance with:\n\t${stopCommand}\n\n`);

});

//
// Build everything for deployment to a non-dev server
//
gulp.task('bundle', ['build-app-deploy', 'build-components']);

//
// Same as "bundle", except generates a cacheBustKey, updates a config file for the specified environment,
// and checks into git.  Note: this checks everything into git, even files you may be developing!
//
gulp.task('deploy', ['bundle'], function(done) {
  var config = require(process.cwd() + '/config/config');

  //
  // Parse command line parameters
  //
  program.
    option('-e, --environment <s>', 'Specify an environment, such as "staging" or "production"').
    option('-b, --branch <s>', 'Git branch (reserved for future use)').
    parse(process.argv);

  if (!program.environment) {
    program.help();
    return;
  }

  console.log('Building deploy files for environment: ' + program.environment);

  var cacheBustValue = (new Date).valueOf();
  configUtilities.persistConfigValue(program.environment, 'cacheBustKey', cacheBustValue, function(err) {
    console.log(`Saved config file with cacheBustValue of: ${cacheBustValue}`);
    done();
  });
});
