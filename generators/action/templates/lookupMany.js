const { messages } = require('elasticio-node');

exports.process = async function process(msg, cfg) {
  switch(mode) {
    case 'fetchAll':
      const results = GetObjectsByCriteria(criteria);
      if(results.length >= maxResultSize) {
        throw new Error('Too many results');
      }
      this.emit('data', messages.newMessageWithBody({results: results}));
      break;
    case 'emitIndividually':
      const results = GetObjectsByCriteria(criteria);
      results.forEach(result => {
        this.emit('data', messages.newMessageWithBody(result));
      })
      break;
    case 'fetchPage':
      const results = GetObjectsByCritieria(criteria, top: pageSize, skip: pageSize * pageNumber, orderBy: orderByTerms);
      this.emit('data', messages.newMessageWithBody({results: results}));
      break;
  }
};
<%-metadata%>