import './GridContent.less';
import React, { useContext } from 'react';
import classNames from 'classnames';
import RouteContext from '../RouteContext';
/**
 * This component can support contentWidth so you don't need to calculate the width
 * contentWidth=Fixed, width will is 1200
 * @param props
 */

var GridContent = function GridContent(props) {
  var value = useContext(RouteContext);
  var children = props.children,
      propsContentWidth = props.contentWidth,
      propsClassName = props.className,
      style = props.style,
      _props$prefixCls = props.prefixCls,
      prefixCls = _props$prefixCls === void 0 ? 'ant-pro' : _props$prefixCls;
  var contentWidth = propsContentWidth || value.contentWidth;
  var className = "".concat(prefixCls, "-grid-content");

  if (contentWidth === 'Fixed') {
    className = "".concat(prefixCls, "-grid-content wide");
  }

  return React.createElement("div", {
    className: classNames(className, propsClassName),
    style: style
  }, React.createElement("div", {
    className: "".concat(prefixCls, "-grid-content-children")
  }, children));
};

export default GridContent;