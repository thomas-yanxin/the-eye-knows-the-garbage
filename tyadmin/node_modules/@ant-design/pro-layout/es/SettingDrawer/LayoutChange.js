import "antd/es/switch/style";
import _Switch from "antd/es/switch";
import "antd/es/select/style";
import _Select from "antd/es/select";
import "antd/es/list/style";
import _List from "antd/es/list";
import "antd/es/tooltip/style";
import _Tooltip from "antd/es/tooltip";
import React from 'react';
import defaultSettings from '../defaultSettings';
import { getFormatMessage } from './index';
export var renderLayoutSettingItem = function renderLayoutSettingItem(item) {
  var action = React.cloneElement(item.action, {
    disabled: item.disabled
  });
  return React.createElement(_Tooltip, {
    title: item.disabled ? item.disabledReason : '',
    placement: "left"
  }, React.createElement(_List.Item, {
    actions: [action]
  }, React.createElement("span", {
    style: {
      opacity: item.disabled ? 0.5 : 1
    }
  }, item.title)));
};

var LayoutSetting = function LayoutSetting(_ref) {
  var _ref$settings = _ref.settings,
      settings = _ref$settings === void 0 ? {} : _ref$settings,
      changeSetting = _ref.changeSetting;
  var formatMessage = getFormatMessage();

  var _ref2 = settings || defaultSettings,
      contentWidth = _ref2.contentWidth,
      splitMenus = _ref2.splitMenus,
      fixedHeader = _ref2.fixedHeader,
      layout = _ref2.layout,
      fixSiderbar = _ref2.fixSiderbar;

  return React.createElement(_List, {
    split: false,
    dataSource: [{
      title: formatMessage({
        id: 'app.setting.content-width',
        defaultMessage: 'Content Width'
      }),
      action: React.createElement(_Select, {
        value: contentWidth || 'Fixed',
        size: "small",
        onSelect: function onSelect(value) {
          return changeSetting('contentWidth', value);
        },
        style: {
          width: 80
        }
      }, layout === 'side' ? null : React.createElement(_Select.Option, {
        value: "Fixed"
      }, formatMessage({
        id: 'app.setting.content-width.fixed',
        defaultMessage: 'Fixed'
      })), React.createElement(_Select.Option, {
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
      action: React.createElement(_Switch, {
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
      action: React.createElement(_Switch, {
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
      action: React.createElement(_Switch, {
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

export default LayoutSetting;