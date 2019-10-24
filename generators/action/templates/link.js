const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  const matchingObjects1 = lookupObjectByCriteria(obj1.type, obj1.uniqueCriteria);
  if (matchingObjects1.length != 1) {
    throw new Error('Not found/too many found.');
  }
  const object1Id = matchingObjects1[0].id;

  const matchingObjects2 = lookupObjectByCriteria(obj2.type, obj2.uniqueCriteria);
  if (matchingObjects2.length != 1) {
    throw new Error('Not found/too many found.');
  }
  const object2Id = matchingObjects2[0].id;

  createLink(object1Id, object2Id, linkMetadata);
};
<%-metadata%>