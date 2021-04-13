"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _zh_TW = _interopRequireDefault(require("rc-picker/lib/locale/zh_TW"));

var _zh_TW2 = _interopRequireDefault(require("../../time-picker/locale/zh_TW"));

// 统一合并为完整的 Locale
var locale = {
  lang: (0, _extends2["default"])({
    placeholder: '請選擇日期',
    rangePlaceholder: ['開始日期', '結束日期']
  }, _zh_TW["default"]),
  timePickerLocale: (0, _extends2["default"])({}, _zh_TW2["default"])
};
locale.lang.ok = '確 定'; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

var _default = locale;
exports["default"] = _default;