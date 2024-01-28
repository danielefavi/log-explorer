"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Type2LogParserStrategy {
    parse(log) {
        const regex = /\[(?<timestamp>.+?) UTC\] (?<message>.+)/;
        const match = log.match(regex);
        if (match) {
            let entry = { timestamp: '', message: '' };
            entry.timestamp = match.groups.timestamp;
            entry.message = match.groups.message;
            return entry;
        }
        return null;
    }
}
exports.default = Type2LogParserStrategy;
