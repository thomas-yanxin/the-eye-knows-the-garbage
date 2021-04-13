"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTSFile = exports.isDynamicRoute = exports.getGlobalFile = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * get global file like (global.js, global.css)
 * @param absSrcPath
 * @param files default load global files
 */
const getGlobalFile = ({
  absSrcPath,
  files
}) => {
  return files.map(file => (0, _path().join)(absSrcPath || '', file)).filter(file => (0, _fs().existsSync)(file)).slice(0, 1);
};

exports.getGlobalFile = getGlobalFile;

const isDynamicRoute = path => {
  var _path$split, _path$split$some;

  return !!(path === null || path === void 0 ? void 0 : (_path$split = path.split('/')) === null || _path$split === void 0 ? void 0 : (_path$split$some = _path$split.some) === null || _path$split$some === void 0 ? void 0 : _path$split$some.call(_path$split, snippet => snippet.startsWith(':')));
};
/**
 * judge whether ts or tsx file exclude d.ts
 * @param path
 */


exports.isDynamicRoute = isDynamicRoute;

const isTSFile = path => {
  return typeof path === 'string' && !/\.d\.ts$/.test(path) && /\.(ts|tsx)$/.test(path);
};

exports.isTSFile = isTSFile;