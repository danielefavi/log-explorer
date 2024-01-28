"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_controller_1 = __importDefault(require("../../src/controllers/cli.controller"));
const mockExit = jest.fn();
const mockConsoleLog = jest.fn();
jest.mock('../../package.json', () => ({
    version: '1.0.0'
}));
const originalConsoleLog = console.log;
beforeEach(() => {
    jest.clearAllMocks();
    console.log = mockConsoleLog;
});
afterAll(() => {
    console.log = originalConsoleLog;
});
describe('Test Version method', () => {
    it('should print the version of the package', () => {
        const mockProcess = {
            cwd: jest.fn().mockReturnValue('/fake/directory'),
            argv: ['path/to/node', 'path/to/main.js', '-v'],
            exit: mockExit
        };
        const mockNodeJSProcess = mockProcess;
        const controller = new cli_controller_1.default(mockNodeJSProcess);
        controller.cliExec();
        expect(mockConsoleLog).toHaveBeenCalledWith('1.0.0');
        expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('should work with --version argument as well', () => {
        const mockProcess = {
            cwd: jest.fn().mockReturnValue('/fake/directory'),
            argv: ['path/to/node', 'path/to/main.js', '-v'],
            exit: mockExit
        };
        const mockNodeJSProcess = mockProcess;
        const controller = new cli_controller_1.default(mockNodeJSProcess);
        controller.cliExec();
        expect(mockConsoleLog).toHaveBeenCalledWith('1.0.0');
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});
