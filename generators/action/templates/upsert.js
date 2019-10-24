const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  const { id } = msg.body;
  const objectToUpdate = GetObjectById(id);   // Usually GET verb

  if(objectToUpdate == null) {
    const createdObject = CreateObject(msg.body);    // Usually POST verb
    this.emit('data', messages.newMessageWithBody(createdObject));
  } else {
    const updatedObject = UpdateObject(msg.body, id);   // Usually POST/PUT verb
    this.emit('data', messages.newMessageWithBody(updatedObject));
  }

};
<%-metadata%>