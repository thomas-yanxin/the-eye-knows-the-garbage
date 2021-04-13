"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggerFactory_1 = require("./LoggerFactory");
function createLoggerConfiguration(compiler, options) {
    return {
        infrastructure: LoggerFactory_1.createLogger((options && options.infrastructure) || 'silent', compiler),
        issues: LoggerFactory_1.createLogger((options && options.issues) || 'console', compiler),
    };
}
exports.createLoggerConfiguration = createLoggerConfiguration;
