"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _rcCollapse = _interopRequireDefault(require("rc-collapse"));

var _classnames = _interopRequireDefault(require("classnames"));

var _RightOutlined = _interopRequireDefault(require("@ant-design/icons/RightOutlined"));

var _CollapsePanel = _interopRequireDefault(require("./CollapsePanel"));

var _configProvider = require("../config-provider");

var _openAnimation = _interopRequireDefault(require("../_util/openAnimation"));

var _reactNode = require("../_util/reactNode");

var Collapse = function Collapse(props) {
  var _classNames;

  var _React$useContext = React.useContext(_configProvider.ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  var customizePrefixCls = props.prefixCls,
      _props$className = props.className,
      className = _props$className === void 0 ? '' : _props$className,
      bordered = props.bordered,
      ghost = props.ghost;
  var prefixCls = getPrefixCls('collapse', customizePrefixCls);

  var getIconPosition = function getIconPosition() {
    var expandIconPosition = props.expandIconPosition;

    if (expandIconPosition !== undefined) {
      return expandIconPosition;
    }

    return direction === 'rtl' ? 'right' : 'left';
  };

  var renderExpandIcon = function renderExpandIcon() {
    var panelProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var expandIcon = props.expandIcon;
    var icon = expandIcon ? expandIcon(panelProps) : /*#__PURE__*/React.createElement(_RightOutlined["default"], {
      rotate: panelProps.isActive ? 90 : undefined
    });
    return (0, _reactNode.cloneElement)(icon, function () {
      return {
        className: (0, _classnames["default"])(icon.props.className, "".concat(prefixCls, "-arrow"))
      };
    });
  };

  var iconPosition = getIconPosition();
  var collapseClassName = (0, _classnames["default"])((_classNames = {}, (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-borderless"), !bordered), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-icon-position-").concat(iconPosition), true), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-ghost"), !!ghost), _classNames), className);
  var openAnimation = (0, _extends2["default"])((0, _extends2["default"])({}, _openAnimation["default"]), {
    appear: function appear() {}
  });
  return /*#__PURE__*/React.createElement(_rcCollapse["default"], (0, _extends2["default"])({
    openAnimation: openAnimation
  }, props, {
    expandIcon: function expandIcon(panelProps) {
      return renderExpandIcon(panelProps);
    },
    prefixCls: prefixCls,
    className: collapseClassName
  }));
};

Collapse.Panel = _CollapsePanel["default"];
Collapse.defaultProps = {
  bordered: true
};
var _default = Collapse;
exports["default"] = _default;