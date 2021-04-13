"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getBlockTags;

var _invariant = _interopRequireDefault(require("invariant"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _splitReactElement = _interopRequireDefault(require("./splitReactElement"));

function hasChildren(element) {
  return _react["default"].isValidElement(element) && _react["default"].Children.count(element.props.children) > 0;
}

function getBlockTags(blockHTML) {
  (0, _invariant["default"])(blockHTML !== null && blockHTML !== undefined, 'Expected block HTML value to be non-null');

  if (typeof blockHTML === 'string') {
    return blockHTML;
  }

  if (_react["default"].isValidElement(blockHTML)) {
    if (hasChildren(blockHTML)) {
      return _server["default"].renderToStaticMarkup(blockHTML);
    }

    return (0, _splitReactElement["default"])(blockHTML);
  }

  if (Object.prototype.hasOwnProperty.call(blockHTML, 'element') && _react["default"].isValidElement(blockHTML.element)) {
    return Object.assign({}, blockHTML, (0, _splitReactElement["default"])(blockHTML.element));
  }

  (0, _invariant["default"])(Object.prototype.hasOwnProperty.call(blockHTML, 'start') && Object.prototype.hasOwnProperty.call(blockHTML, 'end'), 'convertToHTML: received block information without either a ReactElement or an object with start/end tags');
  return blockHTML;
}