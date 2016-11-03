'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
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
      message: 'Please enter a trigger title',
      default: "Orders",
      validate: function (str) {
        return str.length > 0;
      }
    }, {
      type: 'input',
      name: 'id',
      message: 'Please enter an action ID',
      default: function (answers) {
        return _.camelCase('get' + answers.title);
      },
      validate: function (str) {
        return str.length > 0;
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    var id = this.props.id;
    var triggers = {};
    if (this.compDesc.triggers) {
      triggers = this.compDesc.triggers;
    } else {
      this.compDesc.triggers = triggers;
    }
    triggers[this.props.id] = {
      title: this.props.title,
      main: "./lib/actions/" + id + '.js'
    };
    triggers[this.props.id].metadata = {
      in: {},
      out: "./lib/schemas/" + id + ".out.json"
    };

    this.log('Creating triggers code file');
    mkdirp('lib/triggers');
    this.fs.copy(
      this.templatePath('trigger.js'),
      this.destinationPath('lib/triggers/' + id + '.js')
    );

    this.log('Creating schema files');
    mkdirp('lib/schemas');
    this.fs.copy(
      this.templatePath('trigger.out.json'),
      this.destinationPath('lib/schemas/' + id + '.out.json')
    );
    this.fs.writeJSON(this.destinationPath('component.json'), this.compDesc);
    this.log('Updated component descriptor');
  }
});
