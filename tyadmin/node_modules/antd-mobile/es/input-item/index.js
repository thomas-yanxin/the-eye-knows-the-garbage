import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import TouchFeedback from 'rmc-feedback';
import { getComponentLocale } from '../_util/getLocale';
import CustomInput from './CustomInput';
import Input from './Input';
function noop() {}
function normalizeValue(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    return value + '';
}

var InputItem = function (_React$Component) {
    _inherits(InputItem, _React$Component);

    function InputItem(props) {
        _classCallCheck(this, InputItem);

        var _this = _possibleConstructorReturn(this, (InputItem.__proto__ || Object.getPrototypeOf(InputItem)).call(this, props));

        _this.onInputChange = function (e) {
            var el = e.target;
            var rawVal = el.value;

            var prePos = 0;
            try {
                // some input type do not support selection, see https://html.spec.whatwg.org/multipage/input.html#do-not-apply
                prePos = el.selectionEnd || 0;
            } catch (error) {
                console.warn('Get selection error:', error);
            }
            var _this$state$value = _this.state.value,
                preCtrlVal = _this$state$value === undefined ? '' : _this$state$value;
            var type = _this.props.type;

            var ctrlValue = rawVal;
            switch (type) {
                case 'bankCard':
                    ctrlValue = rawVal.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
                    break;
                case 'phone':
                    ctrlValue = rawVal.replace(/\D/g, '').substring(0, 11);
                    var valueLen = ctrlValue.length;
                    if (valueLen > 3 && valueLen < 8) {
                        ctrlValue = ctrlValue.substr(0, 3) + ' ' + ctrlValue.substr(3);
                    } else if (valueLen >= 8) {
                        ctrlValue = ctrlValue.substr(0, 3) + ' ' + ctrlValue.substr(3, 4) + ' ' + ctrlValue.substr(7);
                    }
                    break;
                case 'number':
                    ctrlValue = rawVal.replace(/\D/g, '');
                    break;
                case 'text':
                case 'password':
                default:
                    break;
            }
            _this.handleOnChange(ctrlValue, ctrlValue !== rawVal, function () {
                switch (type) {
                    case 'bankCard':
                    case 'phone':
                    case 'number':
                        // controlled input type needs to adjust the position of the caret
                        try {
                            // some input type do not support selection, see https://html.spec.whatwg.org/multipage/input.html#do-not-apply
                            var pos = _this.calcPos(prePos, preCtrlVal, rawVal, ctrlValue, [' '], /\D/g);
                            if (type === 'phone' && (pos === 4 || pos === 9) || type === 'bankCard' && pos > 0 && pos % 5 === 0) {
                                pos -= 1;
                            }
                            el.selectionStart = el.selectionEnd = pos;
                        } catch (error) {
                            console.warn('Set selection error:', error);
                        }
                        break;
                    default:
                        break;
                }
            });
        };
        _this.handleOnChange = function (value) {
            var isMutated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var adjustPos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
            var onChange = _this.props.onChange;

            if (!('value' in _this.props)) {
                _this.setState({ value: value });
            } else {
                _this.setState({ value: _this.props.value });
            }
            if (onChange) {
                if (isMutated) {
                    setTimeout(function () {
                        onChange(value);
                        adjustPos();
                    });
                } else {
                    onChange(value);
                    adjustPos();
                }
            } else {
                adjustPos();
            }
        };
        _this.onInputFocus = function (value) {
            if (_this.debounceTimeout) {
                clearTimeout(_this.debounceTimeout);
                _this.debounceTimeout = null;
            }
            _this.setState({
                focus: true
            });
            if (_this.props.onFocus) {
                _this.props.onFocus(value);
            }
        };
        _this.onInputBlur = function (value) {
            if (_this.inputRef) {
                // this.inputRef may be null if customKeyboard unmount
                _this.debounceTimeout = window.setTimeout(function () {
                    if (document.activeElement !== (_this.inputRef && _this.inputRef.inputRef)) {
                        _this.setState({
                            focus: false
                        });
                    }
                }, 200);
            }
            if (_this.props.onBlur) {
                // fix autoFocus item blur with flash
                setTimeout(function () {
                    // fix ios12 wechat browser click failure after input
                    if (document.body) {
                        document.body.scrollTop = document.body.scrollTop;
                    }
                }, 100);
                _this.props.onBlur(value);
            }
        };
        _this.clearInput = function () {
            if (_this.props.type !== 'password' && _this.props.updatePlaceholder) {
                _this.setState({
                    placeholder: _this.props.value
                });
            }
            _this.setState({
                value: ''
            });
            if (_this.props.onChange) {
                _this.props.onChange('');
            }
            _this.focus();
        };
        // this is instance method for user to use
        _this.focus = function () {
            if (_this.inputRef) {
                _this.inputRef.focus();
            }
        };
        // calculate the position of the caret
        _this.calcPos = function (prePos, preCtrlVal, rawVal, ctrlVal, placeholderChars, maskReg) {
            var editLength = rawVal.length - preCtrlVal.length;
            var isAddition = editLength > 0;
            var pos = prePos;
            if (isAddition) {
                var additionStr = rawVal.substr(pos - editLength, editLength);
                var ctrlCharCount = additionStr.replace(maskReg, '').length;
                pos -= editLength - ctrlCharCount;
                var placeholderCharCount = 0;
                while (ctrlCharCount > 0) {
                    if (placeholderChars.indexOf(ctrlVal.charAt(pos - ctrlCharCount + placeholderCharCount)) === -1) {
                        ctrlCharCount--;
                    } else {
                        placeholderCharCount++;
                    }
                }
                pos += placeholderCharCount;
            }
            return pos;
        };
        _this.state = {
            placeholder: props.placeholder,
            value: normalizeValue(props.value || props.defaultValue)
        };
        return _this;
    }

    _createClass(InputItem, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if ('placeholder' in nextProps && !nextProps.updatePlaceholder) {
                this.setState({
                    placeholder: nextProps.placeholder
                });
            }
            if ('value' in nextProps) {
                this.setState({
                    value: nextProps.value
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.debounceTimeout) {
                window.clearTimeout(this.debounceTimeout);
                this.debounceTimeout = null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames,
                _classnames2,
                _this2 = this;

            var props = _extends({}, this.props);
            delete props.updatePlaceholder;

            var prefixCls = props.prefixCls,
                prefixListCls = props.prefixListCls,
                editable = props.editable,
                style = props.style,
                clear = props.clear,
                children = props.children,
                error = props.error,
                className = props.className,
                extra = props.extra,
                labelNumber = props.labelNumber,
                type = props.type,
                onExtraClick = props.onExtraClick,
                onErrorClick = props.onErrorClick,
                moneyKeyboardAlign = props.moneyKeyboardAlign,
                moneyKeyboardWrapProps = props.moneyKeyboardWrapProps,
                moneyKeyboardHeader = props.moneyKeyboardHeader,
                onVirtualKeyboardConfirm = props.onVirtualKeyboardConfirm,
                autoAdjustHeight = props.autoAdjustHeight,
                disabledKeys = props.disabledKeys,
                restProps = __rest(props, ["prefixCls", "prefixListCls", "editable", "style", "clear", "children", "error", "className", "extra", "labelNumber", "type", "onExtraClick", "onErrorClick", "moneyKeyboardAlign", "moneyKeyboardWrapProps", "moneyKeyboardHeader", "onVirtualKeyboardConfirm", "autoAdjustHeight", "disabledKeys"]);

            var name = restProps.name,
                disabled = restProps.disabled,
                maxLength = restProps.maxLength;
            var value = this.state.value;
            // tslint:disable-next-line:variable-name

            var _locale = getComponentLocale(this.props, this.context, 'InputItem', function () {
                return require('./locale/zh_CN');
            });
            var confirmLabel = _locale.confirmLabel,
                backspaceLabel = _locale.backspaceLabel,
                cancelKeyboardLabel = _locale.cancelKeyboardLabel;
            var _state = this.state,
                focus = _state.focus,
                placeholder = _state.placeholder;

            var wrapCls = classnames(prefixListCls + '-item', prefixCls + '-item', prefixListCls + '-item-middle', className, (_classnames = {}, _defineProperty(_classnames, prefixCls + '-disabled', disabled), _defineProperty(_classnames, prefixCls + '-error', error), _defineProperty(_classnames, prefixCls + '-focus', focus), _defineProperty(_classnames, prefixCls + '-android', focus), _classnames));
            var labelCls = classnames(prefixCls + '-label', (_classnames2 = {}, _defineProperty(_classnames2, prefixCls + '-label-2', labelNumber === 2), _defineProperty(_classnames2, prefixCls + '-label-3', labelNumber === 3), _defineProperty(_classnames2, prefixCls + '-label-4', labelNumber === 4), _defineProperty(_classnames2, prefixCls + '-label-5', labelNumber === 5), _defineProperty(_classnames2, prefixCls + '-label-6', labelNumber === 6), _defineProperty(_classnames2, prefixCls + '-label-7', labelNumber === 7), _classnames2));
            var controlCls = prefixCls + '-control';
            var inputType = 'text';
            if (type === 'bankCard' || type === 'phone') {
                inputType = 'tel';
            } else if (type === 'password') {
                inputType = 'password';
            } else if (type === 'digit') {
                inputType = 'number';
            } else if (type !== 'text' && type !== 'number') {
                inputType = type;
            }
            var patternProps = void 0;
            if (type === 'number') {
                patternProps = {
                    pattern: '[0-9]*'
                };
            }
            var classNameProps = void 0;
            if (type === 'digit') {
                classNameProps = {
                    className: 'h5numInput'
                };
            }
            return React.createElement(
                'div',
                { className: wrapCls },
                React.createElement(
                    'div',
                    { className: prefixListCls + '-line' },
                    children ? React.createElement(
                        'div',
                        { className: labelCls },
                        children
                    ) : null,
                    React.createElement(
                        'div',
                        { className: controlCls },
                        type === 'money' ? React.createElement(CustomInput, { value: normalizeValue(value), type: type, ref: function ref(el) {
                                return _this2.inputRef = el;
                            }, maxLength: maxLength, placeholder: placeholder, onChange: this.onInputChange, onFocus: this.onInputFocus, onBlur: this.onInputBlur, onVirtualKeyboardConfirm: onVirtualKeyboardConfirm, disabled: disabled, editable: editable, prefixCls: prefixCls, style: style, confirmLabel: confirmLabel, backspaceLabel: backspaceLabel, cancelKeyboardLabel: cancelKeyboardLabel, moneyKeyboardAlign: moneyKeyboardAlign, moneyKeyboardWrapProps: moneyKeyboardWrapProps, moneyKeyboardHeader: moneyKeyboardHeader, autoAdjustHeight: autoAdjustHeight, disabledKeys: disabledKeys }) : React.createElement(Input, _extends({}, patternProps, restProps, classNameProps, { value: normalizeValue(value), defaultValue: undefined, ref: function ref(el) {
                                return _this2.inputRef = el;
                            }, style: style, type: inputType, maxLength: maxLength, name: name, placeholder: placeholder, onChange: this.onInputChange, onFocus: this.onInputFocus, onBlur: this.onInputBlur, readOnly: !editable, disabled: disabled }))
                    ),
                    clear && editable && !disabled && value && ('' + value).length > 0 ? React.createElement(
                        TouchFeedback,
                        { activeClassName: prefixCls + '-clear-active' },
                        React.createElement('div', { className: prefixCls + '-clear', onClick: this.clearInput })
                    ) : null,
                    error ? React.createElement('div', { className: prefixCls + '-error-extra', onClick: onErrorClick }) : null,
                    extra !== '' ? React.createElement(
                        'div',
                        { className: prefixCls + '-extra', onClick: onExtraClick },
                        extra
                    ) : null
                )
            );
        }
    }]);

    return InputItem;
}(React.Component);

InputItem.defaultProps = {
    prefixCls: 'am-input',
    prefixListCls: 'am-list',
    type: 'text',
    editable: true,
    disabled: false,
    placeholder: '',
    clear: false,
    onChange: noop,
    onBlur: noop,
    onFocus: noop,
    extra: '',
    onExtraClick: noop,
    error: false,
    onErrorClick: noop,
    onVirtualKeyboardConfirm: noop,
    labelNumber: 5,
    updatePlaceholder: false,
    moneyKeyboardAlign: 'right',
    moneyKeyboardWrapProps: {},
    moneyKeyboardHeader: null,
    disabledKeys: null
};
InputItem.contextTypes = {
    antLocale: PropTypes.object
};
export default InputItem;