#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = __importDefault(require("child_process"));
const helpers_1 = require("./libs/helpers");
const api_1 = __importDefault(require("./routes/api"));
const cli_controller_1 = __importDefault(require("./controllers/cli.controller"));
// import path from 'path';
cli_controller_1.default.exec(process);
const app = (0, express_1.default)();
app.use('/api', api_1.default);
// app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname + '/../views' }));
app.use('*', (req, res) => res.sendFile('404.html', { root: __dirname + '/../views' }));
const port = (0, helpers_1.getPort)();
app
    .listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Server started at ` + url);
    // opening the browser
    var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    child_process_1.default.exec(start + ' ' + url);
})
    .on('error', (err) => {
    if (err instanceof Object &&
        err.hasOwnProperty('code') &&
        typeof err.code === 'string' &&
        err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is busy, please try another port using --port option`);
        process.exit(1);
    }
    else {
        console.error(err);
    }
    process.exit(1);
});
