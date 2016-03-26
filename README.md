# generator-elasticio [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> elastic.io component generator

## Installation

First, install [Yeoman](http://yeoman.io) and generator-elasticio using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-elasticio
```

Then generate your new project:

```bash
yo elasticio
```

## Usage

```bash
yo elasticio
```

*Note that this template will generate create a new directory in your 
current directory, so no files will be overwritten or modified.*

This will generate a new Node project with following content:

- Filled `package.json` file as part of your NPM module
- `.gitignore` with defaults for node.js project
- `component.json` file with basic structure and simple credentials 
- `README.md` will give you some inspiration
- `logo.png` that will be randomly generated
- [Travis CI](https://travis-ci.org/) continuous integration (optional)
- [License](https://spdx.org/licenses/)

After that you can just go to the newly generated directory, add it to
git and push it to elastic.io (don't forget to create a repo on elastic.io
before)

```bash
cd my-api-component
git init .
git add *
git commit -a -m 'Initial import'
git remote add elasticio team@git.elastic.io:repository-name.git
git push elasticio master
```


## Subgenerators

### Component Action

You can easily scaffold necessary files for a component's action, just 
use following command inside the component's directory

```bash
yo elasticio:action
```

## License

Apache-2.0 © [elastic.io GmbH](http://www.elastic.io)


[npm-image]: https://badge.fury.io/js/generator-elasticio.svg
[npm-url]: https://npmjs.org/package/generator-elasticio
[travis-image]: https://travis-ci.org/elasticio/generator-elasticio.svg?branch=master
[travis-url]: https://travis-ci.org/elasticio/generator-elasticio
[daviddm-image]: https://david-dm.org/elasticio/generator-elasticio.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/elasticio/generator-elasticio
