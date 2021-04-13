import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import * as React from 'react';
import findDOMNode from "rc-util/es/Dom/findDOMNode";
import toArray from "rc-util/es/Children/toArray";
import warning from "rc-util/es/warning";
import { composeRef, supportRef } from "rc-util/es/ref";
import ResizeObserver from 'resize-observer-polyfill';
var INTERNAL_PREFIX_KEY = 'rc-observer-key'; // Still need to be compatible with React 15, we use class component here

var ReactResizeObserver =
/** @class */
function () {
  var ReactResizeObserver = /*#__PURE__*/function (_React$Component) {
    _inherits(ReactResizeObserver, _React$Component);

    var _super = _createSuper(ReactResizeObserver);

    function ReactResizeObserver() {
      var _this;

      _classCallCheck(this, ReactResizeObserver);

      _this = _super.apply(this, arguments);
      _this.resizeObserver = null;
      _this.childNode = null;
      _this.currentElement = null;
      _this.state = {
        width: 0,
        height: 0
      };

      _this.onResize = function (entries) {
        var onResize = _this.props.onResize;
        var target = entries[0].target;

        var _target$getBoundingCl = target.getBoundingClientRect(),
            width = _target$getBoundingCl.width,
            height = _target$getBoundingCl.height;

        var offsetWidth = target.offsetWidth,
            offsetHeight = target.offsetHeight;
        /**
         * Resize observer trigger when content size changed.
         * In most case we just care about element size,
         * let's use `boundary` instead of `contentRect` here to avoid shaking.
         */

        var fixedWidth = Math.floor(width);
        var fixedHeight = Math.floor(height);

        if (_this.state.width !== fixedWidth || _this.state.height !== fixedHeight) {
          var size = {
            width: fixedWidth,
            height: fixedHeight
          };

          _this.setState(size);

          if (onResize) {
            onResize(_objectSpread(_objectSpread({}, size), {}, {
              offsetWidth: offsetWidth,
              offsetHeight: offsetHeight
            }));
          }
        }
      };

      _this.setChildNode = function (node) {
        _this.childNode = node;
      };

      return _this;
    }

    _createClass(ReactResizeObserver, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.onComponentUpdated();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.onComponentUpdated();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.destroyObserver();
      }
    }, {
      key: "onComponentUpdated",
      value: function onComponentUpdated() {
        var disabled = this.props.disabled; // Unregister if disabled

        if (disabled) {
          this.destroyObserver();
          return;
        } // Unregister if element changed


        var element = findDOMNode(this.childNode || this);
        var elementChanged = element !== this.currentElement;

        if (elementChanged) {
          this.destroyObserver();
          this.currentElement = element;
        }

        if (!this.resizeObserver && element) {
          this.resizeObserver = new ResizeObserver(this.onResize);
          this.resizeObserver.observe(element);
        }
      }
    }, {
      key: "destroyObserver",
      value: function destroyObserver() {
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = null;
        }
      }
    }, {
      key: "render",
      value: function render() {
        var children = this.props.children;
        var childNodes = toArray(children);

        if (childNodes.length > 1) {
          warning(false, 'Find more than one child node with `children` in ResizeObserver. Will only observe first one.');
        } else if (childNodes.length === 0) {
          warning(false, '`children` of ResizeObserver is empty. Nothing is in observe.');
          return null;
        }

        var childNode = childNodes[0];

        if (React.isValidElement(childNode) && supportRef(childNode)) {
          var ref = childNode.ref;
          childNodes[0] = React.cloneElement(childNode, {
            ref: composeRef(ref, this.setChildNode)
          });
        }

        return childNodes.length === 1 ? childNodes[0] : childNodes.map(function (node, index) {
          if (!React.isValidElement(node) || 'key' in node && node.key !== null) {
            return node;
          }

          return React.cloneElement(node, {
            key: "".concat(INTERNAL_PREFIX_KEY, "-").concat(index)
          });
        });
      }
    }]);

    return ReactResizeObserver;
  }(React.Component);

  ReactResizeObserver.displayName = 'ResizeObserver';
  return ReactResizeObserver;
}();

export default ReactResizeObserver;