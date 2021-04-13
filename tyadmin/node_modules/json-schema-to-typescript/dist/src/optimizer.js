"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_color_1 = require("cli-color");
var stringify = require("json-stringify-safe");
var lodash_1 = require("lodash");
var AST_1 = require("./types/AST");
var utils_1 = require("./utils");
function optimize(ast, processed) {
    if (processed === void 0) { processed = new Map(); }
    utils_1.log(cli_color_1.whiteBright.bgCyan('optimizer'), ast, processed.has(ast) ? '(FROM CACHE)' : '');
    if (processed.has(ast)) {
        return processed.get(ast);
    }
    processed.set(ast, ast);
    switch (ast.type) {
        case 'INTERFACE':
            return Object.assign(ast, {
                params: ast.params.map(function (_) { return Object.assign(_, { ast: optimize(_.ast, processed) }); })
            });
        case 'INTERSECTION':
        case 'UNION':
            // [A, B, C, Any] -> Any
            if (ast.params.some(function (_) { return _.type === 'ANY'; })) {
                utils_1.log(cli_color_1.whiteBright.bgCyan('optimizer'), ast, '<- T_ANY');
                return AST_1.T_ANY;
            }
            // [A, B, B] -> [A, B]
            ast.params = lodash_1.uniqBy(ast.params, function (_) { return _.type + "------" + stringify(_.params); });
            return Object.assign(ast, {
                params: ast.params.map(function (_) { return optimize(_, processed); })
            });
        default:
            return ast;
    }
}
exports.optimize = optimize;
//# sourceMappingURL=optimizer.js.map