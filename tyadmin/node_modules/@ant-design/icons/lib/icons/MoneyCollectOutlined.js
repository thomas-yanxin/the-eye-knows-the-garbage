"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _MoneyCollectOutlined = _interopRequireDefault(require("@ant-design/icons-svg/lib/asn/MoneyCollectOutlined"));

var _AntdIcon = _interopRequireDefault(require("../components/AntdIcon"));

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY
var MoneyCollectOutlined = function MoneyCollectOutlined(props, ref) {
  return React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _MoneyCollectOutlined.default
  }));
};

MoneyCollectOutlined.displayName = 'MoneyCollectOutlined';

var _default = React.forwardRef(MoneyCollectOutlined);

exports.default = _default;