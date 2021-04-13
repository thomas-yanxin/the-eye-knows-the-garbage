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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CSS_EXTNAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

function _default() {
  return {
    visitor: {
      ImportDeclaration(path, {
        opts
      }) {
        const _path$node = path.node,
              specifiers = _path$node.specifiers,
              source = _path$node.source,
              value = _path$node.source.value;

        if (specifiers.length && CSS_EXTNAMES.includes((0, _path().extname)(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`;
        }
      }

    }
  };
}