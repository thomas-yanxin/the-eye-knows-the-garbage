"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
function createControlledWatchCompilerHost(parsedCommandLine, system, createProgram, reportDiagnostic, reportWatchStatus, afterProgramCreate, hostExtensions = []) {
    const baseWatchCompilerHost = ts.createWatchCompilerHost(parsedCommandLine.fileNames, parsedCommandLine.options, system, createProgram, reportDiagnostic, reportWatchStatus, parsedCommandLine.projectReferences);
    let controlledWatchCompilerHost = Object.assign(Object.assign({}, baseWatchCompilerHost), { createProgram(rootNames, options, compilerHost, oldProgram, configFileParsingDiagnostics, projectReferences) {
            // as compilerHost is optional, ensure that we have it
            if (!compilerHost) {
                compilerHost = ts.createCompilerHost(options || parsedCommandLine.options);
            }
            hostExtensions.forEach((hostExtension) => {
                if (compilerHost && hostExtension.extendCompilerHost) {
                    compilerHost = hostExtension.extendCompilerHost(compilerHost, parsedCommandLine);
                }
            });
            return baseWatchCompilerHost.createProgram(rootNames, options, compilerHost, oldProgram, configFileParsingDiagnostics, projectReferences);
        },
        afterProgramCreate(program) {
            if (afterProgramCreate) {
                afterProgramCreate(program);
            }
        },
        onWatchStatusChange() {
            // do nothing
        }, watchFile: system.watchFile, watchDirectory: system.watchDirectory, setTimeout: system.setTimeout, clearTimeout: system.clearTimeout, fileExists: system.fileExists, readFile: system.readFile, directoryExists: system.directoryExists, getDirectories: system.getDirectories, realpath: system.realpath });
    hostExtensions.forEach((hostExtension) => {
        if (hostExtension.extendWatchCompilerHost) {
            controlledWatchCompilerHost = hostExtension.extendWatchCompilerHost(controlledWatchCompilerHost, parsedCommandLine);
        }
    });
    return controlledWatchCompilerHost;
}
exports.createControlledWatchCompilerHost = createControlledWatchCompilerHost;
