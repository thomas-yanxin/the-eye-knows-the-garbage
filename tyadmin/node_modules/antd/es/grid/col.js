import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _typeof from "@babel/runtime/helpers/typeof";

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
import RowContext from './RowContext';
import { ConfigConsumer } from '../config-provider';

function parseFlex(flex) {
  if (typeof flex === 'number') {
    return "".concat(flex, " ").concat(flex, " auto");
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return "0 0 ".concat(flex);
  }

  return flex;
}

var Col = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var renderCol = function renderCol(_ref) {
    var _classNames;

    var getPrefixCls = _ref.getPrefixCls,
        direction = _ref.direction;

    var customizePrefixCls = props.prefixCls,
        span = props.span,
        order = props.order,
        offset = props.offset,
        push = props.push,
        pull = props.pull,
        className = props.className,
        children = props.children,
        flex = props.flex,
        style = props.style,
        others = __rest(props, ["prefixCls", "span", "order", "offset", "push", "pull", "className", "children", "flex", "style"]);

    var prefixCls = getPrefixCls('col', customizePrefixCls);
    var sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(function (size) {
      var _extends2;

      var sizeProps = {};
      var propSize = props[size];

      if (typeof propSize === 'number') {
        sizeProps.span = propSize;
      } else if (_typeof(propSize) === 'object') {
        sizeProps = propSize || {};
      }

      delete others[size];
      sizeClassObj = _extends(_extends({}, sizeClassObj), (_extends2 = {}, _defineProperty(_extends2, "".concat(prefixCls, "-").concat(size, "-").concat(sizeProps.span), sizeProps.span !== undefined), _defineProperty(_extends2, "".concat(prefixCls, "-").concat(size, "-order-").concat(sizeProps.order), sizeProps.order || sizeProps.order === 0), _defineProperty(_extends2, "".concat(prefixCls, "-").concat(size, "-offset-").concat(sizeProps.offset), sizeProps.offset || sizeProps.offset === 0), _defineProperty(_extends2, "".concat(prefixCls, "-").concat(size, "-push-").concat(sizeProps.push), sizeProps.push || sizeProps.push === 0), _defineProperty(_extends2, "".concat(prefixCls, "-").concat(size, "-pull-").concat(sizeProps.pull), sizeProps.pull || sizeProps.pull === 0), _defineProperty(_extends2, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _extends2));
    });
    var classes = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(span), span !== undefined), _defineProperty(_classNames, "".concat(prefixCls, "-order-").concat(order), order), _defineProperty(_classNames, "".concat(prefixCls, "-offset-").concat(offset), offset), _defineProperty(_classNames, "".concat(prefixCls, "-push-").concat(push), push), _defineProperty(_classNames, "".concat(prefixCls, "-pull-").concat(pull), pull), _classNames), className, sizeClassObj);
    return /*#__PURE__*/React.createElement(RowContext.Consumer, null, function (_ref2) {
      var gutter = _ref2.gutter;

      var mergedStyle = _extends({}, style);

      if (gutter) {
        mergedStyle = _extends(_extends(_extends({}, gutter[0] > 0 ? {
          paddingLeft: gutter[0] / 2,
          paddingRight: gutter[0] / 2
        } : {}), gutter[1] > 0 ? {
          paddingTop: gutter[1] / 2,
          paddingBottom: gutter[1] / 2
        } : {}), mergedStyle);
      }

      if (flex) {
        mergedStyle.flex = parseFlex(flex);
      }

      return /*#__PURE__*/React.createElement("div", _extends({}, others, {
        style: mergedStyle,
        className: classes,
        ref: ref
      }), children);
    });
  };

  return /*#__PURE__*/React.createElement(ConfigConsumer, null, renderCol);
});
Col.displayName = 'Col';
export default Col;