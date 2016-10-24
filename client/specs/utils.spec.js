import {isLowerThenMaxFileSize} from '../src/utils'

describe('isLowerThenMaxFileSize', function() {
  it('Should be an function', function() {
    expect(isLowerThenMaxFileSize).to.be.an('function');
  });
});
