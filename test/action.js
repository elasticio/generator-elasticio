'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-elasticio:action', function () {
  before(function (done) {
    var answers = {
      title: 'My New Action',
      id: 'myTestID'
    };

    helpers.run(path.join(__dirname, '../generators/action'))
      .inTmpDir(function (dir) {
        // `dir` is the path to the new temporary directory
        fs.writeFileSync(dir + '/component.json', '{}', 'utf8');
      })
      .withPrompts(answers)
      .on('ready', function (generator) {
        // Disable warning on overwrite
        generator.conflicter.force = true;
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'component.json',
      'lib/actions/myTestID.js',
      'lib/schemas/myTestID.in.json',
      'lib/schemas/myTestID.out.json'
    ]);
    assert.jsonFileContent('component.json', {
      actions: {
        myTestID: {
          title: 'My New Action',
          main: "./lib/actions/myTestID.js"
        }
      }
    });
  });
});
