"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginSyntaxDoExpressions = _interopRequireDefault(require("@babel/plugin-syntax-do-expressions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: "proposal-do-expressions",
    inherits: _pluginSyntaxDoExpressions.default,
    visitor: {
      DoExpression: {
        exit(path) {
          const body = path.node.body.body;

          if (body.length) {
            path.replaceExpressionWithStatements(body);
          } else {
            path.replaceWith(path.scope.buildUndefinedNode());
          }
        }

      }
    }
  };
});

exports.default = _default;