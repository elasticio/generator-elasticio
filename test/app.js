'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var mockery = require('mockery');

describe('generator-elasticio:app', function () {
  before(function (done) {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('npm-name', function (name, cb) {
      cb(null, true);
    });

    mockery.registerMock('github-username', function (name, cb) {
      cb(null, 'unicornUser');
    });

    mockery.registerMock(
      require.resolve('generator-license/app'),
      helpers.createDummyGenerator()
    );

    var answers = {
      title: 'Test Component',
      description: 'Test Description',
      name: 'generator-node',
      homepage: 'http://yeoman.io',
      githubAccount: 'yeoman',
      authorName: 'The Yeoman Team',
      authorEmail: 'hi@yeoman.io',
      authorUrl: 'http://yeoman.io',
      keywords: ['foo', 'bar']
    };

    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(answers).on('end', done);
  });

  after(function () {
    mockery.disable();
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      'component.json',
      'README.md'
    ]);
    assert.noFile([
      'lib/index.js',
      'test/index.js'
    ]);
  });
});
