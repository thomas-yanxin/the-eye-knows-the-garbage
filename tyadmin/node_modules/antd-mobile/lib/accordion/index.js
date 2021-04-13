'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _rcCollapse = require('rc-collapse');

var _rcCollapse2 = _interopRequireDefault(_rcCollapse);

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Accordion = function (_React$Component) {
    (0, _inherits3['default'])(Accordion, _React$Component);

    function Accordion() {
        (0, _classCallCheck3['default'])(this, Accordion);
        return (0, _possibleConstructorReturn3['default'])(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Accordion, [{
        key: 'render',
        value: function render() {
            return React.createElement(_rcCollapse2['default'], this.props);
        }
    }]);
    return Accordion;
}(React.Component);

exports['default'] = Accordion;

Accordion.Panel = _rcCollapse.Panel;
Accordion.defaultProps = {
    prefixCls: 'am-accordion'
};
module.exports = exports['default'];