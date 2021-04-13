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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const JS_EXTNAMES = ['.js', '.jsx', '.ts', '.tsx'];
/**
 * Find the real JS file. Automatic completion of suffixes
 * @param baseDir base path
 * @param fileNameWithoutExtname file name
 */

function _default(baseDir, fileNameWithoutExtname) {
  let i = 0;

  while (i < JS_EXTNAMES.length) {
    const extname = JS_EXTNAMES[i];
    const absFilePath = fileNameWithoutExtname ? (0, _path().join)(baseDir, `${fileNameWithoutExtname}${extname}`) : `${baseDir}${extname}`;

    if ((0, _fs().existsSync)(absFilePath)) {
      return absFilePath;
    }

    i += 1;
  }

  return null;
}