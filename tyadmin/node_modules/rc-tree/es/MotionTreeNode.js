import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import * as React from 'react';
import classNames from 'classnames'; // @ts-ignore

import CSSMotion from "rc-animate/es/CSSMotion";
import TreeNode from './TreeNode';
import { getTreeNodeProps } from './utils/treeUtil';
import { TreeContext } from './contextTypes';

var MotionTreeNode = function MotionTreeNode(_ref, ref) {
  var className = _ref.className,
      style = _ref.style,
      motion = _ref.motion,
      motionNodes = _ref.motionNodes,
      motionType = _ref.motionType,
      onOriginMotionEnd = _ref.onMotionEnd,
      active = _ref.active,
      treeNodeRequiredProps = _ref.treeNodeRequiredProps,
      props = _objectWithoutProperties(_ref, ["className", "style", "motion", "motionNodes", "motionType", "onMotionEnd", "active", "treeNodeRequiredProps"]);

  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      visible = _React$useState2[0],
      setVisible = _React$useState2[1];

  var _React$useContext = React.useContext(TreeContext),
      prefixCls = _React$useContext.prefixCls;

  var motionedRef = React.useRef(false);

  var onMotionEnd = function onMotionEnd() {
    if (!motionedRef.current) {
      onOriginMotionEnd();
    }

    motionedRef.current = true;
  };

  React.useEffect(function () {
    if (motionNodes && motionType === 'hide' && visible) {
      setVisible(false);
    }
  }, [motionNodes]);
  React.useEffect(function () {
    return function () {
      if (motionNodes) {
        onMotionEnd();
      }
    };
  }, []);

  if (motionNodes) {
    return React.createElement(CSSMotion, Object.assign({
      ref: ref,
      visible: visible
    }, motion, {
      motionAppear: motionType === 'show',
      onAppearEnd: onMotionEnd,
      onLeaveEnd: onMotionEnd
    }), function (_ref2, motionRef) {
      var motionClassName = _ref2.className,
          motionStyle = _ref2.style;
      return React.createElement("div", {
        ref: motionRef,
        className: classNames("".concat(prefixCls, "-treenode-motion"), motionClassName),
        style: motionStyle
      }, motionNodes.map(function (treeNode) {
        var _treeNode$data = treeNode.data,
            key = _treeNode$data.key,
            restProps = _objectWithoutProperties(_treeNode$data, ["key"]),
            isStart = treeNode.isStart,
            isEnd = treeNode.isEnd;

        delete restProps.children;
        var treeNodeProps = getTreeNodeProps(key, treeNodeRequiredProps);
        return React.createElement(TreeNode, Object.assign({}, restProps, treeNodeProps, {
          active: active,
          data: treeNode.data,
          key: key,
          isStart: isStart,
          isEnd: isEnd
        }));
      }));
    });
  }

  return React.createElement(TreeNode, Object.assign({
    domRef: ref,
    className: className,
    style: style
  }, props, {
    active: active
  }));
};

MotionTreeNode.displayName = 'MotionTreeNode';
var RefMotionTreeNode = React.forwardRef(MotionTreeNode);
export default RefMotionTreeNode;