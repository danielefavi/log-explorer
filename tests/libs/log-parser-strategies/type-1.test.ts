import Type1LogParserStrategy from '../../../src/libs/log-parser-strategies/type-1';

describe('Type1LogParserStrategy', () => {
  let parser: Type1LogParserStrategy;

  beforeEach(() => {
    parser = new Type1LogParserStrategy();
  });

  it('should parse valid log entry correctly', () => {
    const logTest1 = '2030-12-28T14:11:10.517027+00:00 WARNING \'> GET /en\' \'{"value":"none"}\' \'{"debug":true,"locale":"en","environment":"development","consoleMode":false,"requestId":null,"url":"/en","ip":"1.2.3.4","http_method":"GET","server":"example.com","referrer":null,"file":"SomeFile.dat","line":95,"class":"SomeClass","function":"SomeFunction"}\'';
    const expectedEntryTest1 = {
      level: "WARNING",
      message: "> GET /en",
      timestamp: "2030-12-28T14:11:10.517027+00:00",
      context: {
        "value": "none",
      },
      "extra": {
        "class": "SomeClass",
        "consoleMode": false,
        "debug": true,
        "environment": "development",
        "file": "SomeFile.dat",
        "function": "SomeFunction",
        "http_method": "GET",
        "ip": "1.2.3.4",
        "line": 95,
        "locale": "en",
        "referrer": null,
        "requestId": null,
        "server": "example.com",
        "url": "/en",
      }
    };
    expect(parser.parse(logTest1)).toEqual(expectedEntryTest1);

    const logTest2 = '2022-01-01T12:34:56.789000+00:00 INFO \'Log message\' \'{"key": "value"}\' \'{"extra": "data"}\'';
    const expectedEntryTest2 = {
      timestamp: '2022-01-01T12:34:56.789000+00:00',
      level: 'INFO',
      message: 'Log message',
      context: { key: 'value' },
      extra: { extra: 'data' }
    };
    expect(parser.parse(logTest2)).toEqual(expectedEntryTest2);
  });

  it('should return null for invalid log entry', () => {
    const log = 'Invalid log entry';

    expect(parser.parse(log)).toBeNull();
  });
});