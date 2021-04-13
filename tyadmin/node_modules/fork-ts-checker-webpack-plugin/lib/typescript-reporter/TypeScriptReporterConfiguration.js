"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ts = __importStar(require("typescript"));
const semver_1 = __importDefault(require("semver"));
const TypeScriptVueExtensionConfiguration_1 = require("./extension/vue/TypeScriptVueExtensionConfiguration");
function createTypeScriptReporterConfiguration(compiler, options) {
    let configFile = typeof options === 'object' ? options.configFile || 'tsconfig.json' : 'tsconfig.json';
    // ensure that `configFile` is an absolute normalized path
    configFile = path_1.default.normalize(path_1.default.isAbsolute(configFile)
        ? configFile
        : path_1.default.resolve(compiler.options.context || process.cwd(), configFile));
    const optionsAsObject = typeof options === 'object' ? options : {};
    const defaultCompilerOptions = {
        skipLibCheck: true,
        sourceMap: false,
        inlineSourceMap: false,
    };
    if (semver_1.default.gte(ts.version, '2.9.0')) {
        defaultCompilerOptions.declarationMap = false;
    }
    return Object.assign(Object.assign({ enabled: options !== false, memoryLimit: 2048, build: false, mode: 'write-tsbuildinfo', profile: false }, optionsAsObject), { configFile: configFile, configOverwrite: Object.assign(Object.assign({}, (optionsAsObject.configOverwrite || {})), { compilerOptions: Object.assign(Object.assign({}, defaultCompilerOptions), ((optionsAsObject.configOverwrite || {}).compilerOptions || {})) }), context: optionsAsObject.context || path_1.default.dirname(configFile), extensions: {
            vue: TypeScriptVueExtensionConfiguration_1.createTypeScriptVueExtensionConfiguration(optionsAsObject.extensions ? optionsAsObject.extensions.vue : undefined),
        }, diagnosticOptions: Object.assign({ syntactic: false, semantic: true, declaration: false, global: false }, (optionsAsObject.diagnosticOptions || {})) });
}
exports.createTypeScriptReporterConfiguration = createTypeScriptReporterConfiguration;
