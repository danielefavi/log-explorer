"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../src/libs/helpers");
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
