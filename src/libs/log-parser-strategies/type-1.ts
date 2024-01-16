import { LogEntry, LogParserStrategy } from '../../types/log-types';

export default class Type1LogParserStrategy implements LogParserStrategy {

  public parse(log: string): LogEntry|null {
    const regex = /(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}) (?<level>\w+) '(?<message>.+?)' '(?<context>.+?)' '(?<extra>.+?)'/;
    const match = log.match(regex);

    if (match) {
      let entry: LogEntry = { timestamp: '', message: '' };

      entry.timestamp = match.groups!.timestamp;
      entry.level = match.groups!.level;
      entry.message = match.groups!.message;
      entry.context = JSON.parse(match.groups!.context);
      entry.extra = JSON.parse(match.groups!.extra);

      return entry;
    }

    return null;
  }

}