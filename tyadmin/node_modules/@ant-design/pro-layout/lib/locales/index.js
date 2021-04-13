"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getLanguage = void 0;

var _zhCN = _interopRequireDefault(require("./zh-CN"));

var _zhTW = _interopRequireDefault(require("./zh-TW"));

var _enUS = _interopRequireDefault(require("./en-US"));

var _itIT = _interopRequireDefault(require("./it-IT"));

var _utils = require("../utils/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locales = {
  'zh-CN': _zhCN.default,
  'zh-TW': _zhTW.default,
  'en-US': _enUS.default,
  'it-IT': _itIT.default
};

var getLanguage = function getLanguage() {
  var lang; // support ssr

  if (!(0, _utils.isBrowser)()) {
    return lang || '';
  }

  lang = window.localStorage.getItem('umi_locale');
  return lang || window.g_locale || navigator.language;
};

exports.getLanguage = getLanguage;

var _default = function _default(locale) {
  if (locale) {
    return locales[locale];
  }

  var gLocale = getLanguage();

  if (locales[gLocale]) {
    return locales[gLocale];
  }

  return locales['zh-CN'];
};

exports.default = _default;