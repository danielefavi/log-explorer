import LogParser from '../../src/libs/log-parser';
import { LogEntry, LogParserStrategy } from '../../src/types/log-types';

class MockStrategy1 implements LogParserStrategy {
  parse(log: string): LogEntry | null {
      return null;
  }
}

class MockStrategy2 implements LogParserStrategy {
  parse(log: string): LogEntry | null {
      return { timestamp: 'mock-timestamp', message: 'mock-message', fileName: 'mock-fileName' };
  }
}

describe('LogParser', () => {
  let mockStrategy1 = new MockStrategy1();
  let mockStrategy2 = new MockStrategy2();

  let parser: any;
  
  beforeAll(() => {
    parser = new LogParser();
  })

  beforeEach(() => {
    jest.clearAllMocks();
    parser.strategies = [mockStrategy1, mockStrategy2];
  });

  it('should return a mock logEntry', function () {
    const mockLog = "mock log";
    expect(parser.parse(mockLog))
      .toEqual({ timestamp: 'mock-timestamp', message: 'mock-message', fileName: 'mock-fileName' });
  });

  it('should return an unsuccessful attempt', function () {
    parser.strategies = [mockStrategy1];
    const mockLog = "mock log";
    expect(parser.parse(mockLog))
      .toEqual({ timestamp: 'N/A', message: mockLog, fileName: '' });
  });
});
