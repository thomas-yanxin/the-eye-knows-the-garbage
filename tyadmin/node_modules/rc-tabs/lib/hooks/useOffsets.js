"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useOffsets;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_SIZE = {
  width: 0,
  height: 0,
  left: 0,
  top: 0
};

function useOffsets(tabs, tabSizes, holderScrollWidth) {
  return (0, _react.useMemo)(function () {
    var _tabs$;

    var map = new Map();
    var lastOffset = tabSizes.get((_tabs$ = tabs[0]) === null || _tabs$ === void 0 ? void 0 : _tabs$.key) || DEFAULT_SIZE;
    var rightOffset = lastOffset.left + lastOffset.width;

    for (var i = 0; i < tabs.length; i += 1) {
      var key = tabs[i].key;
      var data = tabSizes.get(key); // Reuse last one when not exist yet

      if (!data) {
        var _tabs;

        data = tabSizes.get((_tabs = tabs[i - 1]) === null || _tabs === void 0 ? void 0 : _tabs.key) || DEFAULT_SIZE;
      }

      var entity = map.get(key) || _objectSpread({}, data); // Right


      entity.right = rightOffset - entity.left - entity.width; // Update entity

      map.set(key, entity);
    }

    return map;
  }, [tabs.map(function (tab) {
    return tab.key;
  }).join('_'), tabSizes, holderScrollWidth]);
}