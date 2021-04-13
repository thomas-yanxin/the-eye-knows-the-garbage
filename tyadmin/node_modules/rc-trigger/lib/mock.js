"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _index = require("./index");

var MockPortal = function MockPortal(_ref) {
  var didUpdate = _ref.didUpdate,
      children = _ref.children,
      getContainer = _ref.getContainer;

  _react.default.useEffect(function () {
    didUpdate();
    getContainer();
  });

  return children;
};

var _default = (0, _index.generateTrigger)(MockPortal);

exports.default = _default;