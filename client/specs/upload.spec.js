import {
  processFacesFactory,
  upload$, loadStart,
  wait, renderToResults
} from '../src/streams/upload';
import {Observable} from 'rx-dom';

describe('Upload suite', function() {
  describe('processFacesFactory', function() {
    it('Should be an function', function() {
      expect(processFacesFactory).to.be.an('function');
    });
    it('Should return an Observable', function() {
      expect(processFacesFactory(new Event('')))
        .to.be.an.instanceof(Observable);
    });
  });
  describe('loadStart', function() {
    it('Should be an function', function() {
      expect(loadStart).to.be.an('function');
    });
  });
  describe('wait', function() {
    it('Should be an function', function() {
      expect(wait).to.be.an('function');
    });
  });
  describe('upload$', function() {
    it('Should be an Observable', function() {
      expect(upload$).to.be.an.instanceof(Observable);
    });
  });
  describe('loadEnd', function() {
    it('Should be an function', function() {
      expect(loadEnd).to.be.an('function');
    });
  });
});
