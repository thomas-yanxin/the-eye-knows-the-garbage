"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./index.less");

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var className = _ref.className,
      _ref$prefixCls = _ref.prefixCls,
      prefixCls = _ref$prefixCls === void 0 ? 'ant-pro' : _ref$prefixCls,
      links = _ref.links,
      copyright = _ref.copyright,
      style = _ref.style;

  if ((links == null || links === false || Array.isArray(links) && links.length === 0) && (copyright == null || copyright === false)) {
    return null;
  }

  var baseClassName = "".concat(prefixCls, "-global-footer");
  var clsString = (0, _classnames.default)(baseClassName, className);
  return _react.default.createElement("footer", {
    className: clsString,
    style: style
  }, links && _react.default.createElement("div", {
    className: "".concat(baseClassName, "-links")
  }, links.map(function (link) {
    return _react.default.createElement("a", {
      key: link.key,
      title: link.key,
      target: link.blankTarget ? '_blank' : '_self',
      href: link.href
    }, link.title);
  })), copyright && _react.default.createElement("div", {
    className: "".concat(baseClassName, "-copyright")
  }, copyright));
};

exports.default = _default;