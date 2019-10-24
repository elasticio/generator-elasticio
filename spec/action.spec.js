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



(async () => {
  await helpers.run(path.join(__dirname, '../generators/app'))
    .inDir(dirPath)
    .withPrompts({
      title,
      description,
      addLogo: true,
      logo: 'https://app.elastic.io/img/logo.svg',
    });
  fs.chmod(path.join(dirPath, `${title}-component/component.json`), 0o777);
})();

describe('generator-elasticio:actions', () => {
  it('Creates the correct files for static actions', async () => {
    const actionPath = path.join(dirPath, `${title}-component`);
    await helpers.run(path.join(__dirname, '../generators/action'))
      .inDir(actionPath)
      .withPrompts({
        id: 'test',
        title: 'Test',
        actionType: 'upsert',
        mType: 'Static',
      });
    assert.file(path.join(dirPath, `${title}-component/lib/actions/test.js`));
    assert.file(path.join(dirPath, `${title}-component/lib/schemas/test.in.json`));
    assert.file(path.join(dirPath, `${title}-component/lib/schemas/test.out.json`));
    assert.file(path.join(dirPath, `${title}-component/spec/test.spec.js`));
    assert.file(path.join(dirPath, `${title}-component/spec-integration/test.spec.js`));

    fs.unlinkSync(path.join(dirPath, `${title}-component/lib/actions/test.js`));
    fs.unlinkSync(path.join(dirPath, `${title}-component/lib/schemas/test.in.json`));
    fs.unlinkSync(path.join(dirPath, `${title}-component/lib/schemas/test.out.json`));
    fs.unlinkSync(path.join(dirPath, `${title}-component/spec/test.spec.js`));
    fs.unlinkSync(path.join(dirPath, `${title}-component/spec-integration/test.spec.js`));
  });

  it('Creates the correct files for dynamic actions', async () => {
    const actionPath = path.join(dirPath, `${title}-component`);
    await helpers.run(path.join(__dirname, '../generators/action'))
      .inDir(actionPath)
      .withPrompts({
        id: 'test',
        title: 'Test',
        actionType: 'upsert',
        mType: 'Dynamic',
      });
    assert.file(path.join(dirPath, `${title}-component/lib/actions/test.js`));
    assert.noFile(path.join(dirPath, `${title}-component/lib/schemas/test.in.json`));
    assert.noFile(path.join(dirPath, `${title}-component/lib/schemas/test.out.json`));
    assert.file(path.join(dirPath, `${title}-component/spec/test.spec.js`));
    assert.file(path.join(dirPath, `${title}-component/spec-integration/test.spec.js`));

    fs.unlinkSync(path.join(dirPath, `${title}-component/lib/actions/test.js`));
    fs.unlinkSync(path.join(dirPath, `${title}-component/spec/test.spec.js`));
    fs.unlinkSync(path.join(dirPath, `${title}-component/spec-integration/test.spec.js`));
  });
});
