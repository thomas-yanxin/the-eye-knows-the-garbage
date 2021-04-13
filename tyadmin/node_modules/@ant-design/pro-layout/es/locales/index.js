import zhLocal from './zh-CN';
import zhTWLocal from './zh-TW';
import enUSLocal from './en-US';
import itITLocal from './it-IT';
import { isBrowser } from '../utils/utils';
var locales = {
  'zh-CN': zhLocal,
  'zh-TW': zhTWLocal,
  'en-US': enUSLocal,
  'it-IT': itITLocal
};

var getLanguage = function getLanguage() {
  var lang; // support ssr

  if (!isBrowser()) {
    return lang || '';
  }

  lang = window.localStorage.getItem('umi_locale');
  return lang || window.g_locale || navigator.language;
};

export { getLanguage };
export default (function (locale) {
  if (locale) {
    return locales[locale];
  }

  var gLocale = getLanguage();

  if (locales[gLocale]) {
    return locales[gLocale];
  }

  return locales['zh-CN'];
});