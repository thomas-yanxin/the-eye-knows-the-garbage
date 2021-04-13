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

const CSS_EXTNAMES = ['.css', '.less', '.scss', '.sass'];
/**
 * Find the real CSS file. Automatic completion of suffixes
 * @param {*} baseDir
 * @param {*} fileNameWithoutExtname
 */

function _default(baseDir, fileNameWithoutExtname) {
  let i = 0;

  while (i < CSS_EXTNAMES.length) {
    const extname = CSS_EXTNAMES[i];
    const fileName = `${fileNameWithoutExtname}${extname}`;
    const absFilePath = (0, _path().join)(baseDir, fileName);

    if ((0, _fs().existsSync)(absFilePath)) {
      return absFilePath;
    }

    i += 1;
  }

  return null;
}