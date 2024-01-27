import * as glob from 'glob';
import * as fs from 'fs';
import { getPortFromArgs, getFileList } from '../../src/libs/helpers';

jest.mock('glob');
jest.mock('fs');

describe('getPortFromArgs function', () => {
  let processArgv: string[] = [];

  it('should return default value if no port argument is given', () => {
    processArgv = ['node', 'script.js'];
    expect(getPortFromArgs(processArgv)).toEqual(4321);
  });

  it('should return correct port number passed with --port flag', () => {
    processArgv = ['node', 'script.js', '--port', '8080'];
    expect(getPortFromArgs(processArgv)).toEqual(8080);
  });

  it('should return correct port number passed with -p flag', () => {
    processArgv = ['node', 'script.js', '-p', '9000'];
    expect(getPortFromArgs(processArgv)).toEqual(9000);
  });

  it('should throw an error when invalid port number is given', () => {
    processArgv = ['node', 'script.js', '--port', 'invalid'];
    expect(() => getPortFromArgs(processArgv)).toThrowError(new Error('Error: --port is not a valid number'));
  });

  it('should throw error when port number is not within valid range', () => {
    processArgv = ['node', 'script.js', '--port', '70000'];
    expect(() => getPortFromArgs(processArgv)).toThrowError(new Error('Error: --port is not a valid port number: the port should be port > 0 and port < 65535'));
  });
});  

describe('getFileList', () => {
  it('should return the list of log files', () => {
    // Arrange
    const mockGlobSync = glob.sync as jest.MockedFunction<typeof glob.sync>;
    const mockFsStatSync = fs.statSync as jest.MockedFunction<typeof fs.statSync>;
    const mockFiles = ['b-log-file1.log', 'another/log-file.log', 'c-log3.log'];
    
    mockGlobSync.mockReturnValue(mockFiles);
    mockFsStatSync.mockImplementation(() => ({
      isFile: () => true,
    } as fs.Stats));
    
    const actual = getFileList();

    expect(actual).toEqual(mockFiles.sort());
    expect(mockGlobSync).toHaveBeenCalledWith('**/*.log', { cwd: process.cwd() });
    mockFiles.forEach((file: string) => {
      expect(mockFsStatSync).toHaveBeenCalledWith(file);
    });
  });
});