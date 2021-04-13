"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useHoverValue;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _useValueTexts3 = _interopRequireDefault(require("./useValueTexts"));

function useHoverValue(valueText, _ref) {
  var formatList = _ref.formatList,
      generateConfig = _ref.generateConfig,
      locale = _ref.locale;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useValueTexts = (0, _useValueTexts3.default)(value, {
    formatList: formatList,
    generateConfig: generateConfig,
    locale: locale
  }),
      _useValueTexts2 = (0, _slicedToArray2.default)(_useValueTexts, 2),
      firstText = _useValueTexts2[1];

  function onEnter(date) {
    setValue(date);
  }

  function onLeave() {
    setValue(null);
  }

  (0, _react.useEffect)(function () {
    onLeave();
  }, [valueText]);
  return [firstText, onEnter, onLeave];
}