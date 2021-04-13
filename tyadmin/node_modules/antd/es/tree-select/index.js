import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _createSuper from "@babel/runtime/helpers/createSuper";
import * as React from 'react';
import RcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from 'rc-tree-select';
import classNames from 'classnames';
import omit from 'omit.js';
import { ConfigConsumer } from '../config-provider';
import devWarning from '../_util/devWarning';
import getIcons from '../select/utils/iconUtil';
import renderSwitcherIcon from '../tree/utils/iconUtil';
import SizeContext from '../config-provider/SizeContext';

var TreeSelect = /*#__PURE__*/function (_React$Component) {
  _inherits(TreeSelect, _React$Component);

  var _super = _createSuper(TreeSelect);

  function TreeSelect(props) {
    var _this;

    _classCallCheck(this, TreeSelect);

    _this = _super.call(this, props);
    _this.selectRef = /*#__PURE__*/React.createRef();

    _this.renderTreeSelect = function (_ref) {
      var getContextPopupContainer = _ref.getPopupContainer,
          getPrefixCls = _ref.getPrefixCls,
          renderEmpty = _ref.renderEmpty,
          direction = _ref.direction,
          virtual = _ref.virtual,
          dropdownMatchSelectWidth = _ref.dropdownMatchSelectWidth;
      var _this$props = _this.props,
          customizePrefixCls = _this$props.prefixCls,
          customizeSize = _this$props.size,
          className = _this$props.className,
          treeCheckable = _this$props.treeCheckable,
          multiple = _this$props.multiple,
          _this$props$listHeigh = _this$props.listHeight,
          listHeight = _this$props$listHeigh === void 0 ? 256 : _this$props$listHeigh,
          _this$props$listItemH = _this$props.listItemHeight,
          listItemHeight = _this$props$listItemH === void 0 ? 26 : _this$props$listItemH,
          notFoundContent = _this$props.notFoundContent,
          _switcherIcon = _this$props.switcherIcon,
          treeLine = _this$props.treeLine,
          getPopupContainer = _this$props.getPopupContainer,
          dropdownClassName = _this$props.dropdownClassName,
          bordered = _this$props.bordered,
          _this$props$treeIcon = _this$props.treeIcon,
          treeIcon = _this$props$treeIcon === void 0 ? false : _this$props$treeIcon;
      var prefixCls = getPrefixCls('select', customizePrefixCls);
      var treePrefixCls = getPrefixCls('select-tree', customizePrefixCls);
      var treeSelectPrefixCls = getPrefixCls('tree-select', customizePrefixCls);
      var mergedDropdownClassName = classNames(dropdownClassName, "".concat(treeSelectPrefixCls, "-dropdown"), _defineProperty({}, "".concat(treeSelectPrefixCls, "-dropdown-rtl"), direction === 'rtl'));
      var isMultiple = !!(treeCheckable || multiple); // ===================== Icons =====================

      var _getIcons = getIcons(_extends(_extends({}, _this.props), {
        multiple: isMultiple,
        prefixCls: prefixCls
      })),
          suffixIcon = _getIcons.suffixIcon,
          itemIcon = _getIcons.itemIcon,
          removeIcon = _getIcons.removeIcon,
          clearIcon = _getIcons.clearIcon; // ===================== Empty =====================


      var mergedNotFound;

      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent;
      } else {
        mergedNotFound = renderEmpty('Select');
      } // ==================== Render =====================


      var selectProps = omit(_this.props, ['prefixCls', 'suffixIcon', 'itemIcon', 'removeIcon', 'clearIcon', 'switcherIcon', 'size', 'bordered']);
      return /*#__PURE__*/React.createElement(SizeContext.Consumer, null, function (size) {
        var _classNames2;

        var mergedSize = customizeSize || size;
        var mergedClassName = classNames(!customizePrefixCls && treeSelectPrefixCls, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-lg"), mergedSize === 'large'), _defineProperty(_classNames2, "".concat(prefixCls, "-sm"), mergedSize === 'small'), _defineProperty(_classNames2, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _defineProperty(_classNames2, "".concat(prefixCls, "-borderless"), !bordered), _classNames2), className);
        return /*#__PURE__*/React.createElement(RcTreeSelect, _extends({
          virtual: virtual,
          dropdownMatchSelectWidth: dropdownMatchSelectWidth
        }, selectProps, {
          ref: _this.selectRef,
          prefixCls: prefixCls,
          className: mergedClassName,
          listHeight: listHeight,
          listItemHeight: listItemHeight,
          treeCheckable: treeCheckable ? /*#__PURE__*/React.createElement("span", {
            className: "".concat(prefixCls, "-tree-checkbox-inner")
          }) : treeCheckable,
          inputIcon: suffixIcon,
          menuItemSelectedIcon: itemIcon,
          removeIcon: removeIcon,
          clearIcon: clearIcon,
          switcherIcon: function switcherIcon(nodeProps) {
            return renderSwitcherIcon(treePrefixCls, _switcherIcon, treeLine, nodeProps);
          },
          showTreeIcon: treeIcon,
          notFoundContent: mergedNotFound,
          getPopupContainer: getPopupContainer || getContextPopupContainer,
          treeMotion: null,
          dropdownClassName: mergedDropdownClassName
        }));
      });
    };

    devWarning(props.multiple !== false || !props.treeCheckable, 'TreeSelect', '`multiple` will alway be `true` when `treeCheckable` is true');
    return _this;
  }

  _createClass(TreeSelect, [{
    key: "focus",
    value: function focus() {
      if (this.selectRef.current) {
        this.selectRef.current.focus();
      }
    }
  }, {
    key: "blur",
    value: function blur() {
      if (this.selectRef.current) {
        this.selectRef.current.blur();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(ConfigConsumer, null, this.renderTreeSelect);
    }
  }]);

  return TreeSelect;
}(React.Component);

TreeSelect.TreeNode = TreeNode;
TreeSelect.SHOW_ALL = SHOW_ALL;
TreeSelect.SHOW_PARENT = SHOW_PARENT;
TreeSelect.SHOW_CHILD = SHOW_CHILD;
TreeSelect.defaultProps = {
  transitionName: 'slide-up',
  choiceTransitionName: '',
  bordered: true
};
export { TreeNode };
export default TreeSelect;