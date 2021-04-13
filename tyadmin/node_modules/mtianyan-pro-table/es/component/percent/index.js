import React, { Fragment, useMemo } from 'react';
import toNumber from 'lodash.tonumber';
import { getColorByRealValue, getSymbolByRealValue, getRealTextWithPrecision } from './util';

var Percent = function Percent(_ref) {
  var value = _ref.value,
      prefix = _ref.prefix,
      precision = _ref.precision,
      showSymbol = _ref.showSymbol,
      _ref$suffix = _ref.suffix,
      suffix = _ref$suffix === void 0 ? '%' : _ref$suffix,
      _ref$showColor = _ref.showColor,
      showColor = _ref$showColor === void 0 ? false : _ref$showColor;
  var realValue = useMemo(function () {
    return typeof value === 'string' && value.includes('%') ? toNumber(value.replace('%', '')) : toNumber(value);
  }, [value]);
  /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */

  var style = showColor ? {
    color: getColorByRealValue(realValue)
  } : {};
  return React.createElement("span", {
    style: style
  }, prefix && React.createElement("span", null, prefix), showSymbol && React.createElement(Fragment, null, getSymbolByRealValue(realValue), "\xA0"), getRealTextWithPrecision(realValue, precision), suffix && suffix);
};

export default Percent;