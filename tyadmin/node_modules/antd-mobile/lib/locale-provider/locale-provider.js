'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var LocaleProvider = function (_React$Component) {
    (0, _inherits3['default'])(LocaleProvider, _React$Component);

    function LocaleProvider() {
        (0, _classCallCheck3['default'])(this, LocaleProvider);
        return (0, _possibleConstructorReturn3['default'])(this, (LocaleProvider.__proto__ || Object.getPrototypeOf(LocaleProvider)).apply(this, arguments));
    }

    (0, _createClass3['default'])(LocaleProvider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                antLocale: (0, _extends3['default'])({}, this.props.locale, { exist: true })
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return React.Children.only(this.props.children);
        }
    }]);
    return LocaleProvider;
}(React.Component);

exports['default'] = LocaleProvider;

LocaleProvider.propTypes = {
    locale: PropTypes.object
};
LocaleProvider.childContextTypes = {
    antLocale: PropTypes.object
};
module.exports = exports['default'];