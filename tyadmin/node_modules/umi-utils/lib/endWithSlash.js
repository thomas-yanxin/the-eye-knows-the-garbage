"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endWithSlash;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make up the ending slash path （ /abc => /abc/ ）
 * @param path string
 */
function endWithSlash(path) {
  return path.slice(-1) !== '/' ? `${path}/` : path;
}