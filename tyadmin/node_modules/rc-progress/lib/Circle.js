"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var gradientSeed = 0;

function stripPercentToNumber(percent) {
  return +percent.replace('%', '');
}

function toArray(symArray) {
  return Array.isArray(symArray) ? symArray : [symArray];
}

function getPathStyles(offset, percent, strokeColor, strokeWidth) {
  var gapDegree = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var gapPosition = arguments.length > 5 ? arguments[5] : undefined;
  var radius = 50 - strokeWidth / 2;
  var beginPositionX = 0;
  var beginPositionY = -radius;
  var endPositionX = 0;
  var endPositionY = -2 * radius;

  switch (gapPosition) {
    case 'left':
      beginPositionX = -radius;
      beginPositionY = 0;
      endPositionX = 2 * radius;
      endPositionY = 0;
      break;

    case 'right':
      beginPositionX = radius;
      beginPositionY = 0;
      endPositionX = -2 * radius;
      endPositionY = 0;
      break;

    case 'bottom':
      beginPositionY = radius;
      endPositionY = 2 * radius;
      break;

    default:
  }

  var pathString = "M 50,50 m ".concat(beginPositionX, ",").concat(beginPositionY, "\n   a ").concat(radius, ",").concat(radius, " 0 1 1 ").concat(endPositionX, ",").concat(-endPositionY, "\n   a ").concat(radius, ",").concat(radius, " 0 1 1 ").concat(-endPositionX, ",").concat(endPositionY);
  var len = Math.PI * 2 * radius;
  var pathStyle = {
    stroke: strokeColor,
    strokeDasharray: "".concat(percent / 100 * (len - gapDegree), "px ").concat(len, "px"),
    strokeDashoffset: "-".concat(gapDegree / 2 + offset / 100 * (len - gapDegree), "px"),
    transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s' // eslint-disable-line

  };
  return {
    pathString: pathString,
    pathStyle: pathStyle
  };
}

var Circle = function Circle(_ref) {
  var prefixCls = _ref.prefixCls,
      strokeWidth = _ref.strokeWidth,
      trailWidth = _ref.trailWidth,
      gapDegree = _ref.gapDegree,
      gapPosition = _ref.gapPosition,
      trailColor = _ref.trailColor,
      strokeLinecap = _ref.strokeLinecap,
      style = _ref.style,
      className = _ref.className,
      strokeColor = _ref.strokeColor,
      percent = _ref.percent,
      restProps = _objectWithoutProperties(_ref, ["prefixCls", "strokeWidth", "trailWidth", "gapDegree", "gapPosition", "trailColor", "strokeLinecap", "style", "className", "strokeColor", "percent"]);

  var gradientId = (0, _react.useMemo)(function () {
    gradientSeed += 1;
    return gradientSeed;
  }, []);

  var _getPathStyles = getPathStyles(0, 100, trailColor, strokeWidth, gapDegree, gapPosition),
      pathString = _getPathStyles.pathString,
      pathStyle = _getPathStyles.pathStyle;

  var percentList = toArray(percent);
  var strokeColorList = toArray(strokeColor);
  var gradient = strokeColorList.find(function (color) {
    return Object.prototype.toString.call(color) === '[object Object]';
  });

  var _useTransitionDuratio = (0, _common.useTransitionDuration)(percentList),
      _useTransitionDuratio2 = _slicedToArray(_useTransitionDuratio, 1),
      paths = _useTransitionDuratio2[0];

  var getStokeList = function getStokeList() {
    var stackPtg = 0;
    return percentList.map(function (ptg, index) {
      var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
      var stroke = Object.prototype.toString.call(color) === '[object Object]' ? "url(#".concat(prefixCls, "-gradient-").concat(gradientId, ")") : '';
      var pathStyles = getPathStyles(stackPtg, ptg, color, strokeWidth, gapDegree, gapPosition);
      stackPtg += ptg;
      return /*#__PURE__*/_react["default"].createElement("path", {
        key: index,
        className: "".concat(prefixCls, "-circle-path"),
        d: pathStyles.pathString,
        stroke: stroke,
        strokeLinecap: strokeLinecap,
        strokeWidth: strokeWidth,
        opacity: ptg === 0 ? 0 : 1,
        fillOpacity: "0",
        style: pathStyles.pathStyle,
        ref: paths[index]
      });
    });
  };

  return /*#__PURE__*/_react["default"].createElement("svg", _extends({
    className: (0, _classnames["default"])("".concat(prefixCls, "-circle"), className),
    viewBox: "0 0 100 100",
    style: style
  }, restProps), gradient && /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("linearGradient", {
    id: "".concat(prefixCls, "-gradient-").concat(gradientId),
    x1: "100%",
    y1: "0%",
    x2: "0%",
    y2: "0%"
  }, Object.keys(gradient).sort(function (a, b) {
    return stripPercentToNumber(a) - stripPercentToNumber(b);
  }).map(function (key, index) {
    return /*#__PURE__*/_react["default"].createElement("stop", {
      key: index,
      offset: key,
      stopColor: gradient[key]
    });
  }))), /*#__PURE__*/_react["default"].createElement("path", {
    className: "".concat(prefixCls, "-circle-trail"),
    d: pathString,
    stroke: trailColor,
    strokeLinecap: strokeLinecap,
    strokeWidth: trailWidth || strokeWidth,
    fillOpacity: "0",
    style: pathStyle
  }), getStokeList().reverse());
};

Circle.defaultProps = _common.defaultProps;
var _default = Circle;
exports["default"] = _default;