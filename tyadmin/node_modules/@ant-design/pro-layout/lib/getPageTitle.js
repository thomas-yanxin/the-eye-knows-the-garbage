"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getPageTitleInfo = exports.matchParamsPath = void 0;

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var matchParamsPath = function matchParamsPath(pathname, breadcrumb, breadcrumbMap) {
  // Internal logic use breadcrumbMap to ensure the order
  // 内部逻辑使用 breadcrumbMap 来确保查询顺序
  if (breadcrumbMap) {
    var pathKey = _toConsumableArray(breadcrumbMap.keys()).find(function (key) {
      return (0, _pathToRegexp.default)(key).test(pathname);
    });

    if (pathKey) {
      return breadcrumbMap.get(pathKey);
    }
  } // External uses use breadcrumb
  // 外部用户使用 breadcrumb 参数


  if (breadcrumb) {
    var _pathKey = Object.keys(breadcrumb).find(function (key) {
      return (0, _pathToRegexp.default)(key).test(pathname);
    });

    if (_pathKey) {
      return breadcrumb[_pathKey];
    }
  }

  return {
    path: ''
  };
};

exports.matchParamsPath = matchParamsPath;

var getPageTitle = function getPageTitle(props, ignoreTile) {
  var _props$pathname = props.pathname,
      pathname = _props$pathname === void 0 ? '/' : _props$pathname,
      breadcrumb = props.breadcrumb,
      breadcrumbMap = props.breadcrumbMap,
      formatMessage = props.formatMessage,
      _props$title = props.title,
      title = _props$title === void 0 ? 'Ant Design Pro' : _props$title,
      _props$menu = props.menu,
      menu = _props$menu === void 0 ? {
    locale: false
  } : _props$menu;
  var pageTitle = ignoreTile ? '' : title;

  if (!pathname) {
    return pageTitle;
  }

  var currRouterData = matchParamsPath(pathname, breadcrumb, breadcrumbMap);

  if (!currRouterData) {
    return pageTitle;
  }

  var pageName = currRouterData.name;

  if (menu.locale !== false && currRouterData.locale && formatMessage) {
    pageName = formatMessage({
      id: currRouterData.locale || '',
      defaultMessage: currRouterData.name
    });
  }

  if (!pageName) {
    return pageTitle;
  }

  if (ignoreTile) {
    return pageName;
  }

  return "".concat(pageName, " - ").concat(title);
};
/**
 * 获取关于 pageTile 的所有信息方便包装
 * @param props
 * @param ignoreTile
 */


var getPageTitleInfo = function getPageTitleInfo(props, ignoreTile) {
  var _props$pathname2 = props.pathname,
      pathname = _props$pathname2 === void 0 ? '/' : _props$pathname2,
      breadcrumb = props.breadcrumb,
      breadcrumbMap = props.breadcrumbMap,
      formatMessage = props.formatMessage,
      _props$title2 = props.title,
      title = _props$title2 === void 0 ? 'Ant Design Pro' : _props$title2,
      _props$menu2 = props.menu,
      menu = _props$menu2 === void 0 ? {
    locale: false
  } : _props$menu2;
  var pageTitle = ignoreTile ? '' : title;

  if (!pathname) {
    return {
      title: pageTitle,
      id: '',
      pageName: pageTitle
    };
  }

  var currRouterData = matchParamsPath(pathname, breadcrumb, breadcrumbMap);

  if (!currRouterData) {
    return {
      title: pageTitle,
      id: '',
      pageName: pageTitle
    };
  }

  var pageName = currRouterData.name;

  if (menu.locale !== false && currRouterData.locale && formatMessage) {
    pageName = formatMessage({
      id: currRouterData.locale || '',
      defaultMessage: currRouterData.name
    });
  }

  if (!pageName) {
    return {
      title: pageTitle,
      id: currRouterData.locale || '',
      pageName: pageTitle
    };
  }

  if (ignoreTile) {
    return {
      title: pageName,
      id: currRouterData.locale || '',
      pageName: pageName
    };
  }

  return {
    title: "".concat(pageName, " - ").concat(title),
    id: currRouterData.locale || '',
    pageName: pageName
  };
};

exports.getPageTitleInfo = getPageTitleInfo;
var _default = getPageTitle;
exports.default = _default;