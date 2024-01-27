"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_2_1 = __importDefault(require("../../../src/libs/log-parser-strategies/type-2"));
describe('Type2LogParserStrategy', () => {
    let parser;
    beforeEach(() => {
        parser = new type_2_1.default();
    });
    it('should parse a valid log entry', () => {
        const logTest1 = '[28-Dec-2023 14:19:01 UTC] Warning:  Undefined index: curr in /path/to/app/apploader.exp on line 63';
        const expectedEntryTest1 = {
            timestamp: "28-Dec-2023 14:19:01",
            message: "Warning:  Undefined index: curr in /path/to/app/apploader.exp on line 63",
        };
        expect(parser.parse(logTest1)).toEqual(expectedEntryTest1);
        const logTest2 = '[2022-01-01 12:00:00 UTC] This is a log message';
        const expectedEntryTest2 = {
            timestamp: '2022-01-01 12:00:00',
            message: 'This is a log message',
        };
        expect(parser.parse(logTest2)).toEqual(expectedEntryTest2);
    });
    it('should return null for an invalid log entry', () => {
        const log = 'Invalid log entry';
        expect(parser.parse(log)).toBeNull();
    });
});
