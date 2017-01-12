/* eslint-env node, jasmine */
const action = require('../lib/actions/yourAction').process;

describe('Test action', () => {
  it('should convert json to XML', (done) => {
    function onEmit(type, value) {
      if (type && type === 'data') {
        expect(value).toBeDefined();
      } else if (type && type === 'end') {
        expect(value).toBeUndefined();
        done();
      }
    }
    const msg = {
      body: {}
    };
    const cfg = {};
    const snapshot = {};
    action.call({
      emit: onEmit
    }, msg, cfg, snapshot);
  });
});
