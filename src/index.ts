#!/usr/bin/env node

import express, { Request, Response, NextFunction } from 'express';
import child_process from 'child_process';
import { getValidatedArgs } from './libs/helpers';
import apiRoutes from './routes/api';
import CliController from './controllers/cli.controller';

// Execute the CLI command in case of HELP or VERSION, otherwise starts the server
CliController.exec(process);

// getting the port number from the CLI arguments or using the default one
const settings = getValidatedArgs();

const app = express();

// setting up the routes
app.use('/api', apiRoutes);
app.use('/public', express.static(__dirname + '/../public'));
app.get('/', (req: Request, res: Response) => res.sendFile('index.html', { root: __dirname + '/../views' }));
app.use('*', (req: Request, res: Response) => res.sendFile('404.html', { root: __dirname + '/../views' }));


// starting the server
app
  .listen(settings.port, () => {
    const url = `http://localhost:${settings.port}`;

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
      console.error(`Port ${settings.port} is busy, please try another port using --port option`);
      process.exit(1);
    } else {
      console.error(err);
    }

    process.exit(1);
  });