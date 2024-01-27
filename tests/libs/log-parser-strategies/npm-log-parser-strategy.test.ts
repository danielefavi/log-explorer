import NpmLogParserStrategy from '../../../src/libs/log-parser-strategies/npm-log-parser-strategy';

describe('NpmLogParserStrategy', () => {
  let parser: NpmLogParserStrategy;

  beforeEach(() => {
    parser = new NpmLogParserStrategy();
  });

  it('should parse a valid log entry', () => {
    const logTest1 = '26 verbose logfile /Users/SomeUser/.npm/_logs/2024-01-16T20_04_49_115Z-debug-0.log';
    const expectedEntryTest1 = {
      number: 26,
      logLevel: 'verbose',
      details: 'logfile /Users/SomeUser/.npm/_logs/2024-01-16T20_04_49_115Z-debug-0.log'
    };
    expect(parser.parse(logTest1)).toEqual(expectedEntryTest1);

    const logTest2 = '123 info This is a log entry';
    const expectedEntryTest2 = {
      number: 123,
      logLevel: 'info',
      details: 'This is a log entry'
    };
    expect(parser.parse(logTest2)).toEqual(expectedEntryTest2);
  });

  it('should return null for an invalid log entry', () => {
    const log = 'invalid log entry';

    expect(parser.parse(log)).toBeNull();
  });
});