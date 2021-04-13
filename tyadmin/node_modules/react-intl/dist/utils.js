"use strict";
/*
HTML escaping is the same as React's
(on purpose.) Therefore, it has the following Copyright and Licensing:

Copyright 2013-2014, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the LICENSE
file in the root directory of React's source tree.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var intl_messageformat_1 = require("intl-messageformat");
var intl_format_cache_1 = require("intl-format-cache");
var intl_utils_1 = require("@formatjs/intl-utils");
var ESCAPED_CHARS = {
    38: '&amp;',
    62: '&gt;',
    60: '&lt;',
    34: '&quot;',
    39: '&#x27;',
};
var UNSAFE_CHARS_REGEX = /[&><"']/g;
function escape(str) {
    return ('' + str).replace(UNSAFE_CHARS_REGEX, function (match) { return ESCAPED_CHARS[match.charCodeAt(0)]; });
}
exports.escape = escape;
function filterProps(props, whitelist, defaults) {
    if (defaults === void 0) { defaults = {}; }
    return whitelist.reduce(function (filtered, name) {
        if (name in props) {
            filtered[name] = props[name];
        }
        else if (name in defaults) {
            filtered[name] = defaults[name];
        }
        return filtered;
    }, {});
}
exports.filterProps = filterProps;
function invariantIntlContext(intl) {
    intl_utils_1.invariant(intl, '[React Intl] Could not find required `intl` object. ' +
        '<IntlProvider> needs to exist in the component ancestry.');
}
exports.invariantIntlContext = invariantIntlContext;
function createError(message, exception) {
    var eMsg = exception ? "\n" + exception.stack : '';
    return "[React Intl] " + message + eMsg;
}
exports.createError = createError;
function defaultErrorHandler(error) {
    if (process.env.NODE_ENV !== 'production') {
        console.error(error);
    }
}
exports.defaultErrorHandler = defaultErrorHandler;
exports.DEFAULT_INTL_CONFIG = {
    formats: {},
    messages: {},
    timeZone: undefined,
    textComponent: React.Fragment,
    defaultLocale: 'en',
    defaultFormats: {},
    onError: defaultErrorHandler,
};
function createIntlCache() {
    return {
        dateTime: {},
        number: {},
        message: {},
        relativeTime: {},
        pluralRules: {},
        list: {},
        displayNames: {},
    };
}
exports.createIntlCache = createIntlCache;
/**
 * Create intl formatters and populate cache
 * @param cache explicit cache to prevent leaking memory
 */
function createFormatters(cache) {
    if (cache === void 0) { cache = createIntlCache(); }
    var RelativeTimeFormat = Intl.RelativeTimeFormat;
    var ListFormat = Intl.ListFormat;
    var DisplayNames = Intl.DisplayNames;
    return {
        getDateTimeFormat: intl_format_cache_1.default(Intl.DateTimeFormat, cache.dateTime),
        getNumberFormat: intl_format_cache_1.default(Intl.NumberFormat, cache.number),
        getMessageFormat: intl_format_cache_1.default(intl_messageformat_1.default, cache.message),
        getRelativeTimeFormat: intl_format_cache_1.default(RelativeTimeFormat, cache.relativeTime),
        getPluralRules: intl_format_cache_1.default(Intl.PluralRules, cache.pluralRules),
        getListFormat: intl_format_cache_1.default(ListFormat, cache.list),
        getDisplayNames: intl_format_cache_1.default(DisplayNames, cache.displayNames),
    };
}
exports.createFormatters = createFormatters;
function getNamedFormat(formats, type, name, onError) {
    var formatType = formats && formats[type];
    var format;
    if (formatType) {
        format = formatType[name];
    }
    if (format) {
        return format;
    }
    onError(createError("No " + type + " format named: " + name));
}
exports.getNamedFormat = getNamedFormat;
