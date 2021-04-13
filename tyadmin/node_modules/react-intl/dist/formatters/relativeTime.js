"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var RELATIVE_TIME_FORMAT_OPTIONS = [
    'numeric',
    'style',
];
function getFormatter(_a, getRelativeTimeFormat, options) {
    var locale = _a.locale, formats = _a.formats, onError = _a.onError;
    if (options === void 0) { options = {}; }
    var format = options.format;
    var defaults = (!!format && utils_1.getNamedFormat(formats, 'relative', format, onError)) || {};
    var filteredOptions = utils_1.filterProps(options, RELATIVE_TIME_FORMAT_OPTIONS, defaults);
    return getRelativeTimeFormat(locale, filteredOptions);
}
function formatRelativeTime(config, getRelativeTimeFormat, value, unit, options) {
    if (options === void 0) { options = {}; }
    if (!unit) {
        unit = 'second';
    }
    var RelativeTimeFormat = Intl.RelativeTimeFormat;
    if (!RelativeTimeFormat) {
        config.onError(utils_1.createError("Intl.RelativeTimeFormat is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-relativetimeformat\"\n"));
    }
    try {
        return getFormatter(config, getRelativeTimeFormat, options).format(value, unit);
    }
    catch (e) {
        config.onError(utils_1.createError('Error formatting relative time.', e));
    }
    return String(value);
}
exports.formatRelativeTime = formatRelativeTime;
