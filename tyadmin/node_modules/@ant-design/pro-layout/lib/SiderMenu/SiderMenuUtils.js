"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedMenuKeys = void 0;

var _routeUtils = require("@umijs/route-utils");

// 获取当前的选中菜单
var getSelectedMenuKeys = function getSelectedMenuKeys(pathname, menuData) {
  var menus = (0, _routeUtils.getMatchMenu)(pathname, menuData);
  return menus.map(function (item) {
    return item.key || item.path || '';
  });
};

exports.getSelectedMenuKeys = getSelectedMenuKeys;