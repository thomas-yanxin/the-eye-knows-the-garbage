import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
import useValueTexts from './useValueTexts';
export default function useHoverValue(valueText, _ref) {
  var formatList = _ref.formatList,
      generateConfig = _ref.generateConfig,
      locale = _ref.locale;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useValueTexts = useValueTexts(value, {
    formatList: formatList,
    generateConfig: generateConfig,
    locale: locale
  }),
      _useValueTexts2 = _slicedToArray(_useValueTexts, 2),
      firstText = _useValueTexts2[1];

  function onEnter(date) {
    setValue(date);
  }

  function onLeave() {
    setValue(null);
  }

  useEffect(function () {
    onLeave();
  }, [valueText]);
  return [firstText, onEnter, onLeave];
}