"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

require("antd/lib/dropdown/style");

var _dropdown = _interopRequireDefault(require("antd/lib/dropdown"));

require("antd/lib/menu/style");

var _menu = _interopRequireDefault(require("antd/lib/menu"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icons = require("@ant-design/icons");

var _context = require("antd/lib/config-provider/context");

require("./index.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  return _react.default.createElement(_context.ConfigConsumer, null, function (_ref2) {
    var getPrefixCls = _ref2.getPrefixCls;
    var tempClassName = getPrefixCls('pro-table-dropdown');

    var menu = _react.default.createElement(_menu.default, {
      onClick: function onClick(params) {
        return onSelect && onSelect(params.key);
      }
    }, menus.map(function (item) {
      return _react.default.createElement(_menu.default.Item, {
        key: item.key
      }, item.name);
    }));

    return _react.default.createElement(_dropdown.default, {
      overlay: menu,
      className: (0, _classnames.default)(tempClassName, className)
    }, _react.default.createElement(_button.default, {
      style: style
    }, children, " ", _react.default.createElement(_icons.DownOutlined, null)));
  });
};

var TableDropdown = function TableDropdown(_ref3) {
  var propsClassName = _ref3.className,
      style = _ref3.style,
      onSelect = _ref3.onSelect,
      _ref3$menus = _ref3.menus,
      menus = _ref3$menus === void 0 ? [] : _ref3$menus;
  return _react.default.createElement(_context.ConfigConsumer, null, function (_ref4) {
    var getPrefixCls = _ref4.getPrefixCls;
    var className = getPrefixCls('pro-table-dropdown');

    var menu = _react.default.createElement(_menu.default, {
      onClick: function onClick(params) {
        return onSelect && onSelect(params.key);
      }
    }, menus.map(function (item) {
      return _react.default.createElement(_menu.default.Item, {
        key: item.key
      }, item.name);
    }));

    return _react.default.createElement(_dropdown.default, {
      overlay: menu,
      className: (0, _classnames.default)(className, propsClassName)
    }, _react.default.createElement("a", {
      style: style
    }, _react.default.createElement(_icons.EllipsisOutlined, null)));
  });
};

TableDropdown.Button = DropdownButton;
var _default = TableDropdown;
exports.default = _default;