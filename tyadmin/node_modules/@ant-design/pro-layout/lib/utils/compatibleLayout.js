"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var compatibleLayout = function compatibleLayout(layout) {
  if (!layout) {
    return layout;
  }

  var layoutEnum = ['sidemenu', 'topmenu'];

  if (layoutEnum.includes(layout)) {
    return layout.replace('menu', '');
  }

  return layout;
};

var _default = compatibleLayout;
exports.default = _default;