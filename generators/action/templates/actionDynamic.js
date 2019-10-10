/* eslint new-cap: [2, {"capIsNewExceptions": ["Q"]}] no-invalid-this: 0 no-console: 0 */
const Q = require('q');
const elasticio = require('elasticio-node');

const { messages } = elasticio;

module.exports.process = processAction;
module.exports.getMetaModel = getMetaModel;
module.exports.init = init;

/**
 * This method will be called from elastic.io platform before the first message will
 * reach the action.
 * If you need to do a asynchronous action here please return Promise
 *
 * @param cfg configuration that is account information and configuration field values
 */
function init(cfg) {
  return Promise.resolve();
}

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */
function processAction(msg, cfg) {
  const self = this;
  const { name } = cfg;

  function emitData() {
    console.log(`About to say hello to ${name} again`);

    const body = {
      greeting: `${name} How are you today?`,
      originalGreeting: msg.body.greeting,
    };

    const data = messages.newMessageWithBody(body);

    self.emit('data', data);
  }

  function emitError(e) {
    console.log('Oops! Error occurred');

    self.emit('error', e);
  }

  function emitEnd() {
    console.log('Finished execution');

    self.emit('end');
  }

  Q().then(emitData).fail(emitError).done(emitEnd);
}

/**
 * This function is called at design time when dynamic metadata need
 * to be fetched from 3rd party system
 *
 * @param cfg - configuration object same as in process method above
 * @param cb - callback returning metadata
 */
function getMetaModel(cfg, cb) {
  console.log('Fetching metadata with following configuration cfg=%j', cfg);
  // Here we return metadata in the same format as
  // it is configured in component.json
  cb(null, {
    in: {
      type: 'object',
      properties: {
        inValue: {
          type: 'string',
          required: true,
          title: 'Input Value',
        },
      },
    },
    out: {
      type: 'object',
      properties: {
        outValue: {
          type: 'string',
          required: true,
          title: 'Output Value',
        },
      },
    },
  });
}
