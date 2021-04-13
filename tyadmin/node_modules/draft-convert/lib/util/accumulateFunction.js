"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(newFn, rest) {
  return function () {
    var newResult = newFn.apply(void 0, arguments);

    if (newResult !== undefined && newResult !== null) {
      return newResult;
    }

    return rest.apply(void 0, arguments);
  };
};

exports["default"] = _default;