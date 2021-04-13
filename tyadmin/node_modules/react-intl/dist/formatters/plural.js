"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var PLURAL_FORMAT_OPTIONS = [
    'localeMatcher',
    'type',
];
function formatPlural(_a, getPluralRules, value, options) {
    var locale = _a.locale, onError = _a.onError;
    if (options === void 0) { options = {}; }
    if (!Intl.PluralRules) {
        onError(utils_1.createError("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n"));
    }
    var filteredOptions = utils_1.filterProps(options, PLURAL_FORMAT_OPTIONS);
    try {
        return getPluralRules(locale, filteredOptions).select(value);
    }
    catch (e) {
        onError(utils_1.createError('Error formatting plural.', e));
    }
    return 'other';
}
exports.formatPlural = formatPlural;
