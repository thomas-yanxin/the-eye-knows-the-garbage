"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var Divider = function Divider(_ref) {
  var className = _ref.className,
      rootPrefixCls = _ref.rootPrefixCls,
      style = _ref.style;
  return _react.default.createElement("li", {
    className: "".concat(className, " ").concat(rootPrefixCls, "-item-divider"),
    style: style
  });
};

Divider.defaultProps = {
  // To fix keyboard UX.
  disabled: true,
  className: '',
  style: {}
};
var _default = Divider;
exports.default = _default;