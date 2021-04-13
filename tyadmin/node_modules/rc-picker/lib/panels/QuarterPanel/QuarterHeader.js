"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _Header = _interopRequireDefault(require("../Header"));

var _PanelContext = _interopRequireDefault(require("../../PanelContext"));

function QuarterHeader(props) {
  var prefixCls = props.prefixCls,
      generateConfig = props.generateConfig,
      locale = props.locale,
      viewDate = props.viewDate,
      onNextYear = props.onNextYear,
      onPrevYear = props.onPrevYear,
      onYearClick = props.onYearClick;

  var _React$useContext = React.useContext(_PanelContext.default),
      hideHeader = _React$useContext.hideHeader;

  if (hideHeader) {
    return null;
  }

  var headerPrefixCls = "".concat(prefixCls, "-header");
  return React.createElement(_Header.default, Object.assign({}, props, {
    prefixCls: headerPrefixCls,
    onSuperPrev: onPrevYear,
    onSuperNext: onNextYear
  }), React.createElement("button", {
    type: "button",
    onClick: onYearClick,
    className: "".concat(prefixCls, "-year-btn")
  }, generateConfig.locale.format(locale.locale, viewDate, locale.yearFormat)));
}

var _default = QuarterHeader;
exports.default = _default;