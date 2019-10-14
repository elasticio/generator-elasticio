/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { expect } = require('chai');

const files = [
  '.eslintrc.js',
  '.gitignore',
  '.eslintignore',
  'component.json',
  'logo.png',
  'package.json',
  'README.md',
  'verifyCredentials.js',
];

const title = 'tiny';
const description = 'my tiny component';
const dirPath = path.join(__dirname, 'tmp');

describe('generator-elasticio:app', () => {
  beforeEach(async () => {
    await helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(dirPath)
      .withPrompts({
        title,
        description,
        addLogo: true,
        logo: 'https://app.elastic.io/img/logo.svg',
      });
  });

  it('Creates the correct files', () => {
    files.forEach((file) => assert.file(path.join(dirPath, `${title}-component/${file}`)));
    assert.noFile(path.join(dirPath, `${title}-component/.gitattributes`));
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

  it('Has the correct logo', async () => {
    const file = fs.readFileSync(path.join(dirPath, `${title}-component/logo.png`));
    const buffer = await axios({
      url: 'https://app.elastic.io/img/logo.svg',
      responseType: 'arraybuffer',
    });
    expect(file).to.be.deep.equal(buffer.data);
  });

  afterEach(() => {
    files.forEach((file) => {
      fs.unlinkSync(path.join(dirPath, `${title}-component/${file}`));
    });
  });
});
