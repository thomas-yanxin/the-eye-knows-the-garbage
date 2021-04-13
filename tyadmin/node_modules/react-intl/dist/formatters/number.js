"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var NUMBER_FORMAT_OPTIONS = [
    'localeMatcher',
    'style',
    'currency',
    'currencyDisplay',
    'unit',
    'unitDisplay',
    'useGrouping',
    'minimumIntegerDigits',
    'minimumFractionDigits',
    'maximumFractionDigits',
    'minimumSignificantDigits',
    'maximumSignificantDigits',
    // Unified NumberFormat (Stage 3 as of 10/22/19)
    'compactDisplay',
    'currencyDisplay',
    'currencySign',
    'notation',
    'signDisplay',
    'unit',
    'unitDisplay',
];
function getFormatter(_a, getNumberFormat, options) {
    var locale = _a.locale, formats = _a.formats, onError = _a.onError;
    if (options === void 0) { options = {}; }
    var format = options.format;
    var defaults = ((format &&
        utils_1.getNamedFormat(formats, 'number', format, onError)) ||
        {});
    var filteredOptions = utils_1.filterProps(options, NUMBER_FORMAT_OPTIONS, defaults);
    return getNumberFormat(locale, filteredOptions);
}
exports.getFormatter = getFormatter;
function formatNumber(config, getNumberFormat, value, options) {
    if (options === void 0) { options = {}; }
    try {
        return getFormatter(config, getNumberFormat, options).format(value);
    }
    catch (e) {
        config.onError(utils_1.createError('Error formatting number.', e));
    }
    return String(value);
}
exports.formatNumber = formatNumber;
function formatNumberToParts(config, getNumberFormat, value, options) {
    if (options === void 0) { options = {}; }
    try {
        return getFormatter(config, getNumberFormat, options).formatToParts(value);
    }
    catch (e) {
        config.onError(utils_1.createError('Error formatting number.', e));
    }
    return [];
}
exports.formatNumberToParts = formatNumberToParts;
