const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  try {
    DeleteObjectById(id);   // Usually DELETE verb
  } catch (e) {
    emitData({});
    return;
  }
  this.emit('data', messages.newMessageWithBody({id: id}));
};

<%-metadata%>
