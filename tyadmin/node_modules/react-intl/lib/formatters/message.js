/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
import * as React from 'react';
import { invariant } from '@formatjs/intl-utils';
import { createError, escape } from '../utils';
import IntlMessageFormat from 'intl-messageformat';
function setTimeZoneInOptions(opts, timeZone) {
    return Object.keys(opts).reduce((all, k) => {
        all[k] = Object.assign({ timeZone }, opts[k]);
        return all;
    }, {});
}
function deepMergeOptions(opts1, opts2) {
    const keys = Object.keys(Object.assign(Object.assign({}, opts1), opts2));
    return keys.reduce((all, k) => {
        all[k] = Object.assign(Object.assign({}, (opts1[k] || {})), (opts2[k] || {}));
        return all;
    }, {});
}
function deepMergeFormatsAndSetTimeZone(f1, timeZone) {
    if (!timeZone) {
        return f1;
    }
    const mfFormats = IntlMessageFormat.formats;
    return Object.assign(Object.assign(Object.assign({}, mfFormats), f1), { date: deepMergeOptions(setTimeZoneInOptions(mfFormats.date, timeZone), setTimeZoneInOptions(f1.date || {}, timeZone)), time: deepMergeOptions(setTimeZoneInOptions(mfFormats.time, timeZone), setTimeZoneInOptions(f1.time || {}, timeZone)) });
}
export const prepareIntlMessageFormatHtmlOutput = (chunks) => React.createElement(React.Fragment, null, ...chunks);
export function formatMessage({ locale, formats, messages, defaultLocale, defaultFormats, onError, timeZone, }, state, messageDescriptor = { id: '' }, values = {}) {
    const { id, defaultMessage } = messageDescriptor;
    // `id` is a required field of a Message Descriptor.
    invariant(!!id, '[React Intl] An `id` must be provided to format a message.');
    const message = messages && messages[String(id)];
    formats = deepMergeFormatsAndSetTimeZone(formats, timeZone);
    defaultFormats = deepMergeFormatsAndSetTimeZone(defaultFormats, timeZone);
    let formattedMessageParts = [];
    if (message) {
        try {
            const formatter = state.getMessageFormat(message, locale, formats, {
                formatters: state,
            });
            formattedMessageParts = formatter.formatHTMLMessage(values);
        }
        catch (e) {
            onError(createError(`Error formatting message: "${id}" for locale: "${locale}"` +
                (defaultMessage ? ', using default message as fallback.' : ''), e));
        }
    }
    else {
        // This prevents warnings from littering the console in development
        // when no `messages` are passed into the <IntlProvider> for the
        // default locale, and a default message is in the source.
        if (!defaultMessage ||
            (locale && locale.toLowerCase() !== defaultLocale.toLowerCase())) {
            onError(createError(`Missing message: "${id}" for locale: "${locale}"` +
                (defaultMessage ? ', using default message as fallback.' : '')));
        }
    }
    if (!formattedMessageParts.length && defaultMessage) {
        try {
            const formatter = state.getMessageFormat(defaultMessage, defaultLocale, defaultFormats);
            formattedMessageParts = formatter.formatHTMLMessage(values);
        }
        catch (e) {
            onError(createError(`Error formatting the default message for: "${id}"`, e));
        }
    }
    if (!formattedMessageParts.length) {
        onError(createError(`Cannot format message: "${id}", ` +
            `using message ${message || defaultMessage ? 'source' : 'id'} as fallback.`));
        if (typeof message === 'string') {
            return message || defaultMessage || String(id);
        }
        return defaultMessage || String(id);
    }
    if (formattedMessageParts.length === 1 &&
        typeof formattedMessageParts[0] === 'string') {
        return formattedMessageParts[0] || defaultMessage || String(id);
    }
    return prepareIntlMessageFormatHtmlOutput(formattedMessageParts);
}
export function formatHTMLMessage(config, state, messageDescriptor = { id: '' }, rawValues = {}) {
    // Process all the values before they are used when formatting the ICU
    // Message string. Since the formatted message might be injected via
    // `innerHTML`, all String-based values need to be HTML-escaped.
    const escapedValues = Object.keys(rawValues).reduce((escaped, name) => {
        const value = rawValues[name];
        escaped[name] = typeof value === 'string' ? escape(value) : value;
        return escaped;
    }, {});
    return formatMessage(config, state, messageDescriptor, escapedValues);
}
