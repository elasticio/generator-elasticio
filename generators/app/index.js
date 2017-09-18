'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const extend = require('deep-extend');
const http = require('http');
const fs = require('fs');

module.exports = class extends Generator {
  default() {
    const readmeTpl = _.template(this.fs.read(this.templatePath('README.md')));

    this.composeWith(require.resolve('generator-node/generators/app'), {
      boilerplate: false,
      cli: false,
      editorconfig: true,
      git: true,
      license: true,
      travis: true,
      coveralls: false,
      readme: readmeTpl({
        componentName: this.props.name,
        componentTitle: this.props.title,
        componentDescription: this.props.description
      })
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('elastic.io component') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter a component descriptive name (title)',
      default: 'My API',
      validate: function (str) {
        return str.length > 0;
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'Please enter a component description',
      default: 'My component that speaks to my API'
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    extend(pkg, {
      dependencies: {
        'elasticio-sailor-nodejs': '^2.2.0',
        'elasticio-node': '^0.0.8',
        'request-promise': '^4.2.1'
      },
      engines: {
        node: '8.5.0'
      },
      scripts: {
        pretest: 'node_modules/.bin/eslint lib spec spec-integration --ext .json --ext .js --fix',
        test: 'NODE_ENV=test jest spec/*',
        'integration-test': 'NODE_ENV=test jest spec-integration/*'
      },
      devDependencies: {
        eslint: '^4.7.0',
        'eslint-config-xo-space': '^0.16.0',
        'eslint-plugin-json': '^1.2.0'
      },
      eslintConfig: {
        extends: 'xo-space',
        env: {
          jest: true
        }
      }
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
      this.destinationPath('verifyCredentials.js')
    );

    this.fs.copy(
      this.templatePath('.eslintrc.js'),
      this.destinationPath('.eslintrc.js')
    );

    const color = ((1 << 24) * Math.random() | 0).toString(16);
    const iconURL = 'http://dummyimage.com/64x64/' + color + '/fff.png&text=' + this.props.title.split(' ')[0];
    const file = fs.createWriteStream(this.destinationPath('logo.png'));
    http.get(iconURL, function (response) {
      response.pipe(file);
    });
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
