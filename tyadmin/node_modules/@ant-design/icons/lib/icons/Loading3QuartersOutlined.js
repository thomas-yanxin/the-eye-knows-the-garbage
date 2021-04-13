"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _Loading3QuartersOutlined = _interopRequireDefault(require("@ant-design/icons-svg/lib/asn/Loading3QuartersOutlined"));

var _AntdIcon = _interopRequireDefault(require("../components/AntdIcon"));

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY
var Loading3QuartersOutlined = function Loading3QuartersOutlined(props, ref) {
  return React.createElement(_AntdIcon.default, Object.assign({}, props, {
    ref: ref,
    icon: _Loading3QuartersOutlined.default
  }));
};

Loading3QuartersOutlined.displayName = 'Loading3QuartersOutlined';

var _default = React.forwardRef(Loading3QuartersOutlined);

exports.default = _default;