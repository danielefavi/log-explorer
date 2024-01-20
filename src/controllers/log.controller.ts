import * as glob from 'glob';
import fs from 'fs';
import { Request, Response } from 'express';
import { LogEntry } from '../types/log-types';
import LogParser from '../libs/log-parser';
import * as readLastLines from 'read-last-lines';



export default class LogController {

  /**
   * The instance of the controller
   * @var {LogController}
   */
  private static instance: LogController;
  
  /**
   * The LogParser class is used to parse the log lines
   * @var {LogParser}
   */
  private logParser: LogParser;

  constructor() {
    this.logParser = new LogParser();
  }

  /**
   * Get the instance of the controller
   *
   * @return  {LogController}[return description]
   */
  public static getInstance(): LogController {
    if (!LogController.instance) {
      LogController.instance = new LogController();
    }

    return LogController.instance;
  }

  /**
   * Get the list of log files contained in the current directory (where the
   * command is executed) and return it as JSON.
   *
   * @param   {Request}   req
   * @param   {Response}  res
   *
   * @return  {Response<any, Record<string, any>>}
   */
  public static getLogFiles(req: Request, res: Response) {
    res.json(LogController.getInstance().getFileList());
  }
  
  /**
   * Get the list of log files contained in the current directory (where the
   * command is executed).
   *
   * @return  {string[]}
   */
  private getFileList(): string[] {
    const result: string[] = [];

    const files = glob.sync('**/*.log', { cwd: process.cwd() });

    files.forEach((file: string) => {
      const stats = fs.statSync(file);
      if (stats.isFile()) {
        result.push(file);
      }
    });

    result.sort();

    return result;
  }

  /**
   * Get the content of a log file and return it as JSON.
   *
   * @param   {Request}   req
   * @param   {Response}  res 
   *
   * @return  void
   */
  public static async getLogFileContent(req: Request, res: Response) {
    const fileName = req.query.file as string;
  
    // check if the file exists
    if (!fs.existsSync(fileName)) {
      res.status(404).json({ message: 'File not found' });
      return;
    }
  
    let page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    let itemsPerPage = parseInt(req.query.items_per_page as string);
    if (isNaN(itemsPerPage) || itemsPerPage < 1) {
      itemsPerPage = 50;
    }
  
    const entries: LogEntry[] = [];
    const logParser = LogController.getInstance().logParser;

    try {
      const lines = await readLastLines.read(fileName, page * itemsPerPage);
      const linesArray = lines.split('\n').reverse();
  
      for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage && i < linesArray.length; i++) {
        const line = linesArray[i];
        if (line.trim() === '') {
          continue;
        }
        const parsedEntry = logParser.parse(line);
        parsedEntry.fileName = fileName;
        entries.push(parsedEntry);
      }
  
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: 'Error reading file' });
    }
  }

  /**
   * Search the logs for a given query and return the results as JSON.
   *
   * @param   {Request}   req
   * @param   {Response}  res
   *
   * @return  void
   */
  public static async searchLogs(req: Request, res: Response) {
    const queryParams = req.query;
    const query = queryParams.query as string;
    const entries: LogEntry[] = [];
    const files = LogController.getInstance().getFileList();
    
    for (const file of files) {
      const data = await readLastLines.read(file, 500); // reads last 1000 lines of the file.
  
      const lines = data.split('\n');
      const logParser = LogController.getInstance().logParser;
  
      for (let line of lines) { 
        if (line.includes(query)) {
          const parsedEntry = logParser.parse(line); 
          if (parsedEntry) {
            parsedEntry.fileName = file;
            entries.push(parsedEntry);
          }
        }
      }
    }

    res.json(entries);
  }

}