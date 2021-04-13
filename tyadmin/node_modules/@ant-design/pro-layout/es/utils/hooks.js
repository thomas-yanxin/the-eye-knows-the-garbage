import { useEffect } from 'react';
import { isBrowser } from './utils';
import defaultSettings from '../defaultSettings';
export function useDocumentTitle(titleInfo) {
  var appDefaultTitle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultSettings.title;
  var titleText = typeof titleInfo.pageName === 'string' ? titleInfo.title : appDefaultTitle;
  useEffect(function () {
    if (isBrowser() && titleText) {
      document.title = titleText;
    }
  }, [titleInfo.title]);
}