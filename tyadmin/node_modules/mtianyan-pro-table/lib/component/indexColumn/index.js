"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _context = require("antd/lib/config-provider/context");

require("./index.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 默认的 index 列容器，提供一个好看的 index
 * @param param0
 */
var IndexColumn = function IndexColumn(_ref) {
  var _ref$border = _ref.border,
      border = _ref$border === void 0 ? false : _ref$border,
      children = _ref.children;
  return _react.default.createElement(_context.ConfigConsumer, null, function (_ref2) {
    var _classnames;

    var getPrefixCls = _ref2.getPrefixCls;
    var className = getPrefixCls('pro-table-index-column');
    return _react.default.createElement("div", {
      className: (0, _classnames2.default)(className, (_classnames = {}, _defineProperty(_classnames, "".concat(className, "-border"), border), _defineProperty(_classnames, 'top-three', children > 2), _classnames))
    }, children);
  });
};

var _default = IndexColumn;
exports.default = _default;