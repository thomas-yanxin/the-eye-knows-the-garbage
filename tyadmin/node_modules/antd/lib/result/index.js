"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ExceptionMap = exports.IconMap = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons/CheckCircleFilled"));

var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons/CloseCircleFilled"));

var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons/ExclamationCircleFilled"));

var _WarningFilled = _interopRequireDefault(require("@ant-design/icons/WarningFilled"));

var _configProvider = require("../config-provider");

var _devWarning = _interopRequireDefault(require("../_util/devWarning"));

var _noFound = _interopRequireDefault(require("./noFound"));

var _serverError = _interopRequireDefault(require("./serverError"));

var _unauthorized = _interopRequireDefault(require("./unauthorized"));

var IconMap = {
  success: _CheckCircleFilled["default"],
  error: _CloseCircleFilled["default"],
  info: _ExclamationCircleFilled["default"],
  warning: _WarningFilled["default"]
};
exports.IconMap = IconMap;
var ExceptionMap = {
  '404': _noFound["default"],
  '500': _serverError["default"],
  '403': _unauthorized["default"]
}; // ExceptionImageMap keys

exports.ExceptionMap = ExceptionMap;
var ExceptionStatus = Object.keys(ExceptionMap);
/**
 * render icon
 * if ExceptionStatus includes ,render svg image
 * else render iconNode
 * @param prefixCls
 * @param {status, icon}
 */

var renderIcon = function renderIcon(prefixCls, _ref) {
  var status = _ref.status,
      icon = _ref.icon;
  var className = (0, _classnames["default"])("".concat(prefixCls, "-icon"));
  (0, _devWarning["default"])(!(typeof icon === 'string' && icon.length > 2), 'Result', "`icon` is using ReactNode instead of string naming in v4. Please check `".concat(icon, "` at https://ant.design/components/icon"));

  if (ExceptionStatus.includes("".concat(status))) {
    var SVGComponent = ExceptionMap[status];
    return /*#__PURE__*/React.createElement("div", {
      className: "".concat(className, " ").concat(prefixCls, "-image")
    }, /*#__PURE__*/React.createElement(SVGComponent, null));
  }

  var iconNode = /*#__PURE__*/React.createElement(IconMap[status]);
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, icon || iconNode);
};

var renderExtra = function renderExtra(prefixCls, _ref2) {
  var extra = _ref2.extra;
  return extra && /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-extra")
  }, extra);
};

var Result = function Result(props) {
  return /*#__PURE__*/React.createElement(_configProvider.ConfigConsumer, null, function (_ref3) {
    var getPrefixCls = _ref3.getPrefixCls,
        direction = _ref3.direction;
    var customizePrefixCls = props.prefixCls,
        customizeClassName = props.className,
        subTitle = props.subTitle,
        title = props.title,
        style = props.style,
        children = props.children,
        status = props.status;
    var prefixCls = getPrefixCls('result', customizePrefixCls);
    var className = (0, _classnames["default"])(prefixCls, "".concat(prefixCls, "-").concat(status), customizeClassName, (0, _defineProperty2["default"])({}, "".concat(prefixCls, "-rtl"), direction === 'rtl'));
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: style
    }, renderIcon(prefixCls, props), /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-title")
    }, title), subTitle && /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-subtitle")
    }, subTitle), renderExtra(prefixCls, props), children && /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-content")
    }, children));
  });
};

Result.defaultProps = {
  status: 'info'
}; // eslint-disable-next-line prefer-destructuring

Result.PRESENTED_IMAGE_403 = ExceptionMap[403]; // eslint-disable-next-line prefer-destructuring

Result.PRESENTED_IMAGE_404 = ExceptionMap[404]; // eslint-disable-next-line prefer-destructuring

Result.PRESENTED_IMAGE_500 = ExceptionMap[500];
var _default = Result;
exports["default"] = _default;