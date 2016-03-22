const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const fs = require('fs');

module.exports = class extends Generator {
  initializing() {
    try {
      fs.accessSync(this.destinationPath('component.json'));
      this.compDesc = this.fs.readJSON(this.destinationPath('component.json'), {});
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the ' + chalk.red('elastic.io action') + ' generator!'
      ));
      this.log('Loaded component descriptor from %s', this.destinationPath('component.json'));
    } catch (error) {
      this.log(yosay('I can not find ' + chalk.red('component.json') + ' in the current directory, ' +
        'please run elasticio:action in the component root folder'));
      throw error;
    }
  }
  prompting() {
    const done = this.async();

    const prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter an actions title',
      default: "Upsert Something",
      validate: function (str) {
        return str.length > 0;
      }
    }, {
      type: 'input',
      name: 'id',
      message: 'Please enter an action ID',
      default: function (answers) {
        return _.camelCase(answers.title);
      },
      validate: function (str) {
        return str.length > 0;
      }
    }, {
      type: 'list',
      name: 'mType',
      message: 'Please select the type of the metadata',
      choices: [
        {
          name: 'Static (known at design time)',
          short: 'Static',
          value: 'Static'
        },
        {
          name: 'Dynamic (fetched at run time)',
          short: 'Dynamic',
          value: 'Dynamic'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  }
  writing() {
    const id = this.props.id;
    let actions = {};
    if (this.compDesc.actions) {
      actions = this.compDesc.actions;
    } else {
      this.compDesc.actions = actions;
    }
    actions[this.props.id] = {
      title: this.props.title,
      main: "./lib/actions/" + id + '.js',
      description: "Description for " + this.props.title
    };
    if (this.props.mType === 'Static') {
      actions[this.props.id].metadata = {
        in: "./lib/schemas/" + id + ".in.json",
        out: "./lib/schemas/" + id + ".out.json"
      };
    } else {
      actions[this.props.id].dynamicMetadata = true;
    }

    this.log('Creating action code file');
    mkdirp('lib/actions');
    this.fs.copy(
      this.templatePath('action' + this.props.mType + '.js'),
      this.destinationPath('lib/actions/' + id + '.js')
    );

    if (this.props.mType === 'Static') {
      this.log('Creating schema files');
      mkdirp('lib/schemas');
      this.fs.copy(
        this.templatePath('action.in.json'),
        this.destinationPath('lib/schemas/' + id + '.in.json')
      );
      this.fs.copy(
        this.templatePath('action.out.json'),
        this.destinationPath('lib/schemas/' + id + '.out.json')
      );
    }
    this.log('Creating test');
    mkdirp('specs');
    this.fs.copy(
      this.templatePath('action.spec.js'),
      this.destinationPath('spec/' + id + '.spec.js')
    );

    this.fs.writeJSON(this.destinationPath('component.json'), this.compDesc);
    this.log('Updated component descriptor');
  }
};
