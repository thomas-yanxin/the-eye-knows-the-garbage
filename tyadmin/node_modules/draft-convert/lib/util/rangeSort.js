"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(r1, r2) {
  if (r1.offset === r2.offset) {
    return r2.length - r1.length;
  }

  return r1.offset - r2.offset;
};

exports["default"] = _default;