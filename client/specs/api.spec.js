import {
  fileAsDataURI$,
  detectFaceCall$,
  faceDetectionAPI
} from '../src/api';

describe('Api suite', function() {
  describe('fileAsDataURI$', function() {
    it('Should be an function', function() {
      expect(fileAsDataURI$).to.be.an('function');
    });
  });
  describe('detectFaceCall$', function() {
    it('Should be an function', function() {
      expect(detectFaceCall$).to.be.an('function');
    });
  });
  describe('faceDetectionAPI', function() {
    it('Should be an function', function() {
      expect(faceDetectionAPI).to.be.an('function');
    });
  });
});
