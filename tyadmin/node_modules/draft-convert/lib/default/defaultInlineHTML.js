"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = defaultInlineHTML;

var _react = _interopRequireDefault(require("react"));

function defaultInlineHTML(style) {
  switch (style) {
    case 'BOLD':
      return _react["default"].createElement("strong", null);

    case 'ITALIC':
      return _react["default"].createElement("em", null);

    case 'UNDERLINE':
      return _react["default"].createElement("u", null);

    case 'CODE':
      return _react["default"].createElement("code", null);

    default:
      return {
        start: '',
        end: ''
      };
  }
}