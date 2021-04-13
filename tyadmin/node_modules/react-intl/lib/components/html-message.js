/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
import * as React from 'react';
import FormattedMessage from './message';
import { Context } from './injectIntl';
import { invariantIntlContext } from '../utils';
class FormattedHTMLMessage extends FormattedMessage {
    render() {
        return (React.createElement(Context.Consumer, null, (intl) => {
            if (!this.props.defaultMessage) {
                invariantIntlContext(intl);
            }
            const { formatHTMLMessage, textComponent } = intl;
            const { id, description, defaultMessage, values: rawValues, children, } = this.props;
            let { tagName: Component } = this.props;
            // This is bc of TS3.3 doesn't recognize `defaultProps`
            if (!Component) {
                Component = textComponent || 'span';
            }
            const descriptor = { id, description, defaultMessage };
            const formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);
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
            const html = { __html: formattedHTMLMessage };
            return React.createElement(Component, { dangerouslySetInnerHTML: html });
        }));
    }
}
FormattedHTMLMessage.displayName = 'FormattedHTMLMessage';
FormattedHTMLMessage.defaultProps = Object.assign(Object.assign({}, FormattedMessage.defaultProps), { tagName: 'span' });
export default FormattedHTMLMessage;
