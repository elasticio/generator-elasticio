'use strict';
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-elasticio:app', () => {
  beforeEach(function () {
    jest.mock('npm-name', () => {
      return () => Promise.resolve(true);
    });

    jest.mock('github-username', () => {
      return () => Promise.resolve('unicornUser');
    });

    jest.mock('generator-license/app', () => {
      const helpers = require('yeoman-test');
      return helpers.createDummyGenerator();
    });
  });

  describe('new project', function () {
    it('generates new component project', function () {
      const answers = {
        name: 'generator-node',
        description: 'A node generator',
        homepage: 'http://yeoman.io',
        githubAccount: 'yeoman',
        authorName: 'The Yeoman Team',
        authorEmail: 'hi@yeoman.io',
        authorUrl: 'http://yeoman.io',
        keywords: ['foo', 'bar'],
        includeCoveralls: false
      };
      return helpers.run(require.resolve('../generators/app'))
        .withPrompts(answers)
        .then(() => {
          assert.file([
            '.travis.yml',
            '.editorconfig',
            '.gitignore',
            '.gitattributes',
            'README.md'
          ]);

          assert.file('package.json');
          assert.file('component.json');
          assert.file('verifyCredentials.js');
          assert.jsonFileContent('package.json', {
            name: 'generator-node',
            version: '0.0.0',
            description: answers.description,
            homepage: answers.homepage,
            repository: 'yeoman/generator-node',
            author: {
              name: answers.authorName,
              email: answers.authorEmail,
              url: answers.authorUrl
            },
            files: ['lib'],
            keywords: answers.keywords,
            main: 'lib/index.js'
          });
          assert.fileContent('README.md', '[travis-image]: https://travis-ci.org/yeoman/generator-node.svg?branch=master');
        });
    });
  });
});
