"use strict";
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var intl_utils_1 = require("@formatjs/intl-utils");
var utils_1 = require("../utils");
var intl_messageformat_1 = require("intl-messageformat");
function setTimeZoneInOptions(opts, timeZone) {
    return Object.keys(opts).reduce(function (all, k) {
        all[k] = __assign({ timeZone: timeZone }, opts[k]);
        return all;
    }, {});
}
function deepMergeOptions(opts1, opts2) {
    var keys = Object.keys(__assign(__assign({}, opts1), opts2));
    return keys.reduce(function (all, k) {
        all[k] = __assign(__assign({}, (opts1[k] || {})), (opts2[k] || {}));
        return all;
    }, {});
}
function deepMergeFormatsAndSetTimeZone(f1, timeZone) {
    if (!timeZone) {
        return f1;
    }
    var mfFormats = intl_messageformat_1.default.formats;
    return __assign(__assign(__assign({}, mfFormats), f1), { date: deepMergeOptions(setTimeZoneInOptions(mfFormats.date, timeZone), setTimeZoneInOptions(f1.date || {}, timeZone)), time: deepMergeOptions(setTimeZoneInOptions(mfFormats.time, timeZone), setTimeZoneInOptions(f1.time || {}, timeZone)) });
}
exports.prepareIntlMessageFormatHtmlOutput = function (chunks) { return React.createElement.apply(React, __spreadArrays([React.Fragment, null], chunks)); };
function formatMessage(_a, state, messageDescriptor, values) {
    var locale = _a.locale, formats = _a.formats, messages = _a.messages, defaultLocale = _a.defaultLocale, defaultFormats = _a.defaultFormats, onError = _a.onError, timeZone = _a.timeZone;
    if (messageDescriptor === void 0) { messageDescriptor = { id: '' }; }
    if (values === void 0) { values = {}; }
    var id = messageDescriptor.id, defaultMessage = messageDescriptor.defaultMessage;
    // `id` is a required field of a Message Descriptor.
    intl_utils_1.invariant(!!id, '[React Intl] An `id` must be provided to format a message.');
    var message = messages && messages[String(id)];
    formats = deepMergeFormatsAndSetTimeZone(formats, timeZone);
    defaultFormats = deepMergeFormatsAndSetTimeZone(defaultFormats, timeZone);
    var formattedMessageParts = [];
    if (message) {
        try {
            var formatter = state.getMessageFormat(message, locale, formats, {
                formatters: state,
            });
            formattedMessageParts = formatter.formatHTMLMessage(values);
        }
        catch (e) {
            onError(utils_1.createError("Error formatting message: \"" + id + "\" for locale: \"" + locale + "\"" +
                (defaultMessage ? ', using default message as fallback.' : ''), e));
        }
    }
    else {
        // This prevents warnings from littering the console in development
        // when no `messages` are passed into the <IntlProvider> for the
        // default locale, and a default message is in the source.
        if (!defaultMessage ||
            (locale && locale.toLowerCase() !== defaultLocale.toLowerCase())) {
            onError(utils_1.createError("Missing message: \"" + id + "\" for locale: \"" + locale + "\"" +
                (defaultMessage ? ', using default message as fallback.' : '')));
        }
    }
    if (!formattedMessageParts.length && defaultMessage) {
        try {
            var formatter = state.getMessageFormat(defaultMessage, defaultLocale, defaultFormats);
            formattedMessageParts = formatter.formatHTMLMessage(values);
        }
        catch (e) {
            onError(utils_1.createError("Error formatting the default message for: \"" + id + "\"", e));
        }
    }
    if (!formattedMessageParts.length) {
        onError(utils_1.createError("Cannot format message: \"" + id + "\", " +
            ("using message " + (message || defaultMessage ? 'source' : 'id') + " as fallback.")));
        if (typeof message === 'string') {
            return message || defaultMessage || String(id);
        }
        return defaultMessage || String(id);
    }
    if (formattedMessageParts.length === 1 &&
        typeof formattedMessageParts[0] === 'string') {
        return formattedMessageParts[0] || defaultMessage || String(id);
    }
    return exports.prepareIntlMessageFormatHtmlOutput(formattedMessageParts);
}
exports.formatMessage = formatMessage;
function formatHTMLMessage(config, state, messageDescriptor, rawValues) {
    if (messageDescriptor === void 0) { messageDescriptor = { id: '' }; }
    if (rawValues === void 0) { rawValues = {}; }
    // Process all the values before they are used when formatting the ICU
    // Message string. Since the formatted message might be injected via
    // `innerHTML`, all String-based values need to be HTML-escaped.
    var escapedValues = Object.keys(rawValues).reduce(function (escaped, name) {
        var value = rawValues[name];
        escaped[name] = typeof value === 'string' ? utils_1.escape(value) : value;
        return escaped;
    }, {});
    return formatMessage(config, state, messageDescriptor, escapedValues);
}
exports.formatHTMLMessage = formatHTMLMessage;
