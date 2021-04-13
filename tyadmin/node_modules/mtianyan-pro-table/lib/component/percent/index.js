"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash.tonumber"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Percent = function Percent(_ref) {
  var value = _ref.value,
      prefix = _ref.prefix,
      precision = _ref.precision,
      showSymbol = _ref.showSymbol,
      _ref$suffix = _ref.suffix,
      suffix = _ref$suffix === void 0 ? '%' : _ref$suffix,
      _ref$showColor = _ref.showColor,
      showColor = _ref$showColor === void 0 ? false : _ref$showColor;
  var realValue = (0, _react.useMemo)(function () {
    return typeof value === 'string' && value.includes('%') ? (0, _lodash.default)(value.replace('%', '')) : (0, _lodash.default)(value);
  }, [value]);
  /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */

  var style = showColor ? {
    color: (0, _util.getColorByRealValue)(realValue)
  } : {};
  return _react.default.createElement("span", {
    style: style
  }, prefix && _react.default.createElement("span", null, prefix), showSymbol && _react.default.createElement(_react.Fragment, null, (0, _util.getSymbolByRealValue)(realValue), "\xA0"), (0, _util.getRealTextWithPrecision)(realValue, precision), suffix && suffix);
};

var _default = Percent;
exports.default = _default;