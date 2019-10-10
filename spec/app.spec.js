const path = require('path');
const assert = require('yeoman-assert');
const rimraf = require('rimraf');
const helpers = require('yeoman-test');

describe('generator-elasticio:app', () => {
  const title = 'tiny';
  const description = 'my tiny component';
  const dirPath = path.join(__dirname, 'tmp');

  beforeEach(async () => {
    await helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(dirPath)
      .withPrompts({
        title,
        description,
      });
  });

  it('Creates the correct files', () => {
    const files = [
      '.eslintrc.js',
      '.gitignore',
      'component.json',
      'logo.png',
      'package.json',
      'README.md',
      'verifyCredentials.js',
    ];
    files.forEach((file) => assert.file(path.join(dirPath, `${title}-component/${file}`)));
    assert.noFile(path.join(dirPath, `${title}-component/.eslintignore.js`));
    assert.noFile(path.join(dirPath, `${title}-component/.gitattributes.js`));
  });

  it('Populates the component.json file correctly', () => {
    assert.JSONFileContent(path.join(dirPath, `${title}-component/component.json`), {
      title,
      description,
      credentials: {
        fields: {
          name: {
            label: 'My API Key',
            required: true,
            viewClass: 'TextFieldView',
          },
        },
      },
    });
  });

  afterEach(() => {
    rimraf.sync(path.join(__dirname, 'tmp'));
  });
});
