"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _omit = _interopRequireDefault(require("omit.js"));

var _configProvider = require("../config-provider");

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var TimelineItem = function TimelineItem(props) {
  var _classNames, _classNames2;

  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls;

  var customizePrefixCls = props.prefixCls,
      className = props.className,
      color = props.color,
      children = props.children,
      pending = props.pending,
      dot = props.dot,
      label = props.label,
      restProps = __rest(props, ["prefixCls", "className", "color", "children", "pending", "dot", "label"]);

  var prefixCls = getPrefixCls('timeline', customizePrefixCls);
  var itemClassName = (0, _classnames["default"])((_classNames = {}, (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-item"), true), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-item-pending"), pending), _classNames), className);
  var dotClassName = (0, _classnames["default"])((_classNames2 = {}, (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-item-head"), true), (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-item-head-custom"), dot), (0, _defineProperty2["default"])(_classNames2, "".concat(prefixCls, "-item-head-").concat(color), true), _classNames2));
  return /*#__PURE__*/React.createElement("li", (0, _extends2["default"])({}, (0, _omit["default"])(restProps, ['position']), {
    className: itemClassName
  }), label && /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-item-label")
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-item-tail")
  }), /*#__PURE__*/React.createElement("div", {
    className: dotClassName,
    style: {
      borderColor: /blue|red|green|gray/.test(color || '') ? undefined : color
    }
  }, dot), /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-item-content")
  }, children));
};

TimelineItem.defaultProps = {
  color: 'blue',
  pending: false,
  position: ''
};
var _default = TimelineItem;
exports["default"] = _default;