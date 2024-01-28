"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_parser_1 = __importDefault(require("../../src/libs/log-parser"));
class MockStrategy1 {
    parse(log) {
        return null;
    }
}
class MockStrategy2 {
    parse(log) {
        return { timestamp: 'mock-timestamp', message: 'mock-message', fileName: 'mock-fileName' };
    }
}
describe('LogParser', () => {
    let mockStrategy1 = new MockStrategy1();
    let mockStrategy2 = new MockStrategy2();
    let parser;
    beforeAll(() => {
        parser = new log_parser_1.default();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        parser.strategies = [mockStrategy1, mockStrategy2];
    });
    it('should return a mock logEntry', function () {
        const mockLog = "mock log";
        expect(parser.parse(mockLog))
            .toEqual({ timestamp: 'mock-timestamp', message: 'mock-message', fileName: 'mock-fileName' });
    });
    it('should return an unsuccessful attempt', function () {
        parser.strategies = [mockStrategy1];
        const mockLog = "mock log";
        expect(parser.parse(mockLog))
            .toEqual({ timestamp: 'N/A', message: mockLog, fileName: '' });
    });
});
