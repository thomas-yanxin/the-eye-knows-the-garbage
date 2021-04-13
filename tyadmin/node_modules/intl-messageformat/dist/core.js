"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
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
Object.defineProperty(exports, "__esModule", { value: true });
var intl_messageformat_parser_1 = require("intl-messageformat-parser");
var intl_format_cache_1 = require("intl-format-cache");
var formatters_1 = require("./formatters");
// -- MessageFormat --------------------------------------------------------
function mergeConfig(c1, c2) {
    if (!c2) {
        return c1;
    }
    return __assign(__assign(__assign({}, (c1 || {})), (c2 || {})), Object.keys(c1).reduce(function (all, k) {
        all[k] = __assign(__assign({}, c1[k]), (c2[k] || {}));
        return all;
    }, {}));
}
function mergeConfigs(defaultConfig, configs) {
    if (!configs) {
        return defaultConfig;
    }
    return Object.keys(defaultConfig).reduce(function (all, k) {
        all[k] = mergeConfig(defaultConfig[k], configs[k]);
        return all;
    }, __assign({}, defaultConfig));
}
function createDefaultFormatters(cache) {
    if (cache === void 0) { cache = {
        number: {},
        dateTime: {},
        pluralRules: {},
    }; }
    return {
        getNumberFormat: intl_format_cache_1.default(Intl.NumberFormat, cache.number),
        getDateTimeFormat: intl_format_cache_1.default(Intl.DateTimeFormat, cache.dateTime),
        getPluralRules: intl_format_cache_1.default(Intl.PluralRules, cache.pluralRules),
    };
}
exports.createDefaultFormatters = createDefaultFormatters;
var IntlMessageFormat = /** @class */ (function () {
    function IntlMessageFormat(message, locales, overrideFormats, opts) {
        var _this = this;
        if (locales === void 0) { locales = IntlMessageFormat.defaultLocale; }
        this.formatterCache = {
            number: {},
            dateTime: {},
            pluralRules: {},
        };
        this.format = function (values) {
            return formatters_1.formatToString(_this.ast, _this.locales, _this.formatters, _this.formats, values, _this.message);
        };
        this.formatToParts = function (values) {
            return formatters_1.formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, undefined, _this.message);
        };
        this.formatHTMLMessage = function (values) {
            return formatters_1.formatHTMLMessage(_this.ast, _this.locales, _this.formatters, _this.formats, values, _this.message);
        };
        this.resolvedOptions = function () { return ({
            locale: Intl.NumberFormat.supportedLocalesOf(_this.locales)[0],
        }); };
        this.getAst = function () { return _this.ast; };
        if (typeof message === 'string') {
            this.message = message;
            if (!IntlMessageFormat.__parse) {
                throw new TypeError('IntlMessageFormat.__parse must be set to process `message` of type `string`');
            }
            // Parse string messages into an AST.
            this.ast = IntlMessageFormat.__parse(message, {
                normalizeHashtagInPlural: false,
            });
        }
        else {
            this.ast = message;
        }
        if (!Array.isArray(this.ast)) {
            throw new TypeError('A message must be provided as a String or AST.');
        }
        // Creates a new object with the specified `formats` merged with the default
        // formats.
        this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
        // Defined first because it's used to build the format pattern.
        this.locales = locales;
        this.formatters =
            (opts && opts.formatters) || createDefaultFormatters(this.formatterCache);
    }
    IntlMessageFormat.defaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
    IntlMessageFormat.__parse = intl_messageformat_parser_1.parse;
    // Default format options used as the prototype of the `formats` provided to the
    // constructor. These are used when constructing the internal Intl.NumberFormat
    // and Intl.DateTimeFormat instances.
    IntlMessageFormat.formats = {
        number: {
            currency: {
                style: 'currency',
            },
            percent: {
                style: 'percent',
            },
        },
        date: {
            short: {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
            },
            medium: {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            },
            long: {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            },
            full: {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            },
        },
        time: {
            short: {
                hour: 'numeric',
                minute: 'numeric',
            },
            medium: {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            },
            long: {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
            },
            full: {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
            },
        },
    };
    return IntlMessageFormat;
}());
exports.IntlMessageFormat = IntlMessageFormat;
exports.default = IntlMessageFormat;
