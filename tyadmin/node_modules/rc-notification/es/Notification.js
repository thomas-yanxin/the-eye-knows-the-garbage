import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import createChainedFunction from "rc-util/es/createChainedFunction";
import classnames from 'classnames';
import Notice from './Notice';
import _useNotification from './useNotification';
var seed = 0;
var now = Date.now();

function getUuid() {
  var id = seed;
  seed += 1;
  return "rcNotification_".concat(now, "_").concat(id);
}

var Notification = /*#__PURE__*/function (_Component) {
  _inherits(Notification, _Component);

  var _super = _createSuper(Notification);

  function Notification() {
    var _this;

    _classCallCheck(this, Notification);

    _this = _super.apply(this, arguments);
    _this.state = {
      notices: []
    };
    _this.hookRefs = new Map();

    _this.add = function (notice, holderCallback) {
      // eslint-disable-next-line no-param-reassign
      notice.key = notice.key || getUuid();
      var key = notice.key;
      var maxCount = _this.props.maxCount;

      _this.setState(function (previousState) {
        var notices = previousState.notices;
        var noticeIndex = notices.map(function (v) {
          return v.notice.key;
        }).indexOf(key);
        var updatedNotices = notices.concat();

        if (noticeIndex !== -1) {
          updatedNotices.splice(noticeIndex, 1, {
            notice: notice,
            holderCallback: holderCallback
          });
        } else {
          if (maxCount && notices.length >= maxCount) {
            // XXX, use key of first item to update new added (let React to move exsiting
            // instead of remove and mount). Same key was used before for both a) external
            // manual control and b) internal react 'key' prop , which is not that good.
            // eslint-disable-next-line no-param-reassign
            notice.updateKey = updatedNotices[0].notice.updateKey || updatedNotices[0].notice.key;
            updatedNotices.shift();
          }

          updatedNotices.push({
            notice: notice,
            holderCallback: holderCallback
          });
        }

        return {
          notices: updatedNotices
        };
      });
    };

    _this.remove = function (key) {
      _this.setState(function (previousState) {
        return {
          notices: previousState.notices.filter(function (_ref) {
            var notice = _ref.notice;
            return notice.key !== key;
          })
        };
      });
    };

    return _this;
  }

  _createClass(Notification, [{
    key: "getTransitionName",
    value: function getTransitionName() {
      var _this$props = this.props,
          prefixCls = _this$props.prefixCls,
          animation = _this$props.animation;
      var transitionName = this.props.transitionName;

      if (!transitionName && animation) {
        transitionName = "".concat(prefixCls, "-").concat(animation);
      }

      return transitionName;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var notices = this.state.notices;
      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          className = _this$props2.className,
          closeIcon = _this$props2.closeIcon,
          style = _this$props2.style;
      var noticeNodes = notices.map(function (_ref2, index) {
        var notice = _ref2.notice,
            holderCallback = _ref2.holderCallback;
        var update = Boolean(index === notices.length - 1 && notice.updateKey);
        var key = notice.updateKey ? notice.updateKey : notice.key;
        var onClose = createChainedFunction(_this2.remove.bind(_this2, notice.key), notice.onClose);

        var noticeProps = _objectSpread(_objectSpread(_objectSpread({
          prefixCls: prefixCls,
          closeIcon: closeIcon
        }, notice), notice.props), {}, {
          key: key,
          update: update,
          onClose: onClose,
          onClick: notice.onClick,
          children: notice.content
        });

        if (holderCallback) {
          return React.createElement("div", {
            key: key,
            className: "".concat(prefixCls, "-hook-holder"),
            ref: function ref(div) {
              if (typeof key === 'undefined') {
                return;
              }

              if (div) {
                _this2.hookRefs.set(key, div);

                holderCallback(div, noticeProps);
              } else {
                _this2.hookRefs.delete(key);
              }
            }
          });
        }

        return React.createElement(Notice, Object.assign({}, noticeProps));
      });
      return React.createElement("div", {
        className: classnames(prefixCls, className),
        style: style
      }, React.createElement(Animate, {
        transitionName: this.getTransitionName()
      }, noticeNodes));
    }
  }]);

  return Notification;
}(Component);

Notification.defaultProps = {
  prefixCls: 'rc-notification',
  animation: 'fade',
  style: {
    top: 65,
    left: '50%'
  }
};

Notification.newInstance = function newNotificationInstance(properties, callback) {
  var _ref3 = properties || {},
      getContainer = _ref3.getContainer,
      props = _objectWithoutProperties(_ref3, ["getContainer"]);

  var div = document.createElement('div');

  if (getContainer) {
    var root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  var called = false;

  function ref(notification) {
    if (called) {
      return;
    }

    called = true;
    callback({
      notice: function notice(noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice: function removeNotice(key) {
        notification.remove(key);
      },
      component: notification,
      destroy: function destroy() {
        ReactDOM.unmountComponentAtNode(div);

        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      },
      // Hooks
      useNotification: function useNotification() {
        return _useNotification(notification);
      }
    });
  } // Only used for test case usage


  if (process.env.NODE_ENV === 'test' && properties.TEST_RENDER) {
    properties.TEST_RENDER(React.createElement(Notification, Object.assign({}, props, {
      ref: ref
    })));
    return;
  }

  ReactDOM.render(React.createElement(Notification, Object.assign({}, props, {
    ref: ref
  })), div);
};

export default Notification;