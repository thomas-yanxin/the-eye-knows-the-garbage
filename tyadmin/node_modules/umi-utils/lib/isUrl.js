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

function _isUrl() {
  const data = _interopRequireDefault(require("is-url"));

  _isUrl = function _isUrl() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check whether a string is a URL.
 * @param path
 */
function _default(path) {
  return (0, _isUrl().default)(path);
}