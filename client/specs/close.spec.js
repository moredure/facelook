import {dragndrop$} from '../src/streams/close';
import {Observable} from 'rx-dom';
import {resultsClose$, clearResultsImages} from '../src/streams/close';

describe('Close suite', function() {
  describe('clearResultsImages', function() {
    it('Should be an function', function() {
      expect(clearResultsImages).to.be.an('function');
    });
  });
  describe('resultsClose$', function() {
    it('Should be an instance of Observable', function() {
      expect(resultsClose$).to.be.instanceof(Observable);
    });
  });
});
