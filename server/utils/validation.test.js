const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {

  it('should check if the string is real', () => {
    const validStr = 'Valid';

    let result = isRealString(validStr);

    expect(result).toBeTruthy();
  });

  it('should reject string with only spaces', () => {
    const invalidStr = '    ';

    let result = isRealString(invalidStr);

    expect(result).toBeFalsy();
  });

  it('should reject non-string values', () => {
    const invalid = 123;

    let result = isRealString(invalid);

    expect(result).toBeFalsy();
  });

});
