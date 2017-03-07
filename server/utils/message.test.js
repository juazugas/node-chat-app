const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {

  it('should generate the correct message object', () => {
    const from = 'dummy';
    const text = 'Text message';

    const result = generateMessage(from, text);

    expect(result).toBeA('object');
    expect(result).toInclude({ from , text });
    expect(result.createdAt).toBeA('number');
  });

});
