import { getMatchMenu } from '@umijs/route-utils'; // 获取当前的选中菜单

export var getSelectedMenuKeys = function getSelectedMenuKeys(pathname, menuData) {
  var menus = getMatchMenu(pathname, menuData);
  return menus.map(function (item) {
    return item.key || item.path || '';
  });
};