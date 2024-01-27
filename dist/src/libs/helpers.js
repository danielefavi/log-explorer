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
exports.getFileList = exports.getValidatedArgs = exports.getPortFromArgs = void 0;
const fs_1 = __importDefault(require("fs"));
const glob = __importStar(require("glob"));
/**
 * Perform the validation of the port number given in the CLI
 *
 * @param   {string|undefined}  port
 *
 * @return  {number}
 */
function validateServerPort(port) {
    if (typeof port === 'undefined') {
        throw new Error('Error: --port requires a port number');
    }
    const portNum = parseInt(port);
    if (isNaN(portNum)) {
        throw new Error('Error: --port is not a valid number');
    }
    else if (portNum < 0 || portNum > 65535) {
        throw new Error('Error: --port is not a valid port number: the port should be port > 0 and port < 65535');
    }
    return portNum;
}
/**
 * Get the port number from the CLI arguments
 *
 * @return  {number}
 */
function getPortFromArgs(args = process.argv) {
    let port = 4321;
    let inx = null;
    if (args.includes('--port')) {
        inx = args.indexOf('--port') + 1;
    }
    else if (args.includes('-p')) {
        inx = args.indexOf('-p') + 1;
    }
    if (inx !== null) {
        port = validateServerPort(args[inx]);
    }
    return port;
}
exports.getPortFromArgs = getPortFromArgs;
/**
 * Get the validated arguments from the CLI
 *
 * @return  {Settings}
 */
function getValidatedArgs() {
    const settings = {
        port: 4321
    };
    try {
        settings.port = getPortFromArgs();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        process.exit(1);
    }
    return settings;
}
exports.getValidatedArgs = getValidatedArgs;
/**
 * Get the list of log files contained in the current directory (where the
 * command is executed).
 *
 * @return  {string[]}
 */
function getFileList() {
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
exports.getFileList = getFileList;
