"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getExtraFooter;

var React = _interopRequireWildcard(require("react"));

function getExtraFooter(prefixCls, mode, renderExtraFooter) {
  if (!renderExtraFooter) {
    return null;
  }

  return React.createElement("div", {
    className: "".concat(prefixCls, "-footer-extra")
  }, renderExtraFooter(mode));
}