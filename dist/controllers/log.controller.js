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
    static instance;
    logParser;
    constructor() {
        this.logParser = new log_parser_1.default();
    }
    static getInstance() {
        if (!LogController.instance) {
            LogController.instance = new LogController();
        }
        return LogController.instance;
    }
    static getLogFiles(req, res) {
        res.json(LogController.getInstance().getFileList());
    }
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
    static searchLogs(req, res) {
        const queryParams = req.query;
        const query = queryParams.query;
        let page = parseInt(queryParams.page);
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        let itemsPerPage = parseInt(queryParams.items_per_page);
        if (isNaN(itemsPerPage) || itemsPerPage < 1) {
            itemsPerPage = 10;
        }
        const entries = [];
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
            const data = fs_1.default.readFileSync(file, 'utf-8');
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
exports.default = LogController;
