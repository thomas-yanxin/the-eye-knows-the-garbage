"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDisabled = isDisabled;
exports.default = useKeyValueMapping;

var _react = _interopRequireDefault(require("react"));

function isDisabled(dataNode, skipType) {
  if (!dataNode) {
    return true;
  }

  var _dataNode$data = dataNode.data,
      disabled = _dataNode$data.disabled,
      disableCheckbox = _dataNode$data.disableCheckbox;

  switch (skipType) {
    case 'select':
      return disabled;

    case 'checkbox':
      return disabled || disableCheckbox;
  }

  return false;
}

function useKeyValueMapping(cacheKeyMap, cacheValueMap) {
  var getEntityByKey = _react.default.useCallback(function (key) {
    var skipType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'select';
    var ignoreDisabledCheck = arguments.length > 2 ? arguments[2] : undefined;
    var dataNode = cacheKeyMap.get(key);

    if (!ignoreDisabledCheck && isDisabled(dataNode, skipType)) {
      return null;
    }

    return dataNode;
  }, [cacheKeyMap]);

  var getEntityByValue = _react.default.useCallback(function (value) {
    var skipType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'select';
    var ignoreDisabledCheck = arguments.length > 2 ? arguments[2] : undefined;
    var dataNode = cacheValueMap.get(value);

    if (!ignoreDisabledCheck && isDisabled(dataNode, skipType)) {
      return null;
    }

    return dataNode;
  }, [cacheValueMap]);

  return [getEntityByKey, getEntityByValue];
}