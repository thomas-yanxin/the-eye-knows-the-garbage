import "antd/es/drawer/style";
import _Drawer from "antd/es/drawer";
import React, { useEffect } from 'react';
import classNames from 'classnames';
import Omit from 'omit.js';
import { getFlatMenus } from '@umijs/route-utils';
import { useDeepCompareEffect } from '../utils/utils';
import SiderMenu from './SiderMenu';
import MenuCounter from './Counter';

var SiderMenuWrapper = function SiderMenuWrapper(props) {
  var isMobile = props.isMobile,
      menuData = props.menuData,
      siderWidth = props.siderWidth,
      collapsed = props.collapsed,
      onCollapse = props.onCollapse,
      style = props.style,
      className = props.className,
      hide = props.hide,
      prefixCls = props.prefixCls;

  var _MenuCounter$useConta = MenuCounter.useContainer(),
      setFlatMenuKeys = _MenuCounter$useConta.setFlatMenuKeys;

  useDeepCompareEffect(function () {
    if (!menuData || menuData.length < 1) {
      return function () {
        return null;
      };
    } // // 当 menu data 改变的时候重新计算这两个参数


    var newFlatMenus = getFlatMenus(menuData);
    var animationFrameId = requestAnimationFrame(function () {
      setFlatMenuKeys(Object.keys(newFlatMenus));
    });
    return function () {
      return window.cancelAnimationFrame && window.cancelAnimationFrame(animationFrameId);
    };
  }, [menuData]);
  useEffect(function () {
    if (isMobile === true) {
      if (onCollapse) {
        onCollapse(true);
      }
    }
  }, [isMobile]);
  var omitProps = Omit(props, ['className', 'style']);

  if (hide) {
    return null;
  }

  return isMobile ? React.createElement(_Drawer, {
    visible: !collapsed,
    placement: "left",
    className: classNames("".concat(prefixCls, "-drawer-sider"), className),
    onClose: function onClose() {
      return onCollapse && onCollapse(true);
    },
    style: Object.assign({
      padding: 0,
      height: '100vh'
    }, style),
    width: siderWidth,
    bodyStyle: {
      height: '100vh',
      padding: 0
    }
  }, React.createElement(SiderMenu, Object.assign({}, omitProps, {
    className: classNames("".concat(prefixCls, "-sider"), className),
    collapsed: isMobile ? false : collapsed
  }))) : React.createElement(SiderMenu, Object.assign({
    className: classNames("".concat(prefixCls, "-sider"), className)
  }, omitProps, {
    style: style
  }));
};

SiderMenuWrapper.defaultProps = {
  onCollapse: function onCollapse() {
    return undefined;
  }
};
export default SiderMenuWrapper;