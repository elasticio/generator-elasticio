const { messages } = require('elasticio-node');

exports.process = async function trigger(msg, cfg, snapshot = {}) {
  this.emit('data', messages.newMessageWithBody(msg));
};
