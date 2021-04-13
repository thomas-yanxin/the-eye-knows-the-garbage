"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/createSuper"));

var React = _interopRequireWildcard(require("react"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _reactSlick = _interopRequireDefault(require("@ant-design/react-slick"));

var _classnames = _interopRequireDefault(require("classnames"));

var _configProvider = require("../config-provider");

var Carousel = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Carousel, _React$Component);

  var _super = (0, _createSuper2["default"])(Carousel);

  function Carousel(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Carousel);
    _this = _super.call(this, props);

    _this.saveSlick = function (node) {
      _this.slick = node;
    };

    _this.onWindowResized = function () {
      // Fix https://github.com/ant-design/ant-design/issues/2550
      var autoplay = _this.props.autoplay;

      if (autoplay && _this.slick && _this.slick.innerSlider && _this.slick.innerSlider.autoPlay) {
        _this.slick.innerSlider.autoPlay();
      }
    };

    _this.renderCarousel = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls,
          direction = _ref.direction;

      var _a;

      var props = (0, _extends2["default"])({}, _this.props);

      if (props.effect === 'fade') {
        props.fade = true;
      }

      var prefixCls = getPrefixCls('carousel', props.prefixCls);
      var dotsClass = 'slick-dots';

      var dotPosition = _this.getDotPosition();

      props.vertical = dotPosition === 'left' || dotPosition === 'right';
      var enableDots = !!props.dots;
      var dsClass = (0, _classnames["default"])(dotsClass, "".concat(dotsClass, "-").concat(dotPosition || 'bottom'), typeof props.dots === 'boolean' ? false : (_a = props.dots) === null || _a === void 0 ? void 0 : _a.className);
      var className = (0, _classnames["default"])(prefixCls, (_classNames = {}, (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), (0, _defineProperty2["default"])(_classNames, "".concat(prefixCls, "-vertical"), props.vertical), _classNames));
      return /*#__PURE__*/React.createElement("div", {
        className: className
      }, /*#__PURE__*/React.createElement(_reactSlick["default"], (0, _extends2["default"])({
        ref: _this.saveSlick
      }, props, {
        dots: enableDots,
        dotsClass: dsClass
      })));
    };

    _this.onWindowResized = (0, _debounce["default"])(_this.onWindowResized, 500, {
      leading: false
    });
    return _this;
  }

  (0, _createClass2["default"])(Carousel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var autoplay = this.props.autoplay;

      if (autoplay) {
        window.addEventListener('resize', this.onWindowResized);
      } // https://github.com/ant-design/ant-design/issues/7191


      this.innerSlider = this.slick && this.slick.innerSlider;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (React.Children.count(this.props.children) !== React.Children.count(prevProps.children)) {
        this.goTo(this.props.initialSlide || 0, false);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var autoplay = this.props.autoplay;

      if (autoplay) {
        window.removeEventListener('resize', this.onWindowResized);
        this.onWindowResized.cancel();
      }
    }
  }, {
    key: "getDotPosition",
    value: function getDotPosition() {
      var _this$props$dotPositi = this.props.dotPosition,
          dotPosition = _this$props$dotPositi === void 0 ? 'bottom' : _this$props$dotPositi;
      return dotPosition;
    }
  }, {
    key: "next",
    value: function next() {
      this.slick.slickNext();
    }
  }, {
    key: "prev",
    value: function prev() {
      this.slick.slickPrev();
    }
  }, {
    key: "goTo",
    value: function goTo(slide) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.slick.slickGoTo(slide, dontAnimate);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(_configProvider.ConfigConsumer, null, this.renderCarousel);
    }
  }]);
  return Carousel;
}(React.Component);

exports["default"] = Carousel;
Carousel.defaultProps = {
  dots: true,
  arrows: false,
  draggable: false
};