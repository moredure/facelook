import {dragndrop$} from '../src/utils/dragndrop';
import {Observable} from 'rx-dom';

describe('Drag & Drop effects suite', function() {
  describe('dragndrop$', function() {
    it('Should be an observable', function() {
      expect(dragndrop$).to.be.an.instanceof(Observable);
    });
  });
});
