import * as glob from 'glob';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { LogEntry } from '../types/log-types';
import LogParser from '../libs/log-parser';
import * as readLastLines from 'read-last-lines';

export default class LogController {
  private static instance: LogController;
  private logParser: LogParser;

  constructor() {
    this.logParser = new LogParser();
  }

  public static getInstance(): LogController {
    if (!LogController.instance) {
      LogController.instance = new LogController();
    }

    return LogController.instance;
  }

  public static getLogFiles(req: Request, res: Response) {
    res.json(LogController.getInstance().getFileList());
  }
  
  private getFileList(): string[] {
    const result: string[] = [];

    const files = glob.sync('**/*.log', { cwd: process.cwd() });

    files.forEach((file: string) => {
      const stats = fs.statSync(file);
      if (stats.isFile()) {
        // result.push(path.join(process.cwd(), file));
        result.push(file);
      }
    });

    result.sort();

    return result;
  }

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

  public static searchLogs(req: Request, res: Response) {
    const queryParams = req.query;
  
    const query = queryParams.query as string;
  
    let page = parseInt(queryParams.page as string);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
  
    let itemsPerPage = parseInt(queryParams.items_per_page as string);
    if (isNaN(itemsPerPage) || itemsPerPage < 1) {
      itemsPerPage = 10;
    }
  
    const entries: LogEntry[] = [];
    let fileCount = 0;
  
    const files = LogController.getInstance().getFileList();
    
    for (const file of files) {
      fileCount++;
      if (fileCount <= (page - 1) * itemsPerPage) {
        return;
      }
      if (fileCount > page * itemsPerPage) {
        return;
      }

      const data = fs.readFileSync(file, 'utf-8');
      const lines = data.split('\n');
      const logParser = LogController.getInstance().logParser;

      for (const line of lines) {
        if (line.trim() === '') {
          continue;
        }
        if (line.includes(query)) {
          const parsedEntry = logParser.parse(line); // Assuming parseLog is defined and returns a LogEntry
          if (parsedEntry) {
            parsedEntry.fileName = file;
            entries.push(parsedEntry);
          }
        }
      }
    }
          
    if (entries.length > itemsPerPage) {
      entries.splice(itemsPerPage);
    }
  
    res.json(entries);
  }
   
}