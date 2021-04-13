"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layout = _interopRequireDefault(require("./layout"));

var _Sider = _interopRequireDefault(require("./Sider"));

_layout["default"].Sider = _Sider["default"];
var _default = _layout["default"];
exports["default"] = _default;