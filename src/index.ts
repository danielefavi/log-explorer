#!/usr/bin/env node

import express, { Request, Response, NextFunction } from 'express';
import child_process from 'child_process';
import { getPort } from './libs/helpers';
import apiRoutes from './routes/api';
import CliController from './controllers/cli.controller';

CliController.exec(process);

const app = express();

app.use('/api', apiRoutes);

app.use('/public', express.static(__dirname + '/../public'));
app.get('/', (req: Request, res: Response) => res.sendFile('index.html', { root: __dirname + '/../views' }));
app.use('*', (req: Request, res: Response) => res.sendFile('404.html', { root: __dirname + '/../views' }));


const port = getPort();

app
  .listen(port, () => {
    const url = `http://localhost:${port}`;

    console.log(`Server started at ` + url);

    // opening the browser
    var start = (process.platform == 'darwin' ? 'open': process.platform == 'win32' ? 'start': 'xdg-open');
    child_process.exec(start + ' ' + url);  
  })
  .on('error', (err: Error & { code?: string }) => {
    if (
      err instanceof Object &&
      err.hasOwnProperty('code') &&
      typeof err.code === 'string' &&
      err.code === 'EADDRINUSE'
    ) {
      console.error(`Port ${port} is busy, please try another port using --port option`);
      process.exit(1);
    } else {
      console.error(err);
    }

    process.exit(1);
  });