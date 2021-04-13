function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React from 'react';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from './pathTools';
import { isBrowser } from './utils'; // 渲染Breadcrumb 子节点
// Render the Breadcrumb child node

var defaultItemRender = function defaultItemRender(_ref) {
  var breadcrumbName = _ref.breadcrumbName,
      path = _ref.path;
  return React.createElement("a", {
    href: path
  }, breadcrumbName);
};

var renderItemLocal = function renderItemLocal(item, props) {
  var formatMessage = props.formatMessage,
      _props$menu = props.menu,
      menu = _props$menu === void 0 ? {
    locale: false
  } : _props$menu;

  if (item.locale && formatMessage && menu.locale !== false) {
    return formatMessage({
      id: item.locale,
      defaultMessage: item.name
    });
  }

  return item.name;
};

export var getBreadcrumb = function getBreadcrumb(breadcrumbMap, url) {
  if (!breadcrumbMap) {
    return {
      path: ''
    };
  }

  var breadcrumbItem = breadcrumbMap.get(url);

  if (!breadcrumbItem) {
    // Find the first matching path in the order defined by route config
    // 按照 route config 定义的顺序找到第一个匹配的路径
    var targetPath = _toConsumableArray(breadcrumbMap.keys()).find(function (path) {
      return (// remove ? ,不然会重复
        pathToRegexp(path.replace('?', '')).test(url)
      );
    });

    if (targetPath) {
      breadcrumbItem = breadcrumbMap.get(targetPath);
    }
  }

  return breadcrumbItem || {
    path: ''
  };
};
export var getBreadcrumbFromProps = function getBreadcrumbFromProps(props) {
  var location = props.location,
      breadcrumbMap = props.breadcrumbMap;
  return {
    location: location,
    breadcrumbMap: breadcrumbMap
  };
}; // Generated according to props

var conversionFromProps = function conversionFromProps(props) {
  var _props$breadcrumbList = props.breadcrumbList,
      breadcrumbList = _props$breadcrumbList === void 0 ? [] : _props$breadcrumbList;
  return breadcrumbList.map(function (item) {
    var title = item.title,
        href = item.href; // For application that has configured router base
    // @ts-ignore

    var _ref2 = isBrowser() ? window : {},
        _ref2$routerBase = _ref2.routerBase,
        routerBase = _ref2$routerBase === void 0 ? '/' : _ref2$routerBase;

    var realPath = routerBase === '/' ? href : "".concat(routerBase).concat(href);
    return {
      path: realPath,
      breadcrumbName: title
    };
  }).filter(function (item) {
    return item.path;
  });
};

var conversionFromLocation = function conversionFromLocation() {
  var routerLocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    pathname: '/'
  };
  var breadcrumbMap = arguments.length > 1 ? arguments[1] : undefined;
  var props = arguments.length > 2 ? arguments[2] : undefined;

  if (!routerLocation) {
    return [];
  } // Convertor the url to an array


  var pathSnippets = urlToList(routerLocation.pathname); // Loop data mosaic routing

  var extraBreadcrumbItems = pathSnippets.map(function (url) {
    // For application that has configured router base
    // @ts-ignore
    var _ref3 = isBrowser() ? window : {},
        _ref3$routerBase = _ref3.routerBase,
        routerBase = _ref3$routerBase === void 0 ? '/' : _ref3$routerBase;

    var realPath = routerBase === '/' ? url : "".concat(routerBase).concat(url);
    var currentBreadcrumb = getBreadcrumb(breadcrumbMap, url);

    if (currentBreadcrumb.inherited) {
      return {
        path: '',
        breadcrumbName: ''
      };
    }

    var name = renderItemLocal(currentBreadcrumb, props);
    var hideInBreadcrumb = currentBreadcrumb.hideInBreadcrumb;
    return name && !hideInBreadcrumb ? {
      path: realPath,
      breadcrumbName: name,
      component: currentBreadcrumb.component
    } : {
      path: '',
      breadcrumbName: ''
    };
  }).filter(function (item) {
    return item && item.path;
  });
  return extraBreadcrumbItems;
};
/**
 * 将参数转化为面包屑
 * Convert parameters into breadcrumbs
 */


export var genBreadcrumbProps = function genBreadcrumbProps(props) {
  var breadcrumbList = props.breadcrumbList;

  var _getBreadcrumbFromPro = getBreadcrumbFromProps(props),
      location = _getBreadcrumbFromPro.location,
      breadcrumbMap = _getBreadcrumbFromPro.breadcrumbMap;

  if (breadcrumbList && breadcrumbList.length) {
    return conversionFromProps(props);
  } // 根据 location 生成 面包屑
  // Generate breadcrumbs based on location


  if (location && location.pathname && breadcrumbMap) {
    return conversionFromLocation(location, breadcrumbMap, props);
  }

  return [];
}; // use breadcrumbRender to change routes

export var getBreadcrumbProps = function getBreadcrumbProps(props) {
  var breadcrumbRender = props.breadcrumbRender,
      propsItemRender = props.itemRender;
  var routesArray = genBreadcrumbProps(props);
  var itemRender = propsItemRender || defaultItemRender;
  var routes = routesArray; // if routes.length =1, don't show it

  if (breadcrumbRender) {
    routes = breadcrumbRender(routes) || [];
  }

  if (routes && routes.length < 2) {
    routes = undefined;
  }

  return {
    routes: routes,
    itemRender: itemRender
  };
};