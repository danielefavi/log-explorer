export interface LogEntry {
  [key: string]: unknown;
}

export interface LogParserStrategy {
  parse(log: string): LogEntry|null;
}