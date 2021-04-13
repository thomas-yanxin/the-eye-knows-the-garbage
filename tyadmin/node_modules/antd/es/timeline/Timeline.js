import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import * as React from 'react';
import classNames from 'classnames';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import TimelineItem from './TimelineItem';
import { ConfigContext } from '../config-provider';
import { cloneElement } from '../_util/reactNode';

var Timeline = function Timeline(props) {
  var _classNames;

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  var customizePrefixCls = props.prefixCls,
      _props$pending = props.pending,
      pending = _props$pending === void 0 ? null : _props$pending,
      pendingDot = props.pendingDot,
      children = props.children,
      className = props.className,
      reverse = props.reverse,
      mode = props.mode,
      restProps = __rest(props, ["prefixCls", "pending", "pendingDot", "children", "className", "reverse", "mode"]);

  var prefixCls = getPrefixCls('timeline', customizePrefixCls);
  var pendingNode = typeof pending === 'boolean' ? null : pending;
  var pendingItem = pending ? /*#__PURE__*/React.createElement(TimelineItem, {
    pending: !!pending,
    dot: pendingDot || /*#__PURE__*/React.createElement(LoadingOutlined, null)
  }, pendingNode) : null;
  var timeLineItems = reverse ? [pendingItem].concat(_toConsumableArray(React.Children.toArray(children).reverse())) : [].concat(_toConsumableArray(React.Children.toArray(children)), [pendingItem]);

  var getPositionCls = function getPositionCls(ele, idx) {
    if (mode === 'alternate') {
      if (ele.props.position === 'right') return "".concat(prefixCls, "-item-right");
      if (ele.props.position === 'left') return "".concat(prefixCls, "-item-left");
      return idx % 2 === 0 ? "".concat(prefixCls, "-item-left") : "".concat(prefixCls, "-item-right");
    }

    if (mode === 'left') return "".concat(prefixCls, "-item-left");
    if (mode === 'right') return "".concat(prefixCls, "-item-right");
    if (ele.props.position === 'right') return "".concat(prefixCls, "-item-right");
    return '';
  }; // Remove falsy items


  var truthyItems = timeLineItems.filter(function (item) {
    return !!item;
  });
  var itemsCount = React.Children.count(truthyItems);
  var lastCls = "".concat(prefixCls, "-item-last");
  var items = React.Children.map(truthyItems, function (ele, idx) {
    var pendingClass = idx === itemsCount - 2 ? lastCls : '';
    var readyClass = idx === itemsCount - 1 ? lastCls : '';
    return cloneElement(ele, {
      className: classNames([ele.props.className, !reverse && !!pending ? pendingClass : readyClass, getPositionCls(ele, idx)])
    });
  });
  var hasLabelItem = timeLineItems.some(function (item) {
    var _a;

    return !!((_a = item === null || item === void 0 ? void 0 : item.props) === null || _a === void 0 ? void 0 : _a.label);
  });
  var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-pending"), !!pending), _defineProperty(_classNames, "".concat(prefixCls, "-reverse"), !!reverse), _defineProperty(_classNames, "".concat(prefixCls, "-").concat(mode), !!mode && !hasLabelItem), _defineProperty(_classNames, "".concat(prefixCls, "-label"), hasLabelItem), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames), className);
  return /*#__PURE__*/React.createElement("ul", _extends({}, restProps, {
    className: classString
  }), items);
};

Timeline.Item = TimelineItem;
Timeline.defaultProps = {
  reverse: false,
  mode: ''
};
export default Timeline;