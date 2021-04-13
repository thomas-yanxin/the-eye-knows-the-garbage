"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/switch/style");

var _switch = _interopRequireDefault(require("antd/lib/switch"));

require("antd/lib/list/style");

var _list = _interopRequireDefault(require("antd/lib/list"));

var _react = _interopRequireDefault(require("react"));

var _index = require("./index");

var _LayoutChange = require("./LayoutChange");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RegionalSetting = function RegionalSetting(_ref) {
  var _ref$settings = _ref.settings,
      settings = _ref$settings === void 0 ? {} : _ref$settings,
      changeSetting = _ref.changeSetting;
  var formatMessage = (0, _index.getFormatMessage)();
  var regionalSetting = ['header', 'footer', 'menu', 'menuHeader'];
  return _react.default.createElement(_list.default, {
    split: false,
    renderItem: _LayoutChange.renderLayoutSettingItem,
    dataSource: regionalSetting.map(function (key) {
      return {
        title: formatMessage({
          id: "app.setting.regionalsettings.".concat(key)
        }),
        action: _react.default.createElement(_switch.default, {
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

var _default = RegionalSetting;
exports.default = _default;