"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/layout/style");

var _layout = _interopRequireDefault(require("antd/lib/layout"));

var _icons = require("@ant-design/icons");

var _react = _interopRequireWildcard(require("react"));

var _GlobalFooter = _interopRequireDefault(require("./GlobalFooter"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Footer = _layout.default.Footer;
var defaultLinks = [{
  key: 'Ant Design Pro',
  title: 'Ant Design Pro',
  href: 'https://pro.ant.design',
  blankTarget: true
}, {
  key: 'github',
  title: _react.default.createElement(_icons.GithubOutlined, null),
  href: 'https://github.com/ant-design/ant-design-pro',
  blankTarget: true
}, {
  key: 'Ant Design',
  title: 'Ant Design',
  href: 'https://ant.design',
  blankTarget: true
}];
var defaultCopyright = '2019 蚂蚁金服体验技术部出品';

var FooterView = function FooterView(_ref) {
  var links = _ref.links,
      copyright = _ref.copyright,
      style = _ref.style,
      className = _ref.className;
  return _react.default.createElement(Footer, {
    className: className,
    style: Object.assign({
      padding: 0
    }, style)
  }, _react.default.createElement(_GlobalFooter.default, {
    links: links !== undefined ? links : defaultLinks,
    copyright: copyright === false ? null : _react.default.createElement(_react.Fragment, null, "Copyright ", _react.default.createElement(_icons.CopyrightOutlined, null), " ", copyright || defaultCopyright)
  }));
};

var _default = FooterView;
exports.default = _default;