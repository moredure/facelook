import {App} from '../src/streams';

describe('App suite', function() {
  describe('App', function() {
    it('Should be an function', function() {
      expect(App).to.be.an('function');
    });
  });
});
