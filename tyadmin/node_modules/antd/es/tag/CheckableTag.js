import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

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
import { ConfigContext } from '../config-provider';

var CheckableTag = function CheckableTag(props) {
  var _classNames;

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls;

  var handleClick = function handleClick(e) {
    var checked = props.checked,
        onChange = props.onChange,
        onClick = props.onClick;

    if (onChange) {
      onChange(!checked);
    }

    if (onClick) {
      onClick(e);
    }
  };

  var customizePrefixCls = props.prefixCls,
      className = props.className,
      checked = props.checked,
      restProps = __rest(props, ["prefixCls", "className", "checked"]);

  var prefixCls = getPrefixCls('tag', customizePrefixCls);
  var cls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-checkable"), true), _defineProperty(_classNames, "".concat(prefixCls, "-checkable-checked"), checked), _classNames), className);
  delete restProps.onChange; // TypeScript cannot check delete now.

  return /*#__PURE__*/React.createElement("span", _extends({}, restProps, {
    className: cls,
    onClick: handleClick
  }));
};

export default CheckableTag;