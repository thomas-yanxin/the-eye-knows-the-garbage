"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var braftUniqueIndex = 0;

var UniqueIndex = exports.UniqueIndex = function UniqueIndex() {
  return braftUniqueIndex += 1;
};