'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _rmcDialog = require('rmc-dialog');

var _rmcDialog2 = _interopRequireDefault(_rmcDialog);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

var _getDataAttr = require('../_util/getDataAttr');

var _getDataAttr2 = _interopRequireDefault(_getDataAttr);

var _badge = require('../badge');

var _badge2 = _interopRequireDefault(_badge);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var NORMAL = 'NORMAL'; /* tslint:disable:jsx-no-multiline-js */

var SHARE = 'SHARE';
// tslint:disable-next-line:no-empty
function noop() {}
var queue = [];
function createActionSheet(flag, config, callback) {
    var props = (0, _extends3['default'])({ prefixCls: 'am-action-sheet', cancelButtonText: '取消' }, config);
    var prefixCls = props.prefixCls,
        className = props.className,
        transitionName = props.transitionName,
        maskTransitionName = props.maskTransitionName,
        _props$maskClosable = props.maskClosable,
        maskClosable = _props$maskClosable === undefined ? true : _props$maskClosable;

    var div = document.createElement('div');
    document.body.appendChild(div);
    queue.push(close);
    function close() {
        if (div) {
            ReactDOM.unmountComponentAtNode(div);
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
            var index = queue.indexOf(close);
            if (index !== -1) {
                queue.splice(index, 1);
            }
        }
    }
    function cb(index) {
        var rowIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var res = callback(index, rowIndex);
        if (res && res.then) {
            res.then(function () {
                close();
            });
        } else {
            close();
        }
    }
    var title = props.title,
        message = props.message,
        options = props.options,
        destructiveButtonIndex = props.destructiveButtonIndex,
        cancelButtonIndex = props.cancelButtonIndex,
        cancelButtonText = props.cancelButtonText,
        _props$badges = props.badges,
        badges = _props$badges === undefined ? [] : _props$badges;

    var titleMsg = [title ? React.createElement(
        'h3',
        { key: '0', className: prefixCls + '-title' },
        title
    ) : null, message ? React.createElement(
        'div',
        { key: '1', className: prefixCls + '-message' },
        message
    ) : null];
    var children = null;
    var mode = 'normal';
    switch (flag) {
        case NORMAL:
            mode = 'normal';
            var normalOptions = options;
            var badgesMap = {};
            if (badges && badges.length > 0) {
                badges.forEach(function (element) {
                    if (element.index >= 0) {
                        badgesMap[element.index] = React.createElement(_badge2['default'], element);
                    }
                });
            }
            children = React.createElement(
                'div',
                (0, _getDataAttr2['default'])(props),
                titleMsg,
                React.createElement(
                    'div',
                    { className: prefixCls + '-button-list', role: 'group' },
                    normalOptions.map(function (item, index) {
                        var _classnames;

                        var itemProps = {
                            className: (0, _classnames3['default'])(prefixCls + '-button-list-item', (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-destructive-button', destructiveButtonIndex === index), (0, _defineProperty3['default'])(_classnames, prefixCls + '-cancel-button', cancelButtonIndex === index), _classnames)),
                            onClick: function onClick() {
                                return cb(index);
                            },
                            role: 'button'
                        };
                        var bContent = React.createElement(
                            'div',
                            itemProps,
                            item
                        );
                        // 仅在设置徽标的情况下修改dom结构
                        if (badgesMap[index]) {
                            bContent = React.createElement(
                                'div',
                                (0, _extends3['default'])({}, itemProps, { className: itemProps.className + ' ' + prefixCls + '-button-list-badge' }),
                                React.createElement(
                                    'span',
                                    { className: prefixCls + '-button-list-item-content' },
                                    item
                                ),
                                badgesMap[index]
                            );
                        }
                        var bItem = React.createElement(
                            _rmcFeedback2['default'],
                            { key: index, activeClassName: prefixCls + '-button-list-item-active' },
                            bContent
                        );
                        if (cancelButtonIndex === index || destructiveButtonIndex === index) {
                            bItem = React.createElement(
                                _rmcFeedback2['default'],
                                { key: index, activeClassName: prefixCls + '-button-list-item-active' },
                                React.createElement(
                                    'div',
                                    itemProps,
                                    item,
                                    cancelButtonIndex === index ? React.createElement('span', { className: prefixCls + '-cancel-button-mask' }) : null
                                )
                            );
                        }
                        return bItem;
                    })
                )
            );
            break;
        case SHARE:
            mode = 'share';
            var multipleLine = options.length && Array.isArray(options[0]) || false;
            var createList = function createList(item, index) {
                var rowIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                return React.createElement(
                    'div',
                    { className: prefixCls + '-share-list-item', role: 'button', key: index, onClick: function onClick() {
                            return cb(index, rowIndex);
                        } },
                    React.createElement(
                        'div',
                        { className: prefixCls + '-share-list-item-icon' },
                        item.icon
                    ),
                    React.createElement(
                        'div',
                        { className: prefixCls + '-share-list-item-title' },
                        item.title
                    )
                );
            };
            children = React.createElement(
                'div',
                (0, _getDataAttr2['default'])(props),
                titleMsg,
                React.createElement(
                    'div',
                    { className: prefixCls + '-share' },
                    multipleLine ? options.map(function (item, index) {
                        return React.createElement(
                            'div',
                            { key: index, className: prefixCls + '-share-list' },
                            item.map(function (ii, ind) {
                                return createList(ii, ind, index);
                            })
                        );
                    }) : React.createElement(
                        'div',
                        { className: prefixCls + '-share-list' },
                        options.map(function (item, index) {
                            return createList(item, index);
                        })
                    ),
                    React.createElement(
                        _rmcFeedback2['default'],
                        { activeClassName: prefixCls + '-share-cancel-button-active' },
                        React.createElement(
                            'div',
                            { className: prefixCls + '-share-cancel-button', role: 'button', onClick: function onClick() {
                                    return cb(-1);
                                } },
                            cancelButtonText
                        )
                    )
                )
            );
            break;
        default:
            break;
    }
    var rootCls = (0, _classnames3['default'])(prefixCls + '-' + mode, className);
    ReactDOM.render(React.createElement(
        _rmcDialog2['default'],
        { visible: true, title: '', footer: '', prefixCls: prefixCls, className: rootCls, transitionName: transitionName || 'am-slide-up', maskTransitionName: maskTransitionName || 'am-fade', onClose: function onClose() {
                return cb(cancelButtonIndex || -1);
            }, maskClosable: maskClosable, wrapProps: props.wrapProps || {} },
        children
    ), div);
    return {
        close: close
    };
}
exports['default'] = {
    showActionSheetWithOptions: function showActionSheetWithOptions(config) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        createActionSheet(NORMAL, config, callback);
    },
    showShareActionSheetWithOptions: function showShareActionSheetWithOptions(config) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        createActionSheet(SHARE, config, callback);
    },
    close: function close() {
        queue.forEach(function (q) {
            return q();
        });
    }
};
module.exports = exports['default'];