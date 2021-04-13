"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.QUARTER_COL_COUNT = void 0;

var React = _interopRequireWildcard(require("react"));

var _dateUtil = require("../../utils/dateUtil");

var _RangeContext = _interopRequireDefault(require("../../RangeContext"));

var _useCellClassName = _interopRequireDefault(require("../../hooks/useCellClassName"));

var _PanelBody = _interopRequireDefault(require("../PanelBody"));

var QUARTER_COL_COUNT = 4;
exports.QUARTER_COL_COUNT = QUARTER_COL_COUNT;
var QUARTER_ROW_COUNT = 1;

function QuarterBody(props) {
  var prefixCls = props.prefixCls,
      locale = props.locale,
      value = props.value,
      viewDate = props.viewDate,
      generateConfig = props.generateConfig;

  var _React$useContext = React.useContext(_RangeContext.default),
      rangedValue = _React$useContext.rangedValue,
      hoverRangedValue = _React$useContext.hoverRangedValue;

  var cellPrefixCls = "".concat(prefixCls, "-cell");
  var getCellClassName = (0, _useCellClassName.default)({
    cellPrefixCls: cellPrefixCls,
    value: value,
    generateConfig: generateConfig,
    rangedValue: rangedValue,
    hoverRangedValue: hoverRangedValue,
    isSameCell: function isSameCell(current, target) {
      return (0, _dateUtil.isSameQuarter)(generateConfig, current, target);
    },
    isInView: function isInView() {
      return true;
    },
    offsetCell: function offsetCell(date, offset) {
      return generateConfig.addMonth(date, offset * 3);
    }
  });
  var baseQuarter = generateConfig.setDate(generateConfig.setMonth(viewDate, 0), 1);
  return React.createElement(_PanelBody.default, Object.assign({}, props, {
    rowNum: QUARTER_ROW_COUNT,
    colNum: QUARTER_COL_COUNT,
    baseDate: baseQuarter,
    getCellText: function getCellText(date) {
      return generateConfig.locale.format(locale.locale, date, locale.quarterFormat || '[Q]Q');
    },
    getCellClassName: getCellClassName,
    getCellDate: function getCellDate(date, offset) {
      return generateConfig.addMonth(date, offset * 3);
    },
    titleCell: function titleCell(date) {
      return generateConfig.locale.format(locale.locale, date, 'YYYY-[Q]Q');
    }
  }));
}

var _default = QuarterBody;
exports.default = _default;