'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.genCSSMotion = genCSSMotion;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _findDOMNode = require('rc-util/lib/Dom/findDOMNode');

var _findDOMNode2 = _interopRequireDefault(_findDOMNode);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _motion = require('./util/motion');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */


var STATUS_NONE = 'none';
var STATUS_APPEAR = 'appear';
var STATUS_ENTER = 'enter';
var STATUS_LEAVE = 'leave';

/**
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
function genCSSMotion(config) {
  var transitionSupport = config;
  var forwardRef = !!_react2['default'].forwardRef;

  if (typeof config === 'object') {
    transitionSupport = config.transitionSupport;
    forwardRef = 'forwardRef' in config ? config.forwardRef : forwardRef;
  }

  function isSupportTransition(props) {
    return !!(props.motionName && transitionSupport);
  }

  var CSSMotion = function (_React$Component) {
    _inherits(CSSMotion, _React$Component);

    function CSSMotion() {
      _classCallCheck(this, CSSMotion);

      var _this = _possibleConstructorReturn(this, (CSSMotion.__proto__ || Object.getPrototypeOf(CSSMotion)).call(this));

      _this.onDomUpdate = function () {
        var _this$state = _this.state,
            status = _this$state.status,
            newStatus = _this$state.newStatus;
        var _this$props = _this.props,
            onAppearStart = _this$props.onAppearStart,
            onEnterStart = _this$props.onEnterStart,
            onLeaveStart = _this$props.onLeaveStart,
            onAppearActive = _this$props.onAppearActive,
            onEnterActive = _this$props.onEnterActive,
            onLeaveActive = _this$props.onLeaveActive,
            motionAppear = _this$props.motionAppear,
            motionEnter = _this$props.motionEnter,
            motionLeave = _this$props.motionLeave;


        if (!isSupportTransition(_this.props)) {
          return;
        }

        // Event injection
        var $ele = _this.getElement();
        if (_this.$cacheEle !== $ele) {
          _this.removeEventListener(_this.$cacheEle);
          _this.addEventListener($ele);
          _this.$cacheEle = $ele;
        }

        // Init status
        if (newStatus && status === STATUS_APPEAR && motionAppear) {
          _this.updateStatus(onAppearStart, null, null, function () {
            _this.updateActiveStatus(onAppearActive, STATUS_APPEAR);
          });
        } else if (newStatus && status === STATUS_ENTER && motionEnter) {
          _this.updateStatus(onEnterStart, null, null, function () {
            _this.updateActiveStatus(onEnterActive, STATUS_ENTER);
          });
        } else if (newStatus && status === STATUS_LEAVE && motionLeave) {
          _this.updateStatus(onLeaveStart, null, null, function () {
            _this.updateActiveStatus(onLeaveActive, STATUS_LEAVE);
          });
        }
      };

      _this.onMotionEnd = function (event) {
        var _this$state2 = _this.state,
            status = _this$state2.status,
            statusActive = _this$state2.statusActive;
        var _this$props2 = _this.props,
            onAppearEnd = _this$props2.onAppearEnd,
            onEnterEnd = _this$props2.onEnterEnd,
            onLeaveEnd = _this$props2.onLeaveEnd;

        if (status === STATUS_APPEAR && statusActive) {
          _this.updateStatus(onAppearEnd, { status: STATUS_NONE }, event);
        } else if (status === STATUS_ENTER && statusActive) {
          _this.updateStatus(onEnterEnd, { status: STATUS_NONE }, event);
        } else if (status === STATUS_LEAVE && statusActive) {
          _this.updateStatus(onLeaveEnd, { status: STATUS_NONE }, event);
        }
      };

      _this.setNodeRef = function (node) {
        var internalRef = _this.props.internalRef;

        _this.node = node;

        if (typeof internalRef === 'function') {
          internalRef(node);
        } else if (internalRef && 'current' in internalRef) {
          internalRef.current = node;
        }
      };

      _this.getElement = function () {
        try {
          return (0, _findDOMNode2['default'])(_this.node || _this);
        } catch (e) {
          /**
           * Fallback to cache element.
           * This is only happen when `motionDeadline` trigger but element removed.
           */
          return _this.$cacheEle;
        }
      };

      _this.addEventListener = function ($ele) {
        if (!$ele) return;

        $ele.addEventListener(_motion.transitionEndName, _this.onMotionEnd);
        $ele.addEventListener(_motion.animationEndName, _this.onMotionEnd);
      };

      _this.removeEventListener = function ($ele) {
        if (!$ele) return;

        $ele.removeEventListener(_motion.transitionEndName, _this.onMotionEnd);
        $ele.removeEventListener(_motion.animationEndName, _this.onMotionEnd);
      };

      _this.updateStatus = function (styleFunc, additionalState, event, callback) {
        var statusStyle = styleFunc ? styleFunc(_this.getElement(), event) : null;

        if (statusStyle === false || _this._destroyed) return;

        var nextStep = void 0;
        if (callback) {
          nextStep = function nextStep() {
            _this.nextFrame(callback);
          };
        }

        _this.setState(_extends({
          statusStyle: typeof statusStyle === 'object' ? statusStyle : null,
          newStatus: false
        }, additionalState), nextStep); // Trigger before next frame & after `componentDidMount`
      };

      _this.updateActiveStatus = function (styleFunc, currentStatus) {
        // `setState` use `postMessage` to trigger at the end of frame.
        // Let's use requestAnimationFrame to update new state in next frame.
        _this.nextFrame(function () {
          var status = _this.state.status;

          if (status !== currentStatus) return;

          var motionDeadline = _this.props.motionDeadline;


          _this.updateStatus(styleFunc, { statusActive: true });

          if (motionDeadline > 0) {
            setTimeout(function () {
              _this.onMotionEnd({
                deadline: true
              });
            }, motionDeadline);
          }
        });
      };

      _this.nextFrame = function (func) {
        _this.cancelNextFrame();
        _this.raf = (0, _raf2['default'])(func);
      };

      _this.cancelNextFrame = function () {
        if (_this.raf) {
          _raf2['default'].cancel(_this.raf);
          _this.raf = null;
        }
      };

      _this.state = {
        status: STATUS_NONE,
        statusActive: false,
        newStatus: false,
        statusStyle: null
      };
      _this.$cacheEle = null;
      _this.node = null;
      _this.raf = null;
      return _this;
    }

    _createClass(CSSMotion, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.onDomUpdate();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.onDomUpdate();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._destroyed = true;
        this.removeEventListener(this.$cacheEle);
        this.cancelNextFrame();
      }
    }, {
      key: 'render',
      value: function render() {
        var _classNames;

        var _state = this.state,
            status = _state.status,
            statusActive = _state.statusActive,
            statusStyle = _state.statusStyle;
        var _props = this.props,
            children = _props.children,
            motionName = _props.motionName,
            visible = _props.visible,
            removeOnLeave = _props.removeOnLeave,
            leavedClassName = _props.leavedClassName,
            eventProps = _props.eventProps;


        if (!children) return null;

        if (status === STATUS_NONE || !isSupportTransition(this.props)) {
          if (visible) {
            return children(_extends({}, eventProps), this.setNodeRef);
          } else if (!removeOnLeave) {
            return children(_extends({}, eventProps, { className: leavedClassName }), this.setNodeRef);
          }

          return null;
        }

        return children(_extends({}, eventProps, {
          className: (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, (0, _motion.getTransitionName)(motionName, status), status !== STATUS_NONE), _defineProperty(_classNames, (0, _motion.getTransitionName)(motionName, status + '-active'), status !== STATUS_NONE && statusActive), _defineProperty(_classNames, motionName, typeof motionName === 'string'), _classNames)),
          style: statusStyle
        }), this.setNodeRef);
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(props, _ref) {
        var prevProps = _ref.prevProps,
            prevStatus = _ref.status;

        if (!isSupportTransition(props)) return {};

        var visible = props.visible,
            motionAppear = props.motionAppear,
            motionEnter = props.motionEnter,
            motionLeave = props.motionLeave,
            motionLeaveImmediately = props.motionLeaveImmediately;

        var newState = {
          prevProps: props
        };

        // Clean up status if prop set to false
        if (prevStatus === STATUS_APPEAR && !motionAppear || prevStatus === STATUS_ENTER && !motionEnter || prevStatus === STATUS_LEAVE && !motionLeave) {
          newState.status = STATUS_NONE;
          newState.statusActive = false;
          newState.newStatus = false;
        }

        // Appear
        if (!prevProps && visible && motionAppear) {
          newState.status = STATUS_APPEAR;
          newState.statusActive = false;
          newState.newStatus = true;
        }

        // Enter
        if (prevProps && !prevProps.visible && visible && motionEnter) {
          newState.status = STATUS_ENTER;
          newState.statusActive = false;
          newState.newStatus = true;
        }

        // Leave
        if (prevProps && prevProps.visible && !visible && motionLeave || !prevProps && motionLeaveImmediately && !visible && motionLeave) {
          newState.status = STATUS_LEAVE;
          newState.statusActive = false;
          newState.newStatus = true;
        }

        return newState;
      }
    }]);

    return CSSMotion;
  }(_react2['default'].Component);

  CSSMotion.defaultProps = {
    visible: true,
    motionEnter: true,
    motionAppear: true,
    motionLeave: true,
    removeOnLeave: true
  };


  if (!forwardRef) {
    return CSSMotion;
  }

  return _react2['default'].forwardRef(function (props, ref) {
    return _react2['default'].createElement(CSSMotion, _extends({ internalRef: ref }, props));
  });
}

exports['default'] = genCSSMotion(_motion.supportTransition);