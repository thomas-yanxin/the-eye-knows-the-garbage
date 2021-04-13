import './index.less';
import React from 'react';
import classNames from 'classnames';
export default (function (_ref) {
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
  var clsString = classNames(baseClassName, className);
  return React.createElement("footer", {
    className: clsString,
    style: style
  }, links && React.createElement("div", {
    className: "".concat(baseClassName, "-links")
  }, links.map(function (link) {
    return React.createElement("a", {
      key: link.key,
      title: link.key,
      target: link.blankTarget ? '_blank' : '_self',
      href: link.href
    }, link.title);
  })), copyright && React.createElement("div", {
    className: "".concat(baseClassName, "-copyright")
  }, copyright));
});