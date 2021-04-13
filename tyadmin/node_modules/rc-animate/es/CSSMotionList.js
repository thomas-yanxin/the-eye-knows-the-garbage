var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/prop-types: 0 */
import React from 'react';
import OriginCSSMotion from './CSSMotion';
import { supportTransition } from './util/motion';
import { STATUS_ADD, STATUS_KEEP, STATUS_REMOVE, STATUS_REMOVED, diffKeys, parseKeys } from './util/diff';

var MOTION_PROP_NAMES = ['eventProps', 'visible', 'children', 'motionName', 'motionAppear', 'motionEnter', 'motionLeave', 'motionLeaveImmediately', 'motionDeadline', 'removeOnLeave', 'leavedClassName', 'onAppearStart', 'onAppearActive', 'onAppearEnd', 'onEnterStart', 'onEnterActive', 'onEnterEnd', 'onLeaveStart', 'onLeaveActive', 'onLeaveEnd'];

export function genCSSMotionList(transitionSupport) {
  var CSSMotion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : OriginCSSMotion;

  var CSSMotionList = function (_React$Component) {
    _inherits(CSSMotionList, _React$Component);

    function CSSMotionList() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, CSSMotionList);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CSSMotionList.__proto__ || Object.getPrototypeOf(CSSMotionList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        keyEntities: []
      }, _this.removeKey = function (removeKey) {
        _this.setState(function (_ref2) {
          var keyEntities = _ref2.keyEntities;
          return {
            keyEntities: keyEntities.map(function (entity) {
              if (entity.key !== removeKey) return entity;
              return _extends({}, entity, {
                status: STATUS_REMOVED
              });
            })
          };
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CSSMotionList, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var keyEntities = this.state.keyEntities;

        var _props = this.props,
            component = _props.component,
            children = _props.children,
            restProps = _objectWithoutProperties(_props, ['component', 'children']);

        var Component = component || React.Fragment;

        var motionProps = {};
        MOTION_PROP_NAMES.forEach(function (prop) {
          motionProps[prop] = restProps[prop];
          delete restProps[prop];
        });
        delete restProps.keys;

        return React.createElement(
          Component,
          restProps,
          keyEntities.map(function (_ref3) {
            var status = _ref3.status,
                eventProps = _objectWithoutProperties(_ref3, ['status']);

            var visible = status === STATUS_ADD || status === STATUS_KEEP;
            return React.createElement(
              CSSMotion,
              _extends({}, motionProps, {
                key: eventProps.key,
                visible: visible,
                eventProps: eventProps,
                onLeaveEnd: function onLeaveEnd() {
                  if (motionProps.onLeaveEnd) {
                    motionProps.onLeaveEnd.apply(motionProps, arguments);
                  }
                  _this2.removeKey(eventProps.key);
                }
              }),
              children
            );
          })
        );
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(_ref4, _ref5) {
        var keys = _ref4.keys;
        var keyEntities = _ref5.keyEntities;

        var parsedKeyObjects = parseKeys(keys);

        // Always as keep when motion not support
        if (!transitionSupport) {
          return {
            keyEntities: parsedKeyObjects.map(function (obj) {
              return _extends({}, obj, { status: STATUS_KEEP });
            })
          };
        }

        var mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);

        var keyEntitiesLen = keyEntities.length;
        return {
          keyEntities: mixedKeyEntities.filter(function (entity) {
            // IE 9 not support Array.prototype.find
            var prevEntity = null;
            for (var i = 0; i < keyEntitiesLen; i += 1) {
              var currentEntity = keyEntities[i];
              if (currentEntity.key === entity.key) {
                prevEntity = currentEntity;
                break;
              }
            }

            // Remove if already mark as removed
            if (prevEntity && prevEntity.status === STATUS_REMOVED && entity.status === STATUS_REMOVE) {
              return false;
            }
            return true;
          })
        };
      }
    }]);

    return CSSMotionList;
  }(React.Component);

  CSSMotionList.defaultProps = {
    component: 'div'
  };


  return CSSMotionList;
}

export default genCSSMotionList(supportTransition);