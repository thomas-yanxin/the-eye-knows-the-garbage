"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/badge/style");

var _badge = _interopRequireDefault(require("antd/lib/badge"));

var _react = _interopRequireDefault(require("react"));

require("./index.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 快捷操作，用于快速的展示一个状态
 */
var Status = {
  Success: function Success(_ref) {
    var children = _ref.children;
    return _react.default.createElement(_badge.default, {
      status: "success",
      text: children
    });
  },
  Error: function Error(_ref2) {
    var children = _ref2.children;
    return _react.default.createElement(_badge.default, {
      status: "error",
      text: children
    });
  },
  Default: function Default(_ref3) {
    var children = _ref3.children;
    return _react.default.createElement(_badge.default, {
      status: "default",
      text: children
    });
  },
  Processing: function Processing(_ref4) {
    var children = _ref4.children;
    return _react.default.createElement(_badge.default, {
      status: "processing",
      text: children
    });
  },
  Warning: function Warning(_ref5) {
    var children = _ref5.children;
    return _react.default.createElement(_badge.default, {
      status: "warning",
      text: children
    });
  }
};
var _default = Status;
exports.default = _default;