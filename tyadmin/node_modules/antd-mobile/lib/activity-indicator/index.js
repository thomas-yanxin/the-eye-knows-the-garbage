'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* tslint:disable:jsx-no-multiline-js */
var ActivityIndicator = function (_React$Component) {
    (0, _inherits3['default'])(ActivityIndicator, _React$Component);

    function ActivityIndicator() {
        (0, _classCallCheck3['default'])(this, ActivityIndicator);
        return (0, _possibleConstructorReturn3['default'])(this, (ActivityIndicator.__proto__ || Object.getPrototypeOf(ActivityIndicator)).apply(this, arguments));
    }

    (0, _createClass3['default'])(ActivityIndicator, [{
        key: 'render',
        value: function render() {
            var _classnames;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                className = _props.className,
                animating = _props.animating,
                toast = _props.toast,
                size = _props.size,
                text = _props.text;

            var wrapClass = (0, _classnames4['default'])(prefixCls, className, (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_classnames, prefixCls + '-toast', !!toast), _classnames));
            var spinnerClass = (0, _classnames4['default'])(prefixCls + '-spinner', (0, _defineProperty3['default'])({}, prefixCls + '-spinner-lg', !!toast || size === 'large'));
            if (animating) {
                if (toast) {
                    return React.createElement(
                        'div',
                        { className: wrapClass },
                        text ? React.createElement(
                            'div',
                            { className: prefixCls + '-content' },
                            React.createElement('span', { className: spinnerClass, 'aria-hidden': 'true' }),
                            React.createElement(
                                'span',
                                { className: prefixCls + '-toast' },
                                text
                            )
                        ) : React.createElement(
                            'div',
                            { className: prefixCls + '-content' },
                            React.createElement('span', { className: spinnerClass, 'aria-label': 'Loading' })
                        )
                    );
                } else {
                    return text ? React.createElement(
                        'div',
                        { className: wrapClass },
                        React.createElement('span', { className: spinnerClass, 'aria-hidden': 'true' }),
                        React.createElement(
                            'span',
                            { className: prefixCls + '-tip' },
                            text
                        )
                    ) : React.createElement(
                        'div',
                        { className: wrapClass },
                        React.createElement('span', { className: spinnerClass, 'aria-label': 'loading' })
                    );
                }
            } else {
                return null;
            }
        }
    }]);
    return ActivityIndicator;
}(React.Component);

exports['default'] = ActivityIndicator;

ActivityIndicator.defaultProps = {
    prefixCls: 'am-activity-indicator',
    animating: true,
    size: 'small',
    panelColor: 'rgba(34,34,34,0.6)',
    toast: false
};
module.exports = exports['default'];