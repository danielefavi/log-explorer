import { LogEntry, LogParserStrategy } from '../types/log-types';
import Type1LogParserStrategy from './log-parser-strategies/type-1';
import Type2LogParserStrategy from './log-parser-strategies/type-2';
import Type3LogParserStrategy from './log-parser-strategies/type-3';
import NpmLogParserStrategy from './log-parser-strategies/npm-log-parser-strategy';

/**
 * The LogParser class is used to parse the log lines
 */
export default class LogParser {

  /**
   * The instances of the strategies to parse the log lines
   *
   * @var {LogParserStrategy[]}
   */
  private strategies: LogParserStrategy[] = [
    new Type1LogParserStrategy(),
    new Type2LogParserStrategy(),
    new Type3LogParserStrategy(),
    new NpmLogParserStrategy()
  ];

  /**
   * Parse the log line and return a LogEntry object
   *
   * @param   {string}    log
   *
   * @return  {LogEntry}
   */
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