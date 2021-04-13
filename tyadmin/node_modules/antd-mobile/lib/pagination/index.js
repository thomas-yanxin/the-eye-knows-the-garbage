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

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _getLocale = require('../_util/getLocale');

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _flex = require('../flex');

var _flex2 = _interopRequireDefault(_flex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* tslint:disable:jsx-no-multiline-js */
var Pagination = function (_React$Component) {
    (0, _inherits3['default'])(Pagination, _React$Component);

    function Pagination(props) {
        (0, _classCallCheck3['default'])(this, Pagination);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));

        _this.state = {
            current: props.current
        };
        return _this;
    }

    (0, _createClass3['default'])(Pagination, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.current !== this.state.current) {
                this.setState({
                    current: nextProps.current
                });
            }
        }
    }, {
        key: 'onChange',
        value: function onChange(p) {
            this.setState({
                current: p
            });
            if (this.props.onChange) {
                this.props.onChange(p);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                className = _props.className,
                style = _props.style,
                mode = _props.mode,
                total = _props.total,
                simple = _props.simple;
            var current = this.state.current;

            var locale = (0, _getLocale.getComponentLocale)(this.props, this.context, 'Pagination', function () {
                return require('./locale/zh_CN');
            });
            var prevText = locale.prevText,
                nextText = locale.nextText;

            var markup = React.createElement(
                _flex2['default'],
                null,
                React.createElement(
                    _flex2['default'].Item,
                    { className: prefixCls + '-wrap-btn ' + prefixCls + '-wrap-btn-prev' },
                    React.createElement(
                        _button2['default'],
                        { inline: true, disabled: current <= 1, onClick: function onClick() {
                                return _this2.onChange(current - 1);
                            } },
                        prevText
                    )
                ),
                this.props.children ? React.createElement(
                    _flex2['default'].Item,
                    null,
                    this.props.children
                ) : !simple && React.createElement(
                    _flex2['default'].Item,
                    { className: prefixCls + '-wrap', 'aria-live': 'assertive' },
                    React.createElement(
                        'span',
                        { className: 'active' },
                        current
                    ),
                    '/',
                    React.createElement(
                        'span',
                        null,
                        total
                    )
                ),
                React.createElement(
                    _flex2['default'].Item,
                    { className: prefixCls + '-wrap-btn ' + prefixCls + '-wrap-btn-next' },
                    React.createElement(
                        _button2['default'],
                        { inline: true, disabled: current >= total, onClick: function onClick() {
                                return _this2.onChange(_this2.state.current + 1);
                            } },
                        nextText
                    )
                )
            );
            if (mode === 'number') {
                markup = React.createElement(
                    'div',
                    { className: prefixCls + '-wrap' },
                    React.createElement(
                        'span',
                        { className: 'active' },
                        current
                    ),
                    '/',
                    React.createElement(
                        'span',
                        null,
                        total
                    )
                );
            } else if (mode === 'pointer') {
                var arr = [];
                for (var i = 0; i < total; i++) {
                    arr.push(React.createElement(
                        'div',
                        { key: 'dot-' + i, className: (0, _classnames3['default'])(prefixCls + '-wrap-dot', (0, _defineProperty3['default'])({}, prefixCls + '-wrap-dot-active', i + 1 === current)) },
                        React.createElement('span', null)
                    ));
                }
                markup = React.createElement(
                    'div',
                    { className: prefixCls + '-wrap' },
                    arr
                );
            }
            var cls = (0, _classnames3['default'])(prefixCls, className);
            return React.createElement(
                'div',
                { className: cls, style: style },
                markup
            );
        }
    }]);
    return Pagination;
}(React.Component);

exports['default'] = Pagination;

Pagination.defaultProps = {
    prefixCls: 'am-pagination',
    mode: 'button',
    current: 1,
    total: 0,
    simple: false,
    onChange: function onChange() {}
};
Pagination.contextTypes = {
    antLocale: PropTypes.object
};
module.exports = exports['default'];