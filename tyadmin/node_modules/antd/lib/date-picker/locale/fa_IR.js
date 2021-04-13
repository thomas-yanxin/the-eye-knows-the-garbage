"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _fa_IR = _interopRequireDefault(require("rc-picker/lib/locale/fa_IR"));

var _fa_IR2 = _interopRequireDefault(require("../../time-picker/locale/fa_IR"));

// Merge into a locale object
var locale = {
  lang: (0, _extends2["default"])({
    placeholder: 'انتخاب تاریخ',
    rangePlaceholder: ['تاریخ شروع', 'تاریخ پایان']
  }, _fa_IR["default"]),
  timePickerLocale: (0, _extends2["default"])({}, _fa_IR2["default"])
}; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

var _default = locale;
exports["default"] = _default;