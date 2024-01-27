import Type2LogParserStrategy from '../../../src/libs/log-parser-strategies/type-2';

describe('Type2LogParserStrategy', () => {
  let parser: Type2LogParserStrategy;

  beforeEach(() => {
    parser = new Type2LogParserStrategy();
  });

  it('should parse a valid log entry', () => {
    const logTest1 = '[28-Dec-2023 14:19:01 UTC] Warning:  Undefined index: curr in /path/to/app/apploader.exp on line 63';
    const expectedEntryTest1 = {
      timestamp: "28-Dec-2023 14:19:01",
      message: "Warning:  Undefined index: curr in /path/to/app/apploader.exp on line 63",
    };
    expect(parser.parse(logTest1)).toEqual(expectedEntryTest1);

    const logTest2 = '[2022-01-01 12:00:00 UTC] This is a log message';
    const expectedEntryTest2 = {
      timestamp: '2022-01-01 12:00:00',
      message: 'This is a log message',
    };
    expect(parser.parse(logTest2)).toEqual(expectedEntryTest2);
  });

  it('should return null for an invalid log entry', () => {
    const log = 'Invalid log entry';

    expect(parser.parse(log)).toBeNull();
  });
});