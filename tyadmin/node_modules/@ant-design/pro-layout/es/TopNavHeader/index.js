function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { defaultRenderLogoAndTitle } from '../SiderMenu/SiderMenu';
import './index.less';
import BaseMenu from '../SiderMenu/BaseMenu';
/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 * @param param0
 */

var RightContent = function RightContent(_a) {
  var rightContentRender = _a.rightContentRender,
      props = __rest(_a, ["rightContentRender"]);

  var _useState = useState('auto'),
      _useState2 = _slicedToArray(_useState, 2),
      rightSize = _useState2[0],
      setRightSize = _useState2[1];

  return React.createElement("div", {
    style: {
      minWidth: rightSize
    }
  }, React.createElement("div", {
    style: {
      paddingRight: 8
    }
  }, React.createElement(ResizeObserver, {
    onResize: function onResize(_ref) {
      var width = _ref.width;

      if (!width) {
        return;
      }

      setRightSize(width);
    }
  }, rightContentRender && React.createElement("div", null, rightContentRender(Object.assign({}, props))))));
};

var TopNavHeader = function TopNavHeader(props) {
  var ref = useRef(null);
  var theme = props.theme,
      onMenuHeaderClick = props.onMenuHeaderClick,
      contentWidth = props.contentWidth,
      rightContentRender = props.rightContentRender,
      propsClassName = props.className,
      style = props.style,
      layout = props.layout;
  var baseClassName = 'ant-pro-top-nav-header';
  var headerDom = defaultRenderLogoAndTitle(Object.assign(Object.assign({}, props), {
    collapsed: false
  }), layout === 'mix' ? 'headerTitleRender' : undefined);
  var className = classNames(baseClassName, propsClassName, {
    light: theme === 'light'
  });
  return React.createElement("div", {
    className: className,
    style: style
  }, React.createElement("div", {
    ref: ref,
    className: "".concat(baseClassName, "-main ").concat(contentWidth === 'Fixed' ? 'wide' : '')
  }, headerDom && React.createElement("div", {
    className: "".concat(baseClassName, "-main-left"),
    onClick: onMenuHeaderClick
  }, React.createElement("div", {
    className: "".concat(baseClassName, "-logo"),
    key: "logo",
    id: "logo"
  }, headerDom)), React.createElement("div", {
    style: {
      flex: 1
    },
    className: "".concat(baseClassName, "-menu")
  }, React.createElement(BaseMenu, Object.assign({}, props, props.menuProps))), rightContentRender && React.createElement(RightContent, Object.assign({
    rightContentRender: rightContentRender
  }, props))));
};

export default TopNavHeader;