const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  const { id } = msg.body;
  if(!id) {
    if(allowCriteriaToBeOmitted) {
      this.emit('data', messages.newEmptyMessage());
      return;
    } else {
      throw new Error('No ID provided');
    }
  }

  try {
    const foundObject = GetObjectById(id);   // Usually GET verb
    this.emit('data', messages.newMessageWithBody(foundObject));
  } catch (e) {
    if(allowZeroResults) {
      this.emit('data', messages.newEmptyMessage());
    } else {
      throw e;
    }
  }
};
<%-metadata%>