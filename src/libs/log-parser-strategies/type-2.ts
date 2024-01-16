import { LogEntry, LogParserStrategy } from '../../types/log-types';

export default class Type2LogParserStrategy implements LogParserStrategy {

  public parse(log: string): LogEntry|null {
    const regex = /\[(?<timestamp>.+?) UTC\] (?<message>.+)/;
    const match = log.match(regex);

    if (match) {
      let entry: LogEntry = { timestamp: '', message: '' };

      entry.timestamp = match.groups!.timestamp;
      entry.message = match.groups!.message;

      return entry;
    }

    return null;
  }

}