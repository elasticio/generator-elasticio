const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  this.emit('data', messages.newMessageWithBody(msg));
};
<%-metadata%>