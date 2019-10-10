const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');

describe('generator-elasticio:trigger', () => {
  it('can generate trigger', () => {
    before((done) => {
      const answers = {
        title: 'My New Trigger',
        id: 'myTestID',
      };

      helpers.run(path.join(__dirname, '../generators/trigger'))
        .inTmpDir((dir) => {
          // `dir` is the path to the new temporary directory
          fs.writeFileSync(`${dir}/component.json`, '{}', 'utf8');
        })
        .withPrompts(answers)
        .on('ready', (generator) => {
          // Disable warning on overwrite
          generator.conflicter.force = true;
        })
        .on('end', done);
    });

    it('creates files', () => {
      assert.file([
        'component.json',
        'lib/triggers/myTestID.js',
        'lib/schemas/myTestID.out.json',
      ]);
      assert.jsonFileContent('component.json', {
        triggers: {
          myTestID: {
            title: 'My New Action',
            main: './lib/actions/myTestID.js',
          },
        },
      });
    });
  });
});
