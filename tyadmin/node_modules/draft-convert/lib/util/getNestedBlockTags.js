"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getNestedBlockTags;

var _invariant = _interopRequireDefault(require("invariant"));

var _react = _interopRequireDefault(require("react"));

var _splitReactElement3 = _interopRequireDefault(require("./splitReactElement"));

function getNestedBlockTags(blockHTML, depth) {
  (0, _invariant["default"])(blockHTML !== null && blockHTML !== undefined, 'Expected block HTML value to be non-null');

  if (typeof blockHTML.nest === 'function') {
    var _splitReactElement = (0, _splitReactElement3["default"])(blockHTML.nest(depth)),
        start = _splitReactElement.start,
        end = _splitReactElement.end;

    return Object.assign({}, blockHTML, {
      nestStart: start,
      nestEnd: end
    });
  }

  if (_react["default"].isValidElement(blockHTML.nest)) {
    var _splitReactElement2 = (0, _splitReactElement3["default"])(blockHTML.nest),
        _start = _splitReactElement2.start,
        _end = _splitReactElement2.end;

    return Object.assign({}, blockHTML, {
      nestStart: _start,
      nestEnd: _end
    });
  }

  (0, _invariant["default"])(Object.prototype.hasOwnProperty.call(blockHTML, 'nestStart') && Object.prototype.hasOwnProperty.call(blockHTML, 'nestEnd'), 'convertToHTML: received block information without either a ReactElement or an object with start/end tags');
  return blockHTML;
}