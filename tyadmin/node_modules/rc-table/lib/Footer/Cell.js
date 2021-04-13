"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SummaryCell;

var React = _interopRequireWildcard(require("react"));

var _Cell = _interopRequireDefault(require("../Cell"));

var _TableContext = _interopRequireDefault(require("../context/TableContext"));

function SummaryCell(_ref) {
  var className = _ref.className,
      index = _ref.index,
      children = _ref.children,
      colSpan = _ref.colSpan,
      rowSpan = _ref.rowSpan;

  var _React$useContext = React.useContext(_TableContext.default),
      prefixCls = _React$useContext.prefixCls,
      fixedInfoList = _React$useContext.fixedInfoList;

  var fixedInfo = fixedInfoList[index];
  return React.createElement(_Cell.default, Object.assign({
    className: className,
    index: index,
    component: "td",
    prefixCls: prefixCls,
    record: null,
    dataIndex: null,
    render: function render() {
      return {
        children: children,
        props: {
          colSpan: colSpan,
          rowSpan: rowSpan
        }
      };
    }
  }, fixedInfo));
}