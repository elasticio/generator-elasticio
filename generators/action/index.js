'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = yeoman.Base.extend({
  initializing: function () {
    try {
      fs.accessSync(this.destinationPath('component.json'));
      this.compDesc = this.fs.readJSON(this.destinationPath('component.json'), {});
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the ' + chalk.red('elastic.io action ') + ' generator!'
      ));
      this.log('Loaded component descriptor from %s', this.destinationPath('component.json'));
    } catch (error) {
      this.log(yosay('I can not find ' + chalk.red('component.json') + ' in the current directory, ' +
        'please run elasticio:action in the component root folder'));
      throw error;
    }
  },
  prompting: function () {
    var done = this.async();

    var prompts = [{
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
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var id = this.props.id;
    var actions = {};
    if (this.compDesc.actions) {
      actions = this.compDesc.actions;
    } else {
      this.compDesc.actions = actions;
    }
    actions[this.props.id] = {
      title: this.props.title,
      main: "./lib/actions/" + id + '.js',
      metadata: {
        in: "./lib/schemas/" + id + ".in.json",
        out: "./lib/schemas/" + id + ".out.json"
      }
    };

    this.log('Creating action code file');
    mkdirp('lib/actions');
    this.fs.copy(
      this.templatePath('actionStatic.js'),
      this.destinationPath('lib/actions/' + id + '.js')
    );

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
    this.fs.writeJSON(this.destinationPath('component.json'), this.compDesc);
    this.log('Updated component descriptor');
  }

});
