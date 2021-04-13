"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chunkName;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

var _winPath = _interopRequireDefault(require("./winPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stripFirstSlash(path) {
  if (path.charAt(0) === '/') {
    return path.slice(1);
  } else {
    return path;
  }
}
/**
 * Get Relative Path
 * @param cwd
 * @param path
 */


function chunkName(cwd, path) {
  return stripFirstSlash((0, _winPath.default)(path).replace((0, _winPath.default)(cwd), '')).replace(/\//g, '__').replace(/^src__/, '').replace(/^pages__/, 'p__').replace(/^page__/, 'p__');
}