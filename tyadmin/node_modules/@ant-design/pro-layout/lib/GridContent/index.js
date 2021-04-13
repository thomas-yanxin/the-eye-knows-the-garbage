"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./GridContent.less");

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _RouteContext = _interopRequireDefault(require("../RouteContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * This component can support contentWidth so you don't need to calculate the width
 * contentWidth=Fixed, width will is 1200
 * @param props
 */
var GridContent = function GridContent(props) {
  var value = (0, _react.useContext)(_RouteContext.default);
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

  return _react.default.createElement("div", {
    className: (0, _classnames.default)(className, propsClassName),
    style: style
  }, _react.default.createElement("div", {
    className: "".concat(prefixCls, "-grid-content-children")
  }, children));
};

var _default = GridContent;
exports.default = _default;