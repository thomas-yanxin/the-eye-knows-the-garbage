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
function parseTypeScriptConfiguration(configFileName, configFileContext, configOverwriteJSON, parseConfigFileHost) {
    const parsedConfigFileJSON = ts.readConfigFile(configFileName, parseConfigFileHost.readFile);
    const overwrittenConfigFileJSON = Object.assign(Object.assign(Object.assign({}, (parsedConfigFileJSON.config || {})), configOverwriteJSON), { compilerOptions: Object.assign(Object.assign({}, ((parsedConfigFileJSON.config || {}).compilerOptions || {})), (configOverwriteJSON.compilerOptions || {})) });
    const parsedConfigFile = ts.parseJsonConfigFileContent(overwrittenConfigFileJSON, parseConfigFileHost, configFileContext);
    return Object.assign(Object.assign({}, parsedConfigFile), { options: Object.assign(Object.assign({}, parsedConfigFile.options), { configFilePath: configFileName }), errors: parsedConfigFileJSON.error ? [parsedConfigFileJSON.error] : parsedConfigFile.errors });
}
exports.parseTypeScriptConfiguration = parseTypeScriptConfiguration;
