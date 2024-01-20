"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob = __importStar(require("glob"));
const fs_1 = __importDefault(require("fs"));
const log_parser_1 = __importDefault(require("../libs/log-parser"));
const readLastLines = __importStar(require("read-last-lines"));
class LogController {
    /**
     * The instance of the controller
     * @var {LogController}
     */
    static instance;
    /**
     * The LogParser class is used to parse the log lines
     * @var {LogParser}
     */
    logParser;
    constructor() {
        this.logParser = new log_parser_1.default();
    }
    /**
     * Get the instance of the controller
     *
     * @return  {LogController}[return description]
     */
    static getInstance() {
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
    static getLogFiles(req, res) {
        res.json(LogController.getInstance().getFileList());
    }
    /**
     * Get the list of log files contained in the current directory (where the
     * command is executed).
     *
     * @return  {string[]}
     */
    getFileList() {
        const result = [];
        const files = glob.sync('**/*.log', { cwd: process.cwd() });
        files.forEach((file) => {
            const stats = fs_1.default.statSync(file);
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
    static async getLogFileContent(req, res) {
        const fileName = req.query.file;
        // check if the file exists
        if (!fs_1.default.existsSync(fileName)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        let page = parseInt(req.query.page);
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        let itemsPerPage = parseInt(req.query.items_per_page);
        if (isNaN(itemsPerPage) || itemsPerPage < 1) {
            itemsPerPage = 50;
        }
        const entries = [];
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
        }
        catch (err) {
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
    static async searchLogs(req, res) {
        const queryParams = req.query;
        const query = queryParams.query;
        const entries = [];
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
exports.default = LogController;
