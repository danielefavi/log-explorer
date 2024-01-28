"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_3_1 = __importDefault(require("../../../src/libs/log-parser-strategies/type-3"));
describe('Type3LogParserStrategy', () => {
    let parser;
    beforeEach(() => {
        parser = new type_3_1.default();
    });
    it('should parse a valid log entry', () => {
        const logTest2 = '- [123.124.125.126] [2023-12-28T14:19:03+00:00] - "GET /some/url/here/html HTTP/1.1" 200 1223 "http://www.referer-example.com" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0" 0.000';
        const expectedEntryTest2 = {
            timestamp: "2023-12-28T14:19:03+00:00",
            url: "/some/url/here/html",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
            referer: "http://www.referer-example.com",
            requestTime: 0,
            size: 1223,
            status: 200,
            ip: "123.124.125.126",
            method: "GET",
            protocol: "HTTP/1.1",
        };
        expect(parser.parse(logTest2)).toEqual(expectedEntryTest2);
        const logTest1 = '- [127.0.0.1] [2022-01-01T12:34:56Z] - "GET /api/users HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0" 0.123';
        const expectedEntryTest1 = {
            timestamp: '2022-01-01T12:34:56Z',
            ip: '127.0.0.1',
            method: 'GET',
            url: '/api/users',
            protocol: 'HTTP/1.1',
            status: 200,
            size: 1024,
            referer: 'http://example.com',
            userAgent: 'Mozilla/5.0',
            requestTime: 0.123,
        };
        expect(parser.parse(logTest1)).toEqual(expectedEntryTest1);
    });
    it('should return null for an invalid log entry', () => {
        const log = '- [127.0.0.1] [2022-01-01T12:34:56Z] - "GET /api/users HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"';
        expect(parser.parse(log)).toBeNull();
    });
});
