import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import * as React from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../config-provider';
import { cloneElement } from '../_util/reactNode';

function getNumberArray(num) {
  return num ? num.toString().split('').reverse().map(function (i) {
    var current = Number(i);
    return isNaN(current) ? i : current;
  }) : [];
}

function renderNumberList(position, className) {
  var childrenToReturn = [];

  for (var i = 0; i < 30; i++) {
    childrenToReturn.push( /*#__PURE__*/React.createElement("p", {
      key: i.toString(),
      className: classNames(className, {
        current: position === i
      })
    }, i % 10));
  }

  return childrenToReturn;
}

var ScrollNumber = function ScrollNumber(_a) {
  var customizePrefixCls = _a.prefixCls,
      customizeCount = _a.count,
      className = _a.className,
      style = _a.style,
      title = _a.title,
      _a$component = _a.component,
      component = _a$component === void 0 ? 'sup' : _a$component,
      displayComponent = _a.displayComponent,
      _a$onAnimated = _a.onAnimated,
      onAnimated = _a$onAnimated === void 0 ? function () {} : _a$onAnimated,
      restProps = __rest(_a, ["prefixCls", "count", "className", "style", "title", "component", "displayComponent", "onAnimated"]);

  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      animateStarted = _React$useState2[0],
      setAnimateStarted = _React$useState2[1];

  var _React$useState3 = React.useState(customizeCount),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      count = _React$useState4[0],
      setCount = _React$useState4[1];

  var _React$useState5 = React.useState(customizeCount),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      prevCount = _React$useState6[0],
      setPrevCount = _React$useState6[1];

  var _React$useState7 = React.useState(customizeCount),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      lastCount = _React$useState8[0],
      setLastCount = _React$useState8[1];

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls;

  var prefixCls = getPrefixCls('scroll-number', customizePrefixCls);

  if (prevCount !== customizeCount) {
    setAnimateStarted(true);
    setPrevCount(customizeCount);
  }

  React.useEffect(function () {
    setLastCount(count);
    var timeout;

    if (animateStarted) {
      // Let browser has time to reset the scroller before actually
      // performing the transition.
      timeout = setTimeout(function () {
        setAnimateStarted(false);
        setCount(customizeCount);
        onAnimated();
      });
    }

    return function () {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [animateStarted, customizeCount, onAnimated]);

  var getPositionByNum = function getPositionByNum(num, i) {
    var currentCount = Math.abs(Number(count));
    var lstCount = Math.abs(Number(lastCount));
    var currentDigit = Math.abs(getNumberArray(count)[i]);
    var lastDigit = Math.abs(getNumberArray(lstCount)[i]);

    if (animateStarted) {
      return 10 + num;
    } // 同方向则在同一侧切换数字


    if (currentCount > lstCount) {
      if (currentDigit >= lastDigit) {
        return 10 + num;
      }

      return 20 + num;
    }

    if (currentDigit <= lastDigit) {
      return 10 + num;
    }

    return num;
  };

  var renderCurrentNumber = function renderCurrentNumber(num, i) {
    if (typeof num === 'number') {
      var position = getPositionByNum(num, i);
      var removeTransition = animateStarted || getNumberArray(lastCount)[i] === undefined;
      return /*#__PURE__*/React.createElement('span', {
        className: "".concat(prefixCls, "-only"),
        style: {
          transition: removeTransition ? 'none' : undefined,
          msTransform: "translateY(".concat(-position * 100, "%)"),
          WebkitTransform: "translateY(".concat(-position * 100, "%)"),
          transform: "translateY(".concat(-position * 100, "%)")
        },
        key: i
      }, renderNumberList(position, "".concat(prefixCls, "-only-unit")));
    }

    return /*#__PURE__*/React.createElement("span", {
      key: "symbol",
      className: "".concat(prefixCls, "-symbol")
    }, num);
  };

  var renderNumberElement = function renderNumberElement() {
    if (count && Number(count) % 1 === 0) {
      return getNumberArray(count).map(function (num, i) {
        return renderCurrentNumber(num, i);
      }).reverse();
    }

    return count;
  };

  var newProps = _extends(_extends({}, restProps), {
    style: style,
    className: classNames(prefixCls, className),
    title: title
  }); // allow specify the border
  // mock border-color by box-shadow for compatible with old usage:
  // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />


  if (style && style.borderColor) {
    newProps.style = _extends(_extends({}, style), {
      boxShadow: "0 0 0 1px ".concat(style.borderColor, " inset")
    });
  }

  if (displayComponent) {
    return cloneElement(displayComponent, {
      className: classNames("".concat(prefixCls, "-custom-component"), displayComponent.props && displayComponent.props.className)
    });
  }

  return /*#__PURE__*/React.createElement(component, newProps, renderNumberElement());
};

export default ScrollNumber;