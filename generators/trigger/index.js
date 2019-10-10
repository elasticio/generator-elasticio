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
        `Welcome to the ${chalk.red('elastic.io action ')} generator!`,
      ));
      this.log('Loaded component descriptor from %s', this.destinationPath('component.json'));
    } catch (error) {
      this.log(yosay(`I can not find ${chalk.red('component.json')} in the current directory, `
        + 'please run elasticio:action in the component root folder'));
      throw error;
    }
  }

  async prompting() {
    const prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter a trigger title',
      default: 'Orders',
      validate(str) {
        return str.length > 0;
      },
    }, {
      type: 'input',
      name: 'id',
      message: 'Please enter an action ID',
      default(answers) {
        return _.camelCase(`get${answers.title}`);
      },
      validate(str) {
        return str.length > 0;
      },
    }];

    this.props = await this.prompt(prompts);
  }

  writing() {
    const { id } = this.props;
    let triggers = {};
    if (this.compDesc.triggers) {
      triggers = this.compDesc.triggers;
    } else {
      this.compDesc.triggers = triggers;
    }
    triggers[this.props.id] = {
      title: this.props.title,
      main: `./lib/actions/${id}.js`,
      description: `Description for ${this.props.title}`,
    };
    triggers[this.props.id].metadata = {
      in: {},
      out: `./lib/schemas/${id}.out.json`,
    };

    this.log('Creating triggers code file');
    mkdirp('lib/triggers');
    this.fs.copy(
      this.templatePath('trigger.js'),
      this.destinationPath(`lib/triggers/${id}.js`),
    );

    this.log('Creating schema files');
    mkdirp('lib/schemas');
    this.fs.copy(
      this.templatePath('trigger.out.json'),
      this.destinationPath(`lib/schemas/${id}.out.json`),
    );
    this.fs.writeJSON(this.destinationPath('component.json'), this.compDesc);
    this.log('Updated component descriptor');
  }
};
