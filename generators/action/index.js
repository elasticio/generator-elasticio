const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fs = require('fs');
const _ = require('lodash');
const { prompts } = require('./prompts');

const ACTIONS_WITH_OBJECTS = ['lookupById', 'delete', 'lookupMany'];

module.exports = class extends Generator {
  initializing() {
    try {
      fs.existsSync(this.destinationPath('component.json'));
      this.compDesc = this.fs.readJSON(this.destinationPath('component.json'), {});

      this.log(`Welcome to the ${chalk.red('elastic.io action')} generator!`);
      this.log('Loaded component descriptor from %s', this.destinationPath('component.json'));
    } catch (error) {
      this.log(`I can not find ${chalk.red('component.json')} in the current directory, please run elasticio:action in the component root folder`);
      throw error;
    }
  }

  async prompting() {
    const prompt = prompts();
    this.props = await this.prompt(prompt);
    this.props.objects = [];

    const promptObjects = async () => {
      const objectType = await this.prompt([{
        type: 'input',
        name: 'objectType',
        message: 'Object name:',
      }, {
        type: 'input',
        name: 'objectName',
        default(answers) {
          return _.camelCase(answers.objectType);
        },
        message: 'Object internal name:',
      }, {
        type: 'confirm',
        name: 'confirm',
        message: 'Would you like to add another object?',
      }]);
      return objectType;
    };

    const { actionType } = this.props;
    if (ACTIONS_WITH_OBJECTS.includes(actionType)) {
      this.log('Please provide all the object types you would like this action to work with');
      let newProps = await promptObjects();
      this.props.objects.push({ [newProps.objectType]: newProps.objectName });
      while (newProps.confirm) {
        newProps = await promptObjects();
        this.props.objects.push({ [newProps.objectType]: newProps.objectName });
      }
    }
  }

  writing() {
    const { id, mType, actionType, title } = this.props;
    let actions = {};
    if (this.compDesc.actions) {
      actions = this.compDesc.actions;
    } else {
      this.compDesc.actions = actions;
    }

    actions[id] = {
      title,
      main: `./lib/actions/${id}.js`,
      description: `Description for ${title}`,
    };

    if (mType === 'Static') {
      actions[id].metadata = {
        in: `./lib/schemas/${id}.in.json`,
        out: `./lib/schemas/${id}.out.json`,
      };
    } else {
      actions[id].dynamicMetadata = true;
    }

    if (ACTIONS_WITH_OBJECTS.includes(actionType)) {
      actions[id].fields = {};
      actions[id].fields.objectType = {
        viewClass: 'SelectView',
        label: 'Object Type',
        required: true,
        model: {},
        prompt: 'Please select the object to look up',
      };
    }

    this.props.objects.forEach((obj) => {
      const key = Object.keys(obj)[0];
      actions[id].fields.objectType.model[key] = obj[key];
    });

    if (mType === 'Static') {
      this.log('Creating schema files');
      mkdirp('lib/schemas');
      this.fs.copy(
        this.templatePath('action.in.json'),
        this.destinationPath(`lib/schemas/${id}.in.json`),
      );
      this.fs.copy(
        this.templatePath('action.out.json'),
        this.destinationPath(`lib/schemas/${id}.out.json`),
      );
    }

    this.log('Creating action file');
    mkdirp('lib/actions');
    const actionFile = actionType;
    this.log(actionFile);

    this.fs.copyTpl(
      this.templatePath(`${actionFile}.js`),
      this.destinationPath(`lib/actions/${id}.js`),
      (() => {
        if (mType === 'Static') return { metadata: '' };
        return { metadata: 'exports.getMetaModel = async function getMetaModel(cfg) {};' };
      })(),
    );

    this.log('Creating test');
    mkdirp('spec');
    this.fs.copy(
      this.templatePath('action.spec.js'),
      this.destinationPath(`spec/${id}.spec.js`),
    );

    this.log('Creating integration test');
    mkdirp('spec-integration');
    this.fs.copy(
      this.templatePath('action.spec.js'),
      this.destinationPath(`spec-integration/${id}.spec.js`),
    );

    this.fs.writeJSON(this.destinationPath('component.json'), this.compDesc);
    this.log('Updated component descriptor');
  }
};
