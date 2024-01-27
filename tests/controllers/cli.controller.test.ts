import CliController from '../../src/controllers/cli.controller';
import { EventEmitter } from 'events';

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
    const mockNodeJSProcess = mockProcess as unknown as NodeJS.Process;

    const controller = new CliController(mockNodeJSProcess);
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
    const mockNodeJSProcess = mockProcess as unknown as NodeJS.Process;

    const controller = new CliController(mockNodeJSProcess);
    controller.cliExec();

    expect(mockConsoleLog).toHaveBeenCalledWith('1.0.0');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});