"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _rcResizeObserver = _interopRequireDefault(require("rc-resize-observer"));

var _SiderMenu = require("../SiderMenu/SiderMenu");

require("./index.less");

var _BaseMenu = _interopRequireDefault(require("../SiderMenu/BaseMenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 * @param param0
 */
var RightContent = function RightContent(_a) {
  var rightContentRender = _a.rightContentRender,
      props = __rest(_a, ["rightContentRender"]);

  var _useState = (0, _react.useState)('auto'),
      _useState2 = _slicedToArray(_useState, 2),
      rightSize = _useState2[0],
      setRightSize = _useState2[1];

  return _react.default.createElement("div", {
    style: {
      minWidth: rightSize
    }
  }, _react.default.createElement("div", {
    style: {
      paddingRight: 8
    }
  }, _react.default.createElement(_rcResizeObserver.default, {
    onResize: function onResize(_ref) {
      var width = _ref.width;

      if (!width) {
        return;
      }

      setRightSize(width);
    }
  }, rightContentRender && _react.default.createElement("div", null, rightContentRender(Object.assign({}, props))))));
};

var TopNavHeader = function TopNavHeader(props) {
  var ref = (0, _react.useRef)(null);
  var theme = props.theme,
      onMenuHeaderClick = props.onMenuHeaderClick,
      contentWidth = props.contentWidth,
      rightContentRender = props.rightContentRender,
      propsClassName = props.className,
      style = props.style,
      layout = props.layout;
  var baseClassName = 'ant-pro-top-nav-header';
  var headerDom = (0, _SiderMenu.defaultRenderLogoAndTitle)(Object.assign(Object.assign({}, props), {
    collapsed: false
  }), layout === 'mix' ? 'headerTitleRender' : undefined);
  var className = (0, _classnames.default)(baseClassName, propsClassName, {
    light: theme === 'light'
  });
  return _react.default.createElement("div", {
    className: className,
    style: style
  }, _react.default.createElement("div", {
    ref: ref,
    className: "".concat(baseClassName, "-main ").concat(contentWidth === 'Fixed' ? 'wide' : '')
  }, headerDom && _react.default.createElement("div", {
    className: "".concat(baseClassName, "-main-left"),
    onClick: onMenuHeaderClick
  }, _react.default.createElement("div", {
    className: "".concat(baseClassName, "-logo"),
    key: "logo",
    id: "logo"
  }, headerDom)), _react.default.createElement("div", {
    style: {
      flex: 1
    },
    className: "".concat(baseClassName, "-menu")
  }, _react.default.createElement(_BaseMenu.default, Object.assign({}, props, props.menuProps))), rightContentRender && _react.default.createElement(RightContent, Object.assign({
    rightContentRender: rightContentRender
  }, props))));
};

var _default = TopNavHeader;
exports.default = _default;