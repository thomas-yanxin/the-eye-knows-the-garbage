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

var _DatePicker = require('rmc-date-picker/lib/DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _getLocale = require('../_util/getLocale');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DatePickerView = function (_React$Component) {
    (0, _inherits3['default'])(DatePickerView, _React$Component);

    function DatePickerView() {
        (0, _classCallCheck3['default'])(this, DatePickerView);
        return (0, _possibleConstructorReturn3['default'])(this, (DatePickerView.__proto__ || Object.getPrototypeOf(DatePickerView)).apply(this, arguments));
    }

    (0, _createClass3['default'])(DatePickerView, [{
        key: 'render',
        value: function render() {
            // tslint:disable-next-line:no-this-assignment
            var props = this.props,
                context = this.context;

            var locale = (0, _getLocale.getComponentLocale)(props, context, 'DatePickerView', function () {
                return require('./locale/zh_CN');
            });
            // DatePicker use `defaultDate`, maybe because there are PopupDatePicker inside? @yiminghe
            // Here Use `date` instead of `defaultDate`, make it controlled fully.
            return React.createElement(_DatePicker2['default'], (0, _extends3['default'])({}, props, { locale: locale, date: props.value, onDateChange: props.onChange, onValueChange: props.onValueChange, onScrollChange: props.onScrollChange }));
        }
    }]);
    return DatePickerView;
}(React.Component);

exports['default'] = DatePickerView;

DatePickerView.defaultProps = {
    mode: 'datetime',
    extra: '请选择',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    minuteStep: 1,
    use12Hours: false
};
DatePickerView.contextTypes = {
    antLocale: PropTypes.object
};
module.exports = exports['default'];