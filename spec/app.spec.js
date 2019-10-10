
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const mockery = require('mockery');

describe('generator-elasticio:app', () => {
  before((done) => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
    });

    mockery.registerMock('npm-name', (name, cb) => {
      cb(null, true);
    });

    mockery.registerMock('github-username', (name, cb) => {
      cb(null, 'unicornUser');
    });

    mockery.registerMock(
      require.resolve('generator-license/app'),
      helpers.createDummyGenerator(),
    );

    const answers = {
      title: 'Test Component',
      description: 'Test Description',
      name: 'generator-node',
      homepage: 'http://yeoman.io',
      githubAccount: 'yeoman',
      authorName: 'The Yeoman Team',
      authorEmail: 'hi@yeoman.io',
      authorUrl: 'http://yeoman.io',
      keywords: ['foo', 'bar'],
    };

    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(answers).on('end', done);
  });

  after(() => {
    mockery.disable();
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      'component.json',
      'README.md',
    ]);
    assert.noFile([
      'lib/index.js',
      'test/index.js',
    ]);
  });
});
