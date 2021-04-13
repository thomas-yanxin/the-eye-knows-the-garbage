import "antd/es/layout/style";
import _Layout from "antd/es/layout";
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import React, { Fragment } from 'react';
import GlobalFooter from './GlobalFooter';
var Footer = _Layout.Footer;
var defaultLinks = [{
  key: 'Ant Design Pro',
  title: 'Ant Design Pro',
  href: 'https://pro.ant.design',
  blankTarget: true
}, {
  key: 'github',
  title: React.createElement(GithubOutlined, null),
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
  return React.createElement(Footer, {
    className: className,
    style: Object.assign({
      padding: 0
    }, style)
  }, React.createElement(GlobalFooter, {
    links: links !== undefined ? links : defaultLinks,
    copyright: copyright === false ? null : React.createElement(Fragment, null, "Copyright ", React.createElement(CopyrightOutlined, null), " ", copyright || defaultCopyright)
  }));
};

export default FooterView;