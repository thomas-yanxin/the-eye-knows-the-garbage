"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _en_GB = _interopRequireDefault(require("rc-picker/lib/locale/en_GB"));

var _en_GB2 = _interopRequireDefault(require("../../time-picker/locale/en_GB"));

// Merge into a locale object
var locale = {
  lang: (0, _extends2["default"])({
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date']
  }, _en_GB["default"]),
  timePickerLocale: (0, _extends2["default"])({}, _en_GB2["default"])
}; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

var _default = locale;
exports["default"] = _default;