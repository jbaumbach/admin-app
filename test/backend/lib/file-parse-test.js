"use strict";

var
  should = require('should')
  , fileParse = require(process.cwd() + '/lib/file-parse')
  , util = require('util')
  , path = require('path')
;

describe('my tests', function() {
  const fixturesDir =  'test/fixtures';

  it('should do something interesting', function(done) {
    var pathToFile = path.join(process.cwd(), fixturesDir, 'myfile.xlsx');

    // do some tests

    done();
  })
});