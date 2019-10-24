exports.prompts = function prompts() {
  return [{
    type: 'input',
    name: 'id',
    message: 'Please enter the filename for your action',
    validate(str) {
      return str.length > 0;
    },
  }, {
    type: 'input',
    name: 'title',
    message: 'Please enter the title of your action',
    default(answers) {
      return answers.id;
    },
    validate(str) {
      return str.length > 0;
    },
  }, {
    type: 'list',
    name: 'actionType',
    message: 'What kind of action do you want to create?',
    choices: [{
      name: 'Upsert Object',
      value: 'upsert',
    }, {
      name: 'Lookup Object (at most 1)',
      value: 'lookupById',
    }, {
      name: 'Lookup Objects (plural)',
      value: 'lookupMany',
    }, {
      name: 'Delete Object',
      value: 'delete',
    }, {
      name: 'Make RAW Request',
      value: 'action',
    }, {
      name: 'Link/Unlink Object',
      value: 'link',
    }, {
      name: 'Other',
      value: 'action',
    }],
  }, {
    type: 'list',
    name: 'mType',
    message: 'Please select the type of the metadata',
    choices: [
      {
        name: 'Static (known at design time)',
        short: 'Static',
        value: 'Static',
      },
      {
        name: 'Dynamic (fetched at run time)',
        short: 'Dynamic',
        value: 'Dynamic',
      },
    ],
  }];
};
