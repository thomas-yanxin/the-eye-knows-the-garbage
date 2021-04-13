"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _uiUtil = require("../../utils/uiUtil");

var _PanelContext = _interopRequireDefault(require("../../PanelContext"));

function TimeUnitColumn(props) {
  var prefixCls = props.prefixCls,
      units = props.units,
      onSelect = props.onSelect,
      value = props.value,
      active = props.active,
      hideDisabledOptions = props.hideDisabledOptions;
  var cellPrefixCls = "".concat(prefixCls, "-cell");

  var _React$useContext = React.useContext(_PanelContext.default),
      open = _React$useContext.open;

  var ulRef = React.useRef(null);
  var liRefs = React.useRef(new Map()); // `useLayoutEffect` here to avoid blink by duration is 0

  React.useLayoutEffect(function () {
    var li = liRefs.current.get(value);

    if (li && open !== false) {
      (0, _uiUtil.scrollTo)(ulRef.current, li.offsetTop, 120);
    }
  }, [value]);
  React.useLayoutEffect(function () {
    if (open) {
      var li = liRefs.current.get(value);

      if (li) {
        (0, _uiUtil.scrollTo)(ulRef.current, li.offsetTop, 0);
      }
    }
  }, [open]);
  return React.createElement("ul", {
    className: (0, _classnames.default)("".concat(prefixCls, "-column"), (0, _defineProperty2.default)({}, "".concat(prefixCls, "-column-active"), active)),
    ref: ulRef,
    style: {
      position: 'relative'
    }
  }, units.map(function (unit) {
    var _classNames2;

    if (hideDisabledOptions && unit.disabled) {
      return null;
    }

    return React.createElement("li", {
      key: unit.value,
      ref: function ref(element) {
        liRefs.current.set(unit.value, element);
      },
      className: (0, _classnames.default)(cellPrefixCls, (_classNames2 = {}, (0, _defineProperty2.default)(_classNames2, "".concat(cellPrefixCls, "-disabled"), unit.disabled), (0, _defineProperty2.default)(_classNames2, "".concat(cellPrefixCls, "-selected"), value === unit.value), _classNames2)),
      onClick: function onClick() {
        if (unit.disabled) {
          return;
        }

        onSelect(unit.value);
      }
    }, React.createElement("div", {
      className: "".concat(cellPrefixCls, "-inner")
    }, unit.label));
  }));
}

var _default = TimeUnitColumn;
exports.default = _default;