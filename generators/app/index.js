'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var extend = require('deep-extend');
var fs = require('fs');
var http = require('http');

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.props = {};
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('elastic.io component') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter a component descriptive name (title)',
      default: "My API",
      validate: function (str) {
        return str.length > 0;
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'Please enter a component description',
      default: "My component that speaks to my API"
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      console.log(props.title);
      this.props.name = _.kebabCase(props.title);
      this.props.name = this.props.name.indexOf('-component') > 0 ?
        this.props.name : this.props.name + '-component';
      done();
    }.bind(this));
  },

  default: function () {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your component must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    var readmeTpl = _.template(this.fs.read(this.templatePath('README.md')));

    this.composeWith('node:app', {
      options: {
        babel: false,
        boilerplate: false,
        name: this.props.name,
        keywords: false,
        description: this.props.description,
        lint: false,
        gulp: false,
        coveralls: false,
        cli: false,
        skipInstall: this.options.skipInstall,
        githubAccount: false,
        readme: readmeTpl({
          componentName: this.props.name,
          componentTitle: this.props.title,
          componentDescription: this.props.description
        })
      }
    }, {
      local: require('generator-node').app
    });

    // this.composeWith('generator:subgenerator', {
    //   arguments: ['app']
    // }, {
    //   local: require.resolve('../subgenerator')
    // });
  },

  writing: function () {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    extend(pkg, {
      dependencies: {
        "q": "^1.4.1",
        "elasticio-sailor-nodejs": "1.1.2",
        "elasticio-node": "0.0.5"
      }
    });
    pkg.keywords = pkg.keywords || [];
    pkg.keywords.push('elasticio-component');

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    var component = this.fs.readJSON(this.templatePath('component.json'));
    component.title = this.props.title;
    component.description = this.props.description;
    this.fs.writeJSON(this.destinationPath('component.json'), component);

    // Create and download icon
    var color = ((1 << 24) * Math.random() | 0).toString(16);
    var iconURL = "http://dummyimage.com/64x64/" + color + "/fff.png&text=" + this.props.title.split(' ')[0];
    var file = fs.createWriteStream(this.destinationPath('logo.png'));
    http.get(iconURL, function (response) {
      response.pipe(file);
    });

    // this.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );
  },

  install: function () {
    this.installDependencies();
  }
});
