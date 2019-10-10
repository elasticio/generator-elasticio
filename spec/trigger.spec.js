'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-elasticio:trigger', function () {
  it('can generate trigger', function () {
    before(function (done) {
      var answers = {
        title: 'My New Trigger',
        id: 'myTestID'
      };

      helpers.run(path.join(__dirname, '../generators/trigger'))
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
        'lib/triggers/myTestID.js',
        'lib/schemas/myTestID.out.json'
      ]);
      assert.jsonFileContent('component.json', {
        triggers: {
          myTestID: {
            title: 'My New Action',
            main: './lib/actions/myTestID.js'
          }
        }
      });
    });
  });
});
