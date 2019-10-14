/* eslint-disable no-underscore-dangle */
const Generator = require('yeoman-generator');
const axios = require('axios');
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const extend = require('deep-extend');
const fs = require('fs');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  async prompting() {
    this.log('Welcome to the component generator');

    const prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter a title for your component:',
      validate(str) {
        return str.length > 0;
      },
    }, {
      type: 'input',
      name: 'description',
      message: 'Please enter a description for your component:',
    }, {
      type: 'confirm',
      name: 'addLogo',
      message: 'Would you like to add a logo to your project now?',
    }];

    const nextPrompts = [{
      type: 'input',
      name: 'logo',
      message: 'Please provide the URL where your logo can be located.\nNote that logos should be 64x64 pixels',
    }];

    this.props = await this.prompt(prompts);
    this.props.name = _.kebabCase(this.props.title);
    this.props.name = this.props.name.indexOf('-component') > 0
      ? this.props.name : `${this.props.name}-component`;

    if (this.props.addLogo) {
      const logoProps = await this.prompt(nextPrompts);
      this.props = { ...this.props, ...logoProps };
    }
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Your component must be inside a folder named ${this.props.name}\n`
        + 'I\'ll automatically create this folder.',
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    const readmeTpl = _.template(this.fs.read(this.templatePath('README.md')));

    this.composeWith(require.resolve('generator-node/generators/app'), {
      travis: false,
      editorconfig: false,
      boilerplate: false,
      name: this.props.name,
      keywords: false,
      description: this.props.description,
      license: false,
      coveralls: false,
      cli: false,
      githubAccount: false,
      readme: readmeTpl({
        componentName: this.props.name,
        componentTitle: this.props.title,
        componentDescription: this.props.description,
      }),
    }, {
      // eslint-disable-next-line global-require
      local: require('generator-node').app,
    });
  }

  async writing() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    extend(pkg, {
      dependencies: {
        '@elastic.io/component-commons-library': '0.0.6',
        'elasticio-node': '0.0.9',
        'elasticio-rest-node': '1.2.3',
        'elasticio-sailor-nodejs': '2.5.1',
      },
      scripts: {
        pretest: 'eslint spec lib --fix',
        test: 'mocha spec --recursive',
        'integration-test': 'mocha spec-integration',
      },
      _devDependencies: {
        chai: '4.2.0',
        dotenv: '8.1.0',
        eslint: '6.4.0',
        'eslint-config-airbnb-base': '14.0.0',
        'eslint-plugin-import': '2.18.2',
        mocha: '6.0.2',
        sinon: '7.4.2',
      },
      get devDependencies() {
        return this._devDependencies;
      },
      set devDependencies(value) {
        this._devDependencies = value;
      },
    });
    pkg.keywords = pkg.keywords || [];
    pkg.keywords.push('elasticio-component');

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    const component = this.fs.readJSON(this.templatePath('component.json'));
    component.title = this.props.title;
    component.description = this.props.description;
    this.fs.writeJSON(this.destinationPath('component.json'), component);

    this.fs.copy(
      this.templatePath('verifyCredentials.js'),
      this.destinationPath('verifyCredentials.js'),
    );

    this.fs.copy(
      this.templatePath('.eslintrc.js'),
      this.destinationPath('.eslintrc.js'),
    );

    this.fs.delete('.gitattributes');

    // Create and download icon
    if (!this.props.addLogo) {
      fs.createWriteStream(this.destinationPath('logo.png'));
    } else {
      const url = this.props.logo;
      const file = fs.createWriteStream(this.destinationPath('logo.png'));
      const response = await axios({
        url,
        responseType: 'stream',
      });
      response.data.pipe(file);
    }
  }

  install() {
    this.npmInstall();
  }
};
