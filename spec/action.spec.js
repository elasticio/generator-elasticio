const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');

const answers = {
  title: 'My New Action',
  id: 'myTestID',
  mType: 'Static',
};

describe('generator-elasticio:action', () => {
  it('can generate action with static metadata', () => {
    before(async () => {
      await helpers.run(path.join(__dirname, '../generators/action'))
        .inTmpDir((dir) => {
          // `dir` is the path to the new temporary directory
          fs.writeFileSync(`${dir}/component.json`, '{}', 'utf8');
        })
        .withPrompts(answers)
        .on('ready', (generator) => {
          // Disable warning on overwrite
          generator.conflicter.force = true;
        });
    });

    it('creates files', () => {
      assert.file([
        'component.json',
        'lib/actions/myTestID.js',
        'lib/schemas/myTestID.in.json',
        'lib/schemas/myTestID.out.json',
      ]);
      assert.jsonFileContent('component.json', {
        actions: {
          myTestID: {
            title: 'My New Action',
            main: './lib/actions/myTestID.js',
          },
        },
      });
    });
  });

  it('can generate action with dynamic metadata', () => {
    before(async () => {
      answers.mType = 'Dynamic';
      await helpers.run(path.join(__dirname, '../generators/action'))
        .inTmpDir((dir) => {
          // `dir` is the path to the new temporary directory
          fs.writeFileSync(`${dir}/component.json`, '{}', 'utf8');
        })
        .withPrompts(answers)
        .on('ready', (generator) => {
          // Disable warning on overwrite
          generator.conflicter.force = true;
        });
    });

    it('creates files', () => {
      assert.file([
        'component.json',
        'lib/actions/myTestID.js',
      ]);
      assert.noFile([
        'lib/schemas/myTestID.in.json',
        'lib/schemas/myTestID.out.json',
      ]);
      assert.jsonFileContent('component.json', {
        actions: {
          myTestID: {
            title: 'My New Action',
            main: './lib/actions/myTestID.js',
            dynamicMetadata: true,
          },
        },
      });
    });
  });
});
