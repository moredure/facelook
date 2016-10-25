import {network$} from '../src/utils/network';
import {Observable} from 'rx-dom';

describe('Network check suite', function() {
  describe('network$', function() {
    it('Should be an observable', function() {
      expect(network$).to.be.an.instanceof(Observable);
    });
  });
});
