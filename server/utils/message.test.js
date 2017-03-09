const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {

  it('should generate the correct location message object', () => {
    const from = 'dummy';
    const lat = 1;
    const lng = 2;
    const url = `https://google.com/maps?q=${lat},${lng}`;

    const result = generateLocationMessage(from, lat, lng);

    expect(result).toBeA('object');
    expect(result).toInclude({ from, url });
    expect(result.createdAt).toBeA('number');
  });

});
