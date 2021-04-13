import "antd/es/switch/style";
import _Switch from "antd/es/switch";
import "antd/es/list/style";
import _List from "antd/es/list";
import React from 'react';
import { getFormatMessage } from './index';
import { renderLayoutSettingItem } from './LayoutChange';

var RegionalSetting = function RegionalSetting(_ref) {
  var _ref$settings = _ref.settings,
      settings = _ref$settings === void 0 ? {} : _ref$settings,
      changeSetting = _ref.changeSetting;
  var formatMessage = getFormatMessage();
  var regionalSetting = ['header', 'footer', 'menu', 'menuHeader'];
  return React.createElement(_List, {
    split: false,
    renderItem: renderLayoutSettingItem,
    dataSource: regionalSetting.map(function (key) {
      return {
        title: formatMessage({
          id: "app.setting.regionalsettings.".concat(key)
        }),
        action: React.createElement(_Switch, {
          size: "small",
          checked: settings["".concat(key, "Render")] || settings["".concat(key, "Render")] === undefined,
          onChange: function onChange(checked) {
            return changeSetting("".concat(key, "Render"), checked === true ? undefined : false);
          }
        })
      };
    })
  });
};

export default RegionalSetting;