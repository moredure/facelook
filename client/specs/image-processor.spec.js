import {
  isLowerThenMaxFileSize, 
  filterMaxFileSize,
  isInWhiteList,
  filterImagesInWhiteList,
  toObservable,
  filterImages,
  removeChildren,
  toArray, 
  isImage,
  normalizeFiles
} from '../src/utils/image-processor';
import {MAX_FILE_SIZE, EXTENSIONS_WHITELIST} from '../src/config';

describe('Utils suite', function() {
  describe('isLowerThenMaxFileSize', function() {
    it('Should be an function', function() {
      expect(isLowerThenMaxFileSize).to.be.an('function');
    });
    it('Should return true if number lower then MAX_FILE_SIZE', function() {
      let file = {size: 10 * 1024};
      const result = isLowerThenMaxFileSize(file);
      expect(result).to.be.a('Boolean');
      expect(result).to.be.true;
    });
  });

  describe('filterMaxFileSize', function() {
    it('Should be an function', function() {
      expect(filterMaxFileSize).to.be.an('function');
    });
    it('Should filter files with file size greater then MAX_FILE_SIZE', function() {
      let files = [
        {size: 2 * 1024 * 1024}, 
        {size: 512 * 1024}
      ];
      let filteredFiles = filterMaxFileSize(files);
      expect(filteredFiles).to.have.lengthOf(1);
      expect(filteredFiles[0]).to.deep.equal(files[1]);
    });
  });

  describe('isInWhiteList', function() {
    it('Should be an function', function() {
      expect(isInWhiteList).to.be.an('function');
    });
  });

  describe('filterImagesInWhiteList', function() {
    it('Should be an function', function() {
      expect(filterImagesInWhiteList).to.be.an('function');
    });
  });

  describe('toObservable', function() {
    it('Should be an function', function() {
      expect(toObservable).to.be.an('function');
    });
  });

  describe('isImage', function() {
    it('Should be an function', function() {
      expect(isImage).to.be.an('function');
    });
  });

  describe('toArray', function() {
    it('Should be an function', function() {
      expect(toArray).to.be.an('function');
    });

    it('Should return array', function() {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      ul.appendChild(li);
      let arrayLikeObj = ul.getElementsByTagName('li');
      expect(arrayLikeObj).to.exist;
      expect(toArray(arrayLikeObj)).to.be.an('Array');
    });
  });

  describe('normalizeFiles', function() {
    it('Should be an function', function() {
      expect(normalizeFiles).to.be.an('function');
    });
  });
});
