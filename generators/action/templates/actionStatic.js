/* eslint no-invalid-this: 0 no-console: 0 */


const eioUtils = require('elasticio-node').messages;
const co = require('co');
const rp = require('request-promise');

module.exports.process = processAction;
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
 * @param snapshot - current values from the snapshot
 */
function processAction(msg, cfg, snapshot) {
  console.log('Action started, snapshot=%j', snapshot);

  co(function* () {
    console.log('Creating new request bin');

    const bin = yield rp({
      method: 'POST',
      uri: 'http://requestb.in/api/v1/bins',
      json: true,
    });

    console.log('New request bin created bin=%j', bin);

    this.emit('data', eioUtils.newMessageWithBody(bin));

    console.log('Processing completed');

    this.emit('end');
  }.bind(this)).catch((err) => {
    console.log('Error occurred', err.stack || err);
    this.emit('error', err);
    this.emit('end');
  });
}
