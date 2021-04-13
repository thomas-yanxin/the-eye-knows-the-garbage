"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _react = _interopRequireDefault(require("react"));

var _splitReactElement = _interopRequireDefault(require("./splitReactElement"));

var getElementTagLength = function getElementTagLength(element) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'start';

  if (_react["default"].isValidElement(element)) {
    var splitElement = (0, _splitReactElement["default"])(element);

    if (typeof splitElement === 'string') {
      return 0;
    }

    var length = splitElement[type].length;

    var child = _react["default"].Children.toArray(element.props.children)[0];

    return length + (child && _react["default"].isValidElement(child) ? getElementTagLength(child, type) : 0);
  }

  if ((0, _typeof2["default"])(element) === 'object') {
    return element[type] ? element[type].length : 0;
  }

  return 0;
};

var _default = getElementTagLength;
exports["default"] = _default;