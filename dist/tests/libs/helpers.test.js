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
Object.defineProperty(exports, "__esModule", { value: true });
const glob = __importStar(require("glob"));
const fs = __importStar(require("fs"));
const helpers_1 = require("../../src/libs/helpers");
jest.mock('glob');
jest.mock('fs');
describe('getPortFromArgs function', () => {
    let processArgv = [];
    it('should return default value if no port argument is given', () => {
        processArgv = ['node', 'script.js'];
        expect((0, helpers_1.getPortFromArgs)(processArgv)).toEqual(4321);
    });
    it('should return correct port number passed with --port flag', () => {
        processArgv = ['node', 'script.js', '--port', '8080'];
        expect((0, helpers_1.getPortFromArgs)(processArgv)).toEqual(8080);
    });
    it('should return correct port number passed with -p flag', () => {
        processArgv = ['node', 'script.js', '-p', '9000'];
        expect((0, helpers_1.getPortFromArgs)(processArgv)).toEqual(9000);
    });
    it('should throw an error when invalid port number is given', () => {
        processArgv = ['node', 'script.js', '--port', 'invalid'];
        expect(() => (0, helpers_1.getPortFromArgs)(processArgv)).toThrowError(new Error('Error: --port is not a valid number'));
    });
    it('should throw error when port number is not within valid range', () => {
        processArgv = ['node', 'script.js', '--port', '70000'];
        expect(() => (0, helpers_1.getPortFromArgs)(processArgv)).toThrowError(new Error('Error: --port is not a valid port number: the port should be port > 0 and port < 65535'));
    });
});
describe('getFileList', () => {
    it('should return the list of log files', () => {
        // Arrange
        const mockGlobSync = glob.sync;
        const mockFsStatSync = fs.statSync;
        const mockFiles = ['b-log-file1.log', 'another/log-file.log', 'c-log3.log'];
        mockGlobSync.mockReturnValue(mockFiles);
        mockFsStatSync.mockImplementation(() => ({
            isFile: () => true,
        }));
        const actual = (0, helpers_1.getFileList)();
        expect(actual).toEqual(mockFiles.sort());
        expect(mockGlobSync).toHaveBeenCalledWith('**/*.log', { cwd: process.cwd() });
        mockFiles.forEach((file) => {
            expect(mockFsStatSync).toHaveBeenCalledWith(file);
        });
    });
});
