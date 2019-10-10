/*eslint-disable*/
const { messages } = require('elasticio-node');

exports.process = async function action(msg, cfg, snapshot = {}) {
  this.emit('data', messages.newMessageWithBody(msg));
};
