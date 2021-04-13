"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var DISPLAY_NAMES_OPTONS = [
    'localeMatcher',
    'style',
    'type',
    'fallback',
];
function formatDisplayName(_a, getDisplayNames, value, options) {
    var locale = _a.locale, onError = _a.onError;
    if (options === void 0) { options = {}; }
    var DisplayNames = Intl.DisplayNames;
    if (!DisplayNames) {
        onError(utils_1.createError("Intl.DisplayNames is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-displaynames\"\n"));
    }
    var filteredOptions = utils_1.filterProps(options, DISPLAY_NAMES_OPTONS);
    try {
        return getDisplayNames(locale, filteredOptions).of(value);
    }
    catch (e) {
        onError(utils_1.createError('Error formatting display name.', e));
    }
}
exports.formatDisplayName = formatDisplayName;
