"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDocumentTitle = useDocumentTitle;

var _react = require("react");

var _utils = require("./utils");

var _defaultSettings = _interopRequireDefault(require("../defaultSettings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useDocumentTitle(titleInfo) {
  var appDefaultTitle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defaultSettings.default.title;
  var titleText = typeof titleInfo.pageName === 'string' ? titleInfo.title : appDefaultTitle;
  (0, _react.useEffect)(function () {
    if ((0, _utils.isBrowser)() && titleText) {
      document.title = titleText;
    }
  }, [titleInfo.title]);
}