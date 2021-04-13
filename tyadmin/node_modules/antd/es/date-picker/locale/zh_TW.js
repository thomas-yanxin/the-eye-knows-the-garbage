import _extends from "@babel/runtime/helpers/extends";
import CalendarLocale from "rc-picker/es/locale/zh_TW";
import TimePickerLocale from '../../time-picker/locale/zh_TW'; // 统一合并为完整的 Locale

var locale = {
  lang: _extends({
    placeholder: '請選擇日期',
    rangePlaceholder: ['開始日期', '結束日期']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};
locale.lang.ok = '確 定'; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;