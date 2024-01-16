"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NpmLogParserStrategy {
    parse(log) {
        const regex = /(?<number>\d+) (?<logLevel>silent|error|warn|notice|http|info|verbose|silly|timing) (?<detail>.+)/;
        const match = log.match(regex);
        if (match) {
            let entry = {};
            entry.number = parseInt(match.groups.number);
            entry.logLevel = match.groups.logLevel.trim();
            entry.details = match.groups.detail;
            return entry;
        }
        console.log('NpmLogParserStrategy: No match found for log: ', log);
        return null;
    }
}
exports.default = NpmLogParserStrategy;
