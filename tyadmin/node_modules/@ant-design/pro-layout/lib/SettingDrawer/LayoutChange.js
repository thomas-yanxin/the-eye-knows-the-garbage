"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.renderLayoutSettingItem = void 0;

require("antd/lib/switch/style");

var _switch = _interopRequireDefault(require("antd/lib/switch"));

require("antd/lib/select/style");

var _select = _interopRequireDefault(require("antd/lib/select"));

require("antd/lib/list/style");

var _list = _interopRequireDefault(require("antd/lib/list"));

require("antd/lib/tooltip/style");

var _tooltip = _interopRequireDefault(require("antd/lib/tooltip"));

var _react = _interopRequireDefault(require("react"));

var _defaultSettings = _interopRequireDefault(require("../defaultSettings"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderLayoutSettingItem = function renderLayoutSettingItem(item) {
  var action = _react.default.cloneElement(item.action, {
    disabled: item.disabled
  });

  return _react.default.createElement(_tooltip.default, {
    title: item.disabled ? item.disabledReason : '',
    placement: "left"
  }, _react.default.createElement(_list.default.Item, {
    actions: [action]
  }, _react.default.createElement("span", {
    style: {
      opacity: item.disabled ? 0.5 : 1
    }
  }, item.title)));
};

exports.renderLayoutSettingItem = renderLayoutSettingItem;

var LayoutSetting = function LayoutSetting(_ref) {
  var _ref$settings = _ref.settings,
      settings = _ref$settings === void 0 ? {} : _ref$settings,
      changeSetting = _ref.changeSetting;
  var formatMessage = (0, _index.getFormatMessage)();

  var _ref2 = settings || _defaultSettings.default,
      contentWidth = _ref2.contentWidth,
      splitMenus = _ref2.splitMenus,
      fixedHeader = _ref2.fixedHeader,
      layout = _ref2.layout,
      fixSiderbar = _ref2.fixSiderbar;

  return _react.default.createElement(_list.default, {
    split: false,
    dataSource: [{
      title: formatMessage({
        id: 'app.setting.content-width',
        defaultMessage: 'Content Width'
      }),
      action: _react.default.createElement(_select.default, {
        value: contentWidth || 'Fixed',
        size: "small",
        onSelect: function onSelect(value) {
          return changeSetting('contentWidth', value);
        },
        style: {
          width: 80
        }
      }, layout === 'side' ? null : _react.default.createElement(_select.default.Option, {
        value: "Fixed"
      }, formatMessage({
        id: 'app.setting.content-width.fixed',
        defaultMessage: 'Fixed'
      })), _react.default.createElement(_select.default.Option, {
        value: "Fluid"
      }, formatMessage({
        id: 'app.setting.content-width.fluid',
        defaultMessage: 'Fluid'
      })))
    }, {
      title: formatMessage({
        id: 'app.setting.fixedheader',
        defaultMessage: 'Fixed Header'
      }),
      action: _react.default.createElement(_switch.default, {
        size: "small",
        checked: !!fixedHeader,
        onChange: function onChange(checked) {
          return changeSetting('fixedHeader', checked);
        }
      })
    }, {
      title: formatMessage({
        id: 'app.setting.fixedsidebar',
        defaultMessage: 'Fixed Sidebar'
      }),
      disabled: layout === 'top',
      disabledReason: formatMessage({
        id: 'app.setting.fixedsidebar.hint',
        defaultMessage: 'Works on Side Menu Layout'
      }),
      action: _react.default.createElement(_switch.default, {
        size: "small",
        checked: !!fixSiderbar,
        onChange: function onChange(checked) {
          return changeSetting('fixSiderbar', checked);
        }
      })
    }, {
      title: formatMessage({
        id: 'app.setting.splitMenus'
      }),
      disabled: layout !== 'mix',
      action: _react.default.createElement(_switch.default, {
        size: "small",
        checked: !!splitMenus,
        onChange: function onChange(checked) {
          return changeSetting('splitMenus', checked);
        }
      })
    }],
    renderItem: renderLayoutSettingItem
  });
};

var _default = LayoutSetting;
exports.default = _default;