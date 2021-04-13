"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(object) {
  return function (style) {
    if (typeof object === 'function') {
      return object(style);
    }

    return object[style];
  };
};

exports["default"] = _default;