"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

// based on Draft.js' custom list depth styling
var ORDERED_LIST_TYPES = ['1', 'a', 'i'];
var _default = {
  unstyled: _react["default"].createElement("p", null),
  paragraph: _react["default"].createElement("p", null),
  'header-one': _react["default"].createElement("h1", null),
  'header-two': _react["default"].createElement("h2", null),
  'header-three': _react["default"].createElement("h3", null),
  'header-four': _react["default"].createElement("h4", null),
  'header-five': _react["default"].createElement("h5", null),
  'header-six': _react["default"].createElement("h6", null),
  blockquote: _react["default"].createElement("blockquote", null),
  'unordered-list-item': {
    element: _react["default"].createElement("li", null),
    nest: _react["default"].createElement("ul", null)
  },
  'ordered-list-item': {
    element: _react["default"].createElement("li", null),
    nest: function nest(depth) {
      var type = ORDERED_LIST_TYPES[depth % 3];
      return _react["default"].createElement("ol", {
        type: type
      });
    }
  },
  media: _react["default"].createElement("figure", null),
  atomic: _react["default"].createElement("figure", null)
};
exports["default"] = _default;