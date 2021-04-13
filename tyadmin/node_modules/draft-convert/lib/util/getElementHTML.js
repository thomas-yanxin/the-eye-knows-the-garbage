"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getElementHTML;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _invariant = _interopRequireDefault(require("invariant"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _splitReactElement = _interopRequireDefault(require("./splitReactElement"));

function hasChildren(element) {
  return _react["default"].isValidElement(element) && _react["default"].Children.count(element.props.children) > 0;
}

function getElementHTML(element) {
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (element === undefined || element === null) {
    return element;
  }

  if (typeof element === 'string') {
    return element;
  }

  if (_react["default"].isValidElement(element)) {
    if (hasChildren(element)) {
      return _server["default"].renderToStaticMarkup(element);
    }

    var tags = (0, _splitReactElement["default"])(element);

    if (text !== null && (0, _typeof2["default"])(tags) === 'object') {
      var start = tags.start,
          end = tags.end;
      return start + text + end;
    }

    return tags;
  }

  (0, _invariant["default"])(Object.prototype.hasOwnProperty.call(element, 'start') && Object.prototype.hasOwnProperty.call(element, 'end'), 'convertToHTML: received conversion data without either an HTML string, ReactElement or an object with start/end tags');

  if (text !== null) {
    var _start = element.start,
        _end = element.end;
    return _start + text + _end;
  }

  return element;
}