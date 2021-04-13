import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _createSuper from "@babel/runtime/helpers/createSuper";

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
import { ConfigConsumer } from '../config-provider';
export var LayoutContext = /*#__PURE__*/React.createContext({
  siderHook: {
    addSider: function addSider() {
      return null;
    },
    removeSider: function removeSider() {
      return null;
    }
  }
});

function generator(_ref) {
  var suffixCls = _ref.suffixCls,
      tagName = _ref.tagName,
      displayName = _ref.displayName;
  return function (BasicComponent) {
    var _a;

    return _a = /*#__PURE__*/function (_React$Component) {
      _inherits(Adapter, _React$Component);

      var _super = _createSuper(Adapter);

      function Adapter() {
        var _this;

        _classCallCheck(this, Adapter);

        _this = _super.apply(this, arguments);

        _this.renderComponent = function (_ref2) {
          var getPrefixCls = _ref2.getPrefixCls;
          var customizePrefixCls = _this.props.prefixCls;
          var prefixCls = getPrefixCls(suffixCls, customizePrefixCls);
          return /*#__PURE__*/React.createElement(BasicComponent, _extends({
            prefixCls: prefixCls,
            tagName: tagName
          }, _this.props));
        };

        return _this;
      }

      _createClass(Adapter, [{
        key: "render",
        value: function render() {
          return /*#__PURE__*/React.createElement(ConfigConsumer, null, this.renderComponent);
        }
      }]);

      return Adapter;
    }(React.Component), _a.displayName = displayName, _a;
  };
}

var Basic = function Basic(props) {
  var prefixCls = props.prefixCls,
      className = props.className,
      children = props.children,
      tagName = props.tagName,
      others = __rest(props, ["prefixCls", "className", "children", "tagName"]);

  var classString = classNames(prefixCls, className);
  return /*#__PURE__*/React.createElement(tagName, _extends({
    className: classString
  }, others), children);
};

var BasicLayout = /*#__PURE__*/function (_React$Component2) {
  _inherits(BasicLayout, _React$Component2);

  var _super2 = _createSuper(BasicLayout);

  function BasicLayout() {
    var _this2;

    _classCallCheck(this, BasicLayout);

    _this2 = _super2.apply(this, arguments);
    _this2.state = {
      siders: []
    };

    _this2.renderComponent = function (_ref3) {
      var _classNames;

      var direction = _ref3.direction;

      var _a = _this2.props,
          prefixCls = _a.prefixCls,
          className = _a.className,
          children = _a.children,
          hasSider = _a.hasSider,
          Tag = _a.tagName,
          others = __rest(_a, ["prefixCls", "className", "children", "hasSider", "tagName"]);

      var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-has-sider"), typeof hasSider === 'boolean' ? hasSider : _this2.state.siders.length > 0), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames), className);
      return /*#__PURE__*/React.createElement(LayoutContext.Provider, {
        value: {
          siderHook: _this2.getSiderHook()
        }
      }, /*#__PURE__*/React.createElement(Tag, _extends({
        className: classString
      }, others), children));
    };

    return _this2;
  }

  _createClass(BasicLayout, [{
    key: "getSiderHook",
    value: function getSiderHook() {
      var _this3 = this;

      return {
        addSider: function addSider(id) {
          _this3.setState(function (state) {
            return {
              siders: [].concat(_toConsumableArray(state.siders), [id])
            };
          });
        },
        removeSider: function removeSider(id) {
          _this3.setState(function (state) {
            return {
              siders: state.siders.filter(function (currentId) {
                return currentId !== id;
              })
            };
          });
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(ConfigConsumer, null, this.renderComponent);
    }
  }]);

  return BasicLayout;
}(React.Component);

var Layout = generator({
  suffixCls: 'layout',
  tagName: 'section',
  displayName: 'Layout'
})(BasicLayout);
var Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header',
  displayName: 'Header'
})(Basic);
var Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer',
  displayName: 'Footer'
})(Basic);
var Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main',
  displayName: 'Content'
})(Basic);
Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;
export default Layout;