"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1_1 = __importDefault(require("./log-parser-strategies/type-1"));
const type_2_1 = __importDefault(require("./log-parser-strategies/type-2"));
const type_3_1 = __importDefault(require("./log-parser-strategies/type-3"));
const npm_log_parser_strategy_1 = __importDefault(require("./log-parser-strategies/npm-log-parser-strategy"));
class LogParser {
    strategies = [
        new type_1_1.default(),
        new type_2_1.default(),
        new type_3_1.default(),
        new npm_log_parser_strategy_1.default()
    ];
    parse(log) {
        for (let strategy of this.strategies) {
            let entry = strategy.parse(log.trim());
            if (entry) {
                return entry;
            }
        }
        return { timestamp: 'N/A', message: log, fileName: '' };
    }
}
exports.default = LogParser;
