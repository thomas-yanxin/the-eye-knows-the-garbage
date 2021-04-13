"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BasicLayout", {
  enumerable: true,
  get: function get() {
    return _BasicLayout.default;
  }
});
Object.defineProperty(exports, "DefaultHeader", {
  enumerable: true,
  get: function get() {
    return _Header.default;
  }
});
Object.defineProperty(exports, "TopNavHeader", {
  enumerable: true,
  get: function get() {
    return _TopNavHeader.default;
  }
});
Object.defineProperty(exports, "SettingDrawer", {
  enumerable: true,
  get: function get() {
    return _SettingDrawer.default;
  }
});
Object.defineProperty(exports, "DefaultFooter", {
  enumerable: true,
  get: function get() {
    return _Footer.default;
  }
});
Object.defineProperty(exports, "GridContent", {
  enumerable: true,
  get: function get() {
    return _GridContent.default;
  }
});
Object.defineProperty(exports, "PageContainer", {
  enumerable: true,
  get: function get() {
    return _PageContainer.default;
  }
});
Object.defineProperty(exports, "RouteContext", {
  enumerable: true,
  get: function get() {
    return _RouteContext.default;
  }
});
Object.defineProperty(exports, "getMenuData", {
  enumerable: true,
  get: function get() {
    return _getMenuData.default;
  }
});
Object.defineProperty(exports, "getPageTitle", {
  enumerable: true,
  get: function get() {
    return _getPageTitle.default;
  }
});
Object.defineProperty(exports, "PageLoading", {
  enumerable: true,
  get: function get() {
    return _PageLoading.default;
  }
});
Object.defineProperty(exports, "FooterToolbar", {
  enumerable: true,
  get: function get() {
    return _FooterToolbar.default;
  }
});
exports.default = exports.PageHeaderWrapper = void 0;

var _BasicLayout = _interopRequireDefault(require("./BasicLayout"));

var _Header = _interopRequireDefault(require("./Header"));

var _TopNavHeader = _interopRequireDefault(require("./TopNavHeader"));

var _SettingDrawer = _interopRequireDefault(require("./SettingDrawer"));

var _Footer = _interopRequireDefault(require("./Footer"));

var _GridContent = _interopRequireDefault(require("./GridContent"));

var _PageContainer = _interopRequireDefault(require("./PageContainer"));

var _RouteContext = _interopRequireDefault(require("./RouteContext"));

var _getMenuData = _interopRequireDefault(require("./utils/getMenuData"));

var _getPageTitle = _interopRequireDefault(require("./getPageTitle"));

var _PageLoading = _interopRequireDefault(require("./PageLoading"));

var _FooterToolbar = _interopRequireDefault(require("./FooterToolbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageHeaderWrapper = _PageContainer.default;
exports.PageHeaderWrapper = PageHeaderWrapper;
var _default = _BasicLayout.default;
exports.default = _default;