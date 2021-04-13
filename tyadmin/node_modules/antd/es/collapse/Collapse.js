import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import * as React from 'react';
import RcCollapse from 'rc-collapse';
import classNames from 'classnames';
import RightOutlined from '@ant-design/icons/RightOutlined';
import CollapsePanel from './CollapsePanel';
import { ConfigContext } from '../config-provider';
import animation from '../_util/openAnimation';
import { cloneElement } from '../_util/reactNode';

var Collapse = function Collapse(props) {
  var _classNames;

  var _React$useContext = React.useContext(ConfigContext),
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
    var icon = expandIcon ? expandIcon(panelProps) : /*#__PURE__*/React.createElement(RightOutlined, {
      rotate: panelProps.isActive ? 90 : undefined
    });
    return cloneElement(icon, function () {
      return {
        className: classNames(icon.props.className, "".concat(prefixCls, "-arrow"))
      };
    });
  };

  var iconPosition = getIconPosition();
  var collapseClassName = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-borderless"), !bordered), _defineProperty(_classNames, "".concat(prefixCls, "-icon-position-").concat(iconPosition), true), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _defineProperty(_classNames, "".concat(prefixCls, "-ghost"), !!ghost), _classNames), className);

  var openAnimation = _extends(_extends({}, animation), {
    appear: function appear() {}
  });

  return /*#__PURE__*/React.createElement(RcCollapse, _extends({
    openAnimation: openAnimation
  }, props, {
    expandIcon: function expandIcon(panelProps) {
      return renderExpandIcon(panelProps);
    },
    prefixCls: prefixCls,
    className: collapseClassName
  }));
};

Collapse.Panel = CollapsePanel;
Collapse.defaultProps = {
  bordered: true
};
export default Collapse;