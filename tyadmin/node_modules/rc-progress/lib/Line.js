"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Line = function Line(_ref) {
  var className = _ref.className,
      percent = _ref.percent,
      prefixCls = _ref.prefixCls,
      strokeColor = _ref.strokeColor,
      strokeLinecap = _ref.strokeLinecap,
      strokeWidth = _ref.strokeWidth,
      style = _ref.style,
      trailColor = _ref.trailColor,
      trailWidth = _ref.trailWidth,
      transition = _ref.transition,
      restProps = _objectWithoutProperties(_ref, ["className", "percent", "prefixCls", "strokeColor", "strokeLinecap", "strokeWidth", "style", "trailColor", "trailWidth", "transition"]);

  delete restProps.gapPosition;
  var percentList = Array.isArray(percent) ? percent : [percent];
  var strokeColorList = Array.isArray(strokeColor) ? strokeColor : [strokeColor];

  var _useTransitionDuratio = (0, _common.useTransitionDuration)(percentList),
      _useTransitionDuratio2 = _slicedToArray(_useTransitionDuratio, 1),
      paths = _useTransitionDuratio2[0];

  var center = strokeWidth / 2;
  var right = 100 - strokeWidth / 2;
  var pathString = "M ".concat(strokeLinecap === 'round' ? center : 0, ",").concat(center, "\n         L ").concat(strokeLinecap === 'round' ? right : 100, ",").concat(center);
  var viewBoxString = "0 0 100 ".concat(strokeWidth);
  var stackPtg = 0;
  return /*#__PURE__*/_react["default"].createElement("svg", _extends({
    className: (0, _classnames["default"])("".concat(prefixCls, "-line"), className),
    viewBox: viewBoxString,
    preserveAspectRatio: "none",
    style: style
  }, restProps), /*#__PURE__*/_react["default"].createElement("path", {
    className: "".concat(prefixCls, "-line-trail"),
    d: pathString,
    strokeLinecap: strokeLinecap,
    stroke: trailColor,
    strokeWidth: trailWidth || strokeWidth,
    fillOpacity: "0"
  }), percentList.map(function (ptg, index) {
    var pathStyle = {
      strokeDasharray: "".concat(ptg, "px, 100px"),
      strokeDashoffset: "-".concat(stackPtg, "px"),
      transition: transition || 'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear'
    };
    var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
    stackPtg += ptg;
    return /*#__PURE__*/_react["default"].createElement("path", {
      key: index,
      className: "".concat(prefixCls, "-line-path"),
      d: pathString,
      strokeLinecap: strokeLinecap,
      stroke: color,
      strokeWidth: strokeWidth,
      fillOpacity: "0",
      ref: paths[index],
      style: pathStyle
    });
  }));
};

Line.defaultProps = _common.defaultProps;
var _default = Line;
exports["default"] = _default;