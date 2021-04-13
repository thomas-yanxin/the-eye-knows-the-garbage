"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _th_TH = _interopRequireDefault(require("rc-picker/lib/locale/th_TH"));

var _th_TH2 = _interopRequireDefault(require("../../time-picker/locale/th_TH"));

// Merge into a locale object
var locale = {
  lang: (0, _extends2["default"])({
    placeholder: 'เลือกวันที่',
    rangePlaceholder: ['วันเริ่มต้น', 'วันสิ้นสุด']
  }, _th_TH["default"]),
  timePickerLocale: (0, _extends2["default"])({}, _th_TH2["default"])
}; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

var _default = locale;
exports["default"] = _default;