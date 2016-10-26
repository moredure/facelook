import {
  App, processFacesFactory,
  upload$, loadStart,
  wait, renderToResults,
  clearResultsImages
} from '../src/main';
import {Observable} from 'rx-dom';

describe('App suite', function() {
  describe('App', function() {
    it('Should be an function', function() {
      expect(App).to.be.an('function');
    });
  });
  describe('clearResultsImages', function() {
    it('Should be an function', function() {
      expect(clearResultsImages).to.be.an('function');
    });
  });
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
    it('Should be an function', function() {
      expect(upload$).to.be.an.instanceof(Observable);
    });
  });
});
