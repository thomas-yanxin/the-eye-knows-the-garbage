"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = splitReactElement;

var _invariant = _interopRequireDefault(require("invariant"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

// see http://w3c.github.io/html/syntax.html#writing-html-documents-elements
var VOID_TAGS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

function splitReactElement(element) {
  if (VOID_TAGS.indexOf(element.type) !== -1) {
    return _server["default"].renderToStaticMarkup(element);
  }

  var tags = _server["default"].renderToStaticMarkup(_react["default"].cloneElement(element, {}, '\r')).split('\r');

  (0, _invariant["default"])(tags.length > 1, "convertToHTML: Element of type ".concat(element.type, " must render children"));
  (0, _invariant["default"])(tags.length < 3, "convertToHTML: Element of type ".concat(element.type, " cannot use carriage return character"));
  return {
    start: tags[0],
    end: tags[1]
  };
}