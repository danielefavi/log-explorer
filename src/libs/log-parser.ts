import { LogEntry, LogParserStrategy } from '../types/log-types';
import Type1LogParserStrategy from './log-parser-strategies/type-1';
import Type2LogParserStrategy from './log-parser-strategies/type-2';
import Type3LogParserStrategy from './log-parser-strategies/type-3';
import NpmLogParserStrategy from './log-parser-strategies/npm-log-parser-strategy';

export default class LogParser {

  private strategies: LogParserStrategy[] = [
    new Type1LogParserStrategy(),
    new Type2LogParserStrategy(),
    new Type3LogParserStrategy(),
    new NpmLogParserStrategy()
  ];

  public parse(log: string): LogEntry {
    for (let strategy of this.strategies) {
      let entry = strategy.parse(log.trim());
      if (entry) {
        return entry;
      }
    }

    return { timestamp: 'N/A', message: log, fileName: '' };
  }

}