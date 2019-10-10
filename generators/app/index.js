const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const extend = require('deep-extend');
const fs = require('fs');
const http = require('http');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the ${chalk.red('elastic.io component')} generator!`,
    ));

    const prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter a component descriptive name (title)',
      default: 'My API',
      validate(str) {
        return str.length > 0;
      },
    }, {
      type: 'input',
      name: 'description',
      message: 'Please enter a component description',
      default: 'My component that speaks to my API',
    }];

    this.props = await this.prompt(prompts);
    this.props.name = _.kebabCase(this.props.title);
    this.props.name = this.props.name.indexOf('-component') > 0
      ? this.props.name : `${this.props.name}-component`;
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
      options: {
        travis: false,
        editorConfig: false,
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
      },
    }, {
      local: require('generator-node').app,
    });
  }

  writing() {
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

    // Create and download icon
    const color = ((1 << 24) * Math.random() | 0).toString(16);
    const iconURL = `http://dummyimage.com/64x64/${color}/fff.png&text=${this.props.title.split(' ')[0]}`;
    const file = fs.createWriteStream(this.destinationPath('logo.png'));
    http.get(iconURL, (response) => {
      response.pipe(file);
    });
  }

  install() {
    this.npmInstall();
  }
};
