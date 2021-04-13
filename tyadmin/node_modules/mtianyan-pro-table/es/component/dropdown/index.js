import "antd/es/button/style";
import _Button from "antd/es/button";
import "antd/es/dropdown/style";
import _Dropdown from "antd/es/dropdown";
import "antd/es/menu/style";
import _Menu from "antd/es/menu";
import React from 'react';
import classnames from 'classnames';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ConfigConsumer } from "antd/es/config-provider/context";
import './index.less';
/**
 * 默认的 index 列容器，提供一个好看的 index
 * @param param0
 */

var DropdownButton = function DropdownButton(_ref) {
  var children = _ref.children,
      _ref$menus = _ref.menus,
      menus = _ref$menus === void 0 ? [] : _ref$menus,
      onSelect = _ref.onSelect,
      className = _ref.className,
      style = _ref.style;
  return React.createElement(ConfigConsumer, null, function (_ref2) {
    var getPrefixCls = _ref2.getPrefixCls;
    var tempClassName = getPrefixCls('pro-table-dropdown');
    var menu = React.createElement(_Menu, {
      onClick: function onClick(params) {
        return onSelect && onSelect(params.key);
      }
    }, menus.map(function (item) {
      return React.createElement(_Menu.Item, {
        key: item.key
      }, item.name);
    }));
    return React.createElement(_Dropdown, {
      overlay: menu,
      className: classnames(tempClassName, className)
    }, React.createElement(_Button, {
      style: style
    }, children, " ", React.createElement(DownOutlined, null)));
  });
};

var TableDropdown = function TableDropdown(_ref3) {
  var propsClassName = _ref3.className,
      style = _ref3.style,
      onSelect = _ref3.onSelect,
      _ref3$menus = _ref3.menus,
      menus = _ref3$menus === void 0 ? [] : _ref3$menus;
  return React.createElement(ConfigConsumer, null, function (_ref4) {
    var getPrefixCls = _ref4.getPrefixCls;
    var className = getPrefixCls('pro-table-dropdown');
    var menu = React.createElement(_Menu, {
      onClick: function onClick(params) {
        return onSelect && onSelect(params.key);
      }
    }, menus.map(function (item) {
      return React.createElement(_Menu.Item, {
        key: item.key
      }, item.name);
    }));
    return React.createElement(_Dropdown, {
      overlay: menu,
      className: classnames(className, propsClassName)
    }, React.createElement("a", {
      style: style
    }, React.createElement(EllipsisOutlined, null)));
  });
};

TableDropdown.Button = DropdownButton;
export default TableDropdown;