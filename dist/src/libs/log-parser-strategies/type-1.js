"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Type1LogParserStrategy {
    parse(log) {
        const regex = /(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}) (?<level>\w+) '(?<message>.+?)' '(?<context>.+?)' '(?<extra>.+?)'/;
        const match = log.match(regex);
        if (match) {
            let entry = { timestamp: '', message: '' };
            entry.timestamp = match.groups.timestamp;
            entry.level = match.groups.level;
            entry.message = match.groups.message;
            entry.context = JSON.parse(match.groups.context);
            entry.extra = JSON.parse(match.groups.extra);
            return entry;
        }
        return null;
    }
}
exports.default = Type1LogParserStrategy;
