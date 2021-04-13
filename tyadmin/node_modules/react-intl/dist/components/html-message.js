"use strict";
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var message_1 = require("./message");
var injectIntl_1 = require("./injectIntl");
var utils_1 = require("../utils");
var FormattedHTMLMessage = /** @class */ (function (_super) {
    __extends(FormattedHTMLMessage, _super);
    function FormattedHTMLMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormattedHTMLMessage.prototype.render = function () {
        var _this = this;
        return (React.createElement(injectIntl_1.Context.Consumer, null, function (intl) {
            if (!_this.props.defaultMessage) {
                utils_1.invariantIntlContext(intl);
            }
            var formatHTMLMessage = intl.formatHTMLMessage, textComponent = intl.textComponent;
            var _a = _this.props, id = _a.id, description = _a.description, defaultMessage = _a.defaultMessage, rawValues = _a.values, children = _a.children;
            var Component = _this.props.tagName;
            // This is bc of TS3.3 doesn't recognize `defaultProps`
            if (!Component) {
                Component = textComponent || 'span';
            }
            var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
            var formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);
            if (typeof children === 'function') {
                return children(formattedHTMLMessage);
            }
            // Since the message presumably has HTML in it, we need to set
            // `innerHTML` in order for it to be rendered and not escaped by React.
            // To be safe, all string prop values were escaped when formatting the
            // message. It is assumed that the message is not UGC, and came from the
            // developer making it more like a template.
            //
            // Note: There's a perf impact of using this component since there's no
            // way for React to do its virtual DOM diffing.
            var html = { __html: formattedHTMLMessage };
            return React.createElement(Component, { dangerouslySetInnerHTML: html });
        }));
    };
    FormattedHTMLMessage.displayName = 'FormattedHTMLMessage';
    FormattedHTMLMessage.defaultProps = __assign(__assign({}, message_1.default.defaultProps), { tagName: 'span' });
    return FormattedHTMLMessage;
}(message_1.default));
exports.default = FormattedHTMLMessage;
