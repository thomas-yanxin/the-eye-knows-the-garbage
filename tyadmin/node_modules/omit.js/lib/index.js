"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function omit(obj, fields) {
  // eslint-disable-next-line prefer-object-spread
  var shallowCopy = Object.assign({}, obj);

  for (var i = 0; i < fields.length; i += 1) {
    var key = fields[i];
    delete shallowCopy[key];
  }

  return shallowCopy;
}

var _default = omit;
exports.default = _default;