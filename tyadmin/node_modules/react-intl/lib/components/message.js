/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { Context } from './injectIntl';
import { formatMessage } from '../formatters/message';
import { invariantIntlContext, DEFAULT_INTL_CONFIG, createFormatters, } from '../utils';
import * as shallowEquals_ from 'shallow-equal/objects';
const shallowEquals = shallowEquals_.default || shallowEquals_;
const defaultFormatMessage = (descriptor, values) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error('[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry. Using default message as fallback.');
    }
    return formatMessage(Object.assign(Object.assign({}, DEFAULT_INTL_CONFIG), { locale: 'en' }), createFormatters(), descriptor, values);
};
class FormattedMessage extends React.Component {
    shouldComponentUpdate(nextProps) {
        const _a = this.props, { values } = _a, otherProps = __rest(_a, ["values"]);
        const { values: nextValues } = nextProps, nextOtherProps = __rest(nextProps, ["values"]);
        return (!shallowEquals(nextValues, values) ||
            !shallowEquals(otherProps, nextOtherProps));
    }
    render() {
        return (React.createElement(Context.Consumer, null, (intl) => {
            if (!this.props.defaultMessage) {
                invariantIntlContext(intl);
            }
            const { formatMessage = defaultFormatMessage, textComponent: Text = React.Fragment, } = intl || {};
            const { id, description, defaultMessage, values, children, tagName: Component = Text, } = this.props;
            const descriptor = { id, description, defaultMessage };
            let nodes = formatMessage(descriptor, values);
            if (!Array.isArray(nodes)) {
                nodes = [nodes];
            }
            if (typeof children === 'function') {
                return children(...nodes);
            }
            if (Component) {
                // Needs to use `createElement()` instead of JSX, otherwise React will
                // warn about a missing `key` prop with rich-text message formatting.
                return React.createElement(Component, null, ...nodes);
            }
            return nodes;
        }));
    }
}
FormattedMessage.displayName = 'FormattedMessage';
FormattedMessage.defaultProps = {
    values: {},
};
export default FormattedMessage;
