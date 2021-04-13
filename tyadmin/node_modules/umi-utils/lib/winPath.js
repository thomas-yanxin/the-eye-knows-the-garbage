"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("slash2"));

  _slash = function _slash() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert Windows backslash paths to slash paths
 * @param path
 */
function _default(path) {
  return (0, _slash().default)(path);
}