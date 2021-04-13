"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(typeObject) {
  return function (block) {
    if (typeof typeObject === 'function') {
      // handle case where typeObject is already a function
      return typeObject(block);
    }

    return typeObject[block.type];
  };
};

exports["default"] = _default;