function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import './index.less';
import React, { Component } from 'react';
import classNames from 'classnames';
import { defaultRenderLogo, defaultRenderLogoAndTitle, defaultRenderCollapsedButton } from '../SiderMenu/SiderMenu';
import { isBrowser } from '../utils/utils';
import TopNavHeader from '../TopNavHeader';

var renderLogo = function renderLogo(menuHeaderRender, logoDom) {
  if (menuHeaderRender === false) {
    return null;
  }

  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }

  return logoDom;
};

var GlobalHeader = /*#__PURE__*/function (_Component) {
  _inherits(GlobalHeader, _Component);

  var _super = _createSuper(GlobalHeader);

  function GlobalHeader() {
    var _this;

    _classCallCheck(this, GlobalHeader);

    _this = _super.apply(this, arguments);

    _this.triggerResizeEvent = function () {
      if (isBrowser()) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }
    };

    _this.toggle = function () {
      var _this$props = _this.props,
          collapsed = _this$props.collapsed,
          onCollapse = _this$props.onCollapse;
      if (onCollapse) onCollapse(!collapsed);

      _this.triggerResizeEvent();
    };

    return _this;
  }

  _createClass(GlobalHeader, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          isMobile = _this$props2.isMobile,
          logo = _this$props2.logo,
          collapsed = _this$props2.collapsed,
          onCollapse = _this$props2.onCollapse,
          _this$props2$collapse = _this$props2.collapsedButtonRender,
          collapsedButtonRender = _this$props2$collapse === void 0 ? defaultRenderCollapsedButton : _this$props2$collapse,
          rightContentRender = _this$props2.rightContentRender,
          menuHeaderRender = _this$props2.menuHeaderRender,
          propClassName = _this$props2.className,
          style = _this$props2.style,
          layout = _this$props2.layout,
          children = _this$props2.children,
          splitMenus = _this$props2.splitMenus,
          menuData = _this$props2.menuData,
          prefixCls = _this$props2.prefixCls;
      var baseClassName = "".concat(prefixCls, "-global-header");
      var className = classNames(propClassName, baseClassName, _defineProperty({}, "".concat(baseClassName, "-layout-").concat(layout), layout));

      if (layout === 'mix' && !isMobile && splitMenus) {
        var noChildrenMenuData = (menuData || []).map(function (item) {
          return Object.assign(Object.assign({}, item), {
            children: undefined
          });
        });
        return React.createElement(TopNavHeader, Object.assign({
          mode: "horizontal"
        }, this.props, {
          splitMenus: false,
          menuData: noChildrenMenuData,
          navTheme: "dark",
          theme: "dark"
        }));
      }

      var logoDom = React.createElement("span", {
        className: "".concat(baseClassName, "-logo"),
        key: "logo"
      }, React.createElement("a", null, defaultRenderLogo(logo)));
      return React.createElement("div", {
        className: className,
        style: style
      }, isMobile && renderLogo(menuHeaderRender, logoDom), isMobile && collapsedButtonRender && React.createElement("span", {
        className: "".concat(baseClassName, "-collapsed-button"),
        onClick: function onClick() {
          if (onCollapse) {
            onCollapse(!collapsed);
          }
        }
      }, collapsedButtonRender(collapsed)), layout === 'mix' && !isMobile && React.createElement(React.Fragment, null, React.createElement("div", {
        className: "".concat(baseClassName, "-logo")
      }, defaultRenderLogoAndTitle(Object.assign(Object.assign({}, this.props), {
        collapsed: false
      }), 'headerTitleRender'))), React.createElement("div", {
        style: {
          flex: 1
        }
      }, children), rightContentRender && rightContentRender(this.props));
    }
  }]);

  return GlobalHeader;
}(Component);

export { GlobalHeader as default };