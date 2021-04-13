"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _ref2 = require("rc-util/lib/ref");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Input = function Input(_ref, ref) {
  var prefixCls = _ref.prefixCls,
      id = _ref.id,
      inputElement = _ref.inputElement,
      disabled = _ref.disabled,
      tabIndex = _ref.tabIndex,
      autoFocus = _ref.autoFocus,
      autoComplete = _ref.autoComplete,
      editable = _ref.editable,
      accessibilityIndex = _ref.accessibilityIndex,
      value = _ref.value,
      _onKeyDown = _ref.onKeyDown,
      _onMouseDown = _ref.onMouseDown,
      _onChange = _ref.onChange,
      onPaste = _ref.onPaste,
      _onCompositionStart = _ref.onCompositionStart,
      _onCompositionEnd = _ref.onCompositionEnd,
      open = _ref.open,
      attrs = _ref.attrs;

  var inputNode = inputElement || _react.default.createElement("input", null);

  var _inputNode = inputNode,
      originRef = _inputNode.ref,
      _inputNode$props = _inputNode.props,
      onOriginKeyDown = _inputNode$props.onKeyDown,
      onOriginChange = _inputNode$props.onChange,
      onOriginMouseDown = _inputNode$props.onMouseDown,
      onOriginCompositionStart = _inputNode$props.onCompositionStart,
      onOriginCompositionEnd = _inputNode$props.onCompositionEnd,
      style = _inputNode$props.style;
  inputNode = _react.default.cloneElement(inputNode, _objectSpread(_objectSpread({
    id: id,
    ref: (0, _ref2.composeRef)(ref, originRef),
    disabled: disabled,
    tabIndex: tabIndex,
    autoComplete: autoComplete || 'off',
    autoFocus: autoFocus,
    className: "".concat(prefixCls, "-selection-search-input"),
    style: _objectSpread(_objectSpread({}, style), {}, {
      opacity: editable ? null : 0
    }),
    role: 'combobox',
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
    'aria-owns': "".concat(id, "_list"),
    'aria-autocomplete': 'list',
    'aria-controls': "".concat(id, "_list"),
    'aria-activedescendant': "".concat(id, "_list_").concat(accessibilityIndex)
  }, attrs), {}, {
    value: editable ? value : '',
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,
    onKeyDown: function onKeyDown(event) {
      _onKeyDown(event);

      if (onOriginKeyDown) {
        onOriginKeyDown(event);
      }
    },
    onMouseDown: function onMouseDown(event) {
      _onMouseDown(event);

      if (onOriginMouseDown) {
        onOriginMouseDown(event);
      }
    },
    onChange: function onChange(event) {
      _onChange(event);

      if (onOriginChange) {
        onOriginChange(event);
      }
    },
    onCompositionStart: function onCompositionStart(event) {
      _onCompositionStart(event);

      if (onOriginCompositionStart) {
        onOriginCompositionStart(event);
      }
    },
    onCompositionEnd: function onCompositionEnd(event) {
      _onCompositionEnd(event);

      if (onOriginCompositionEnd) {
        onOriginCompositionEnd(event);
      }
    },
    onPaste: onPaste
  }));
  return inputNode;
};

var RefInput = _react.default.forwardRef(Input);

RefInput.displayName = 'Input';
var _default = RefInput;
exports.default = _default;