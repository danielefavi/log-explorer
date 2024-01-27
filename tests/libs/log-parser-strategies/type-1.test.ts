import Type1LogParserStrategy from '../../../src/libs/log-parser-strategies/type-1';

describe('Type1LogParserStrategy', () => {
  let parser: Type1LogParserStrategy;

  beforeEach(() => {
    parser = new Type1LogParserStrategy();
  });

  it('should parse valid log entry correctly', () => {
    const log = '2022-01-01T12:34:56.789000+00:00 INFO \'Log message\' \'{"key": "value"}\' \'{"extra": "data"}\'';
    const expectedEntry = {
      timestamp: '2022-01-01T12:34:56.789000+00:00',
      level: 'INFO',
      message: 'Log message',
      context: { key: 'value' },
      extra: { extra: 'data' }
    };

    const result = parser.parse(log);

    expect(result).toEqual(expectedEntry);
  });

  it('should return null for invalid log entry', () => {
    const log = 'Invalid log entry';

    const result = parser.parse(log);

    expect(result).toBeNull();
  });
});