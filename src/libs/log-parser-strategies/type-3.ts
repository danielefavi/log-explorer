import { LogEntry, LogParserStrategy } from '../../types/log-types';

export default class Type3LogParserStrategy implements LogParserStrategy {

  public parse(log: string): LogEntry|null {
    const regex = /- \[(?<ip>.+?)\] \[(?<timestamp>.+?)\] - "(?<method>\w+) (?<url>.+?) (?<protocol>.+?)" (?<status>\d+) (?<size>\d+) "(?<referer>.+?)" "(?<user_agent>.+?)" (?<request_time>.+)/;
    const match = log.match(regex);

    if (match) {
      let entry: LogEntry = { timestamp: '', message: '' };

      entry.timestamp = match.groups!.timestamp;
      entry.ip = match.groups!.ip;
      entry.method = match.groups!.method;
      entry.url = match.groups!.url;
      entry.protocol = match.groups!.protocol;
      entry.status = parseInt(match.groups!.status);
      entry.size = parseInt(match.groups!.size);
      entry.referer = match.groups!.referer;
      entry.userAgent = match.groups!.user_agent;
      entry.requestTime = parseFloat(match.groups!.request_time);

      return entry;
    }

    return null;
  }

}