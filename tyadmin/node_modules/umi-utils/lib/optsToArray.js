"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optsToArray;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert string to arrays，make sure you return to an array
 * @param item
 * @return Array<any>
 */
function optsToArray(item) {
  if (item === null || item === undefined) return [];

  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}