"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/spin/style");

var _spin = _interopRequireDefault(require("antd/lib/spin"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageLoading = function PageLoading(_ref) {
  var tip = _ref.tip;
  return _react.default.createElement("div", {
    style: {
      paddingTop: 100,
      textAlign: 'center'
    }
  }, _react.default.createElement(_spin.default, {
    size: "large",
    tip: tip
  }));
};

var _default = PageLoading;
exports.default = _default;