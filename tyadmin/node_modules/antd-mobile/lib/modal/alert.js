'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports['default'] = alert;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _closest = require('../_util/closest');

var _closest2 = _interopRequireDefault(_closest);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function alert(title, message) {
    var actions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [{ text: '确定' }];
    var platform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ios';

    var closed = false;
    if (!title && !message) {
        // console.log('Must specify either an alert title, or message, or both');
        return {
            close: function close() {}
        };
    }
    var div = document.createElement('div');
    document.body.appendChild(div);
    function close() {
        ReactDOM.unmountComponentAtNode(div);
        if (div && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }
    var footer = actions.map(function (button) {
        // tslint:disable-next-line:only-arrow-functions
        var orginPress = button.onPress || function () {};
        button.onPress = function () {
            if (closed) {
                return;
            }
            var res = orginPress();
            if (res && res.then) {
                res.then(function () {
                    closed = true;
                    close();
                })['catch'](function () {});
            } else {
                closed = true;
                close();
            }
        };
        return button;
    });
    var prefixCls = 'am-modal';
    function onWrapTouchStart(e) {
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        var pNode = (0, _closest2['default'])(e.target, '.' + prefixCls + '-footer');
        if (!pNode) {
            e.preventDefault();
        }
    }
    ReactDOM.render(React.createElement(
        _Modal2['default'],
        { visible: true, transparent: true, title: title, transitionName: 'am-zoom', closable: false, maskClosable: false, footer: footer, maskTransitionName: 'am-fade', platform: platform, wrapProps: { onTouchStart: onWrapTouchStart } },
        React.createElement(
            'div',
            { className: prefixCls + '-alert-content' },
            message
        )
    ), div);
    return {
        close: close
    };
}
module.exports = exports['default'];