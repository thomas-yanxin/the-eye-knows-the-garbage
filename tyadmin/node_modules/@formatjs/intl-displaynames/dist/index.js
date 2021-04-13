"use strict";
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
var intl_utils_1 = require("@formatjs/intl-utils");
var DisplayNames = /** @class */ (function () {
    function DisplayNames(locales, options) {
        var _newTarget = this.constructor;
        if (options === void 0) { options = Object.create(null); }
        if (_newTarget === undefined) {
            throw TypeError("Constructor Intl.DisplayNames requires 'new'");
        }
        var requestedLocales = intl_utils_1.getCanonicalLocales(locales);
        var matcher = intl_utils_1.getOption(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
        var r = intl_utils_1.createResolveLocale(DisplayNames.getDefaultLocale)(DisplayNames.availableLocales, requestedLocales, { localeMatcher: matcher }, [], // there is no relevantExtensionKeys
        DisplayNames.localeData);
        var style = intl_utils_1.getOption(options, 'style', 'string', ['narrow', 'short', 'long'], 'long');
        setSlot(this, 'style', style);
        var type = intl_utils_1.getOption(options, 'type', 'string', ['language', 'currency', 'region', 'script'], 'language');
        setSlot(this, 'type', type);
        var fallback = intl_utils_1.getOption(options, 'fallback', 'string', ['code', 'none'], 'code');
        setSlot(this, 'fallback', fallback);
        setSlot(this, 'locale', r.locale);
        var dataLocale = r.dataLocale;
        var dataLocaleData = DisplayNames.localeData[dataLocale];
        intl_utils_1.invariant(dataLocaleData !== undefined, "locale data for " + r.locale + " does not exist.");
        setSlot(this, 'localeData', dataLocaleData);
    }
    DisplayNames.supportedLocalesOf = function (locales, options) {
        return intl_utils_1.supportedLocales(DisplayNames.availableLocales, intl_utils_1.getCanonicalLocales(locales), options);
    };
    DisplayNames.__addLocaleData = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
            var datum = data_1[_a];
            var availableLocales = Object.keys(__spreadArrays(datum.availableLocales, Object.keys(datum.aliases), Object.keys(datum.parentLocales)).reduce(function (all, k) {
                all[k] = true;
                return all;
            }, {}));
            for (var _b = 0, availableLocales_1 = availableLocales; _b < availableLocales_1.length; _b++) {
                var locale = availableLocales_1[_b];
                try {
                    DisplayNames.localeData[locale] = intl_utils_1.unpackData(locale, datum);
                }
                catch (e) {
                    // If we can't unpack this data, ignore the locale
                }
            }
        }
        DisplayNames.availableLocales = Object.keys(DisplayNames.localeData);
        if (!DisplayNames.__defaultLocale) {
            DisplayNames.__defaultLocale = DisplayNames.availableLocales[0];
        }
    };
    DisplayNames.prototype.of = function (code) {
        checkReceiver(this, 'of');
        var type = getSlot(this, 'type');
        var codeAsString = intl_utils_1.toString(code);
        if (!isValidCodeForDisplayNames(type, codeAsString)) {
            throw RangeError('invalid code for Intl.DisplayNames.prototype.of');
        }
        var _a = intl_utils_1.getMultiInternalSlots(__INTERNAL_SLOT_MAP__, this, 'localeData', 'style', 'fallback'), localeData = _a.localeData, style = _a.style, fallback = _a.fallback;
        // Canonicalize the case.
        var canonicalCode;
        // This is only used to store extracted language region.
        var regionSubTag;
        switch (type) {
            // Normalize the locale id and remove the region.
            case 'language': {
                canonicalCode = intl_utils_1.getCanonicalLocales(codeAsString)[0];
                var regionMatch = /-([a-z]{2}|\d{3})\b/i.exec(canonicalCode);
                if (regionMatch) {
                    // Remove region subtag
                    canonicalCode =
                        canonicalCode.substring(0, regionMatch.index) +
                            canonicalCode.substring(regionMatch.index + regionMatch[0].length);
                    regionSubTag = regionMatch[1];
                }
                break;
            }
            // currency code should be all upper-case.
            case 'currency':
                canonicalCode = codeAsString.toUpperCase();
                break;
            // script code should be title case
            case 'script':
                canonicalCode =
                    codeAsString[0] + codeAsString.substring(1).toLowerCase();
                break;
            // region shold be all upper-case
            case 'region':
                canonicalCode = codeAsString.toUpperCase();
                break;
        }
        var typesData = localeData.types[type];
        // If the style of choice does not exist, fallback to "long".
        var name = typesData[style][canonicalCode] || typesData.long[canonicalCode];
        if (name !== undefined) {
            // If there is a region subtag in the language id, use locale pattern to interpolate the region
            if (regionSubTag) {
                // Retrieve region display names
                var regionsData = localeData.types.region;
                var regionDisplayName = regionsData[style][regionSubTag] || regionsData.long[regionSubTag];
                if (regionDisplayName || fallback === 'code') {
                    // Interpolate into locale-specific pattern.
                    var pattern = localeData.patterns.locale;
                    return pattern
                        .replace('{0}', name)
                        .replace('{1}', regionDisplayName || regionSubTag);
                }
            }
            else {
                return name;
            }
        }
        if (fallback === 'code') {
            return codeAsString;
        }
    };
    DisplayNames.prototype.resolvedOptions = function () {
        checkReceiver(this, 'resolvedOptions');
        return __assign({}, intl_utils_1.getMultiInternalSlots(__INTERNAL_SLOT_MAP__, this, 'locale', 'style', 'type', 'fallback'));
    };
    DisplayNames.getDefaultLocale = function () {
        return DisplayNames.__defaultLocale;
    };
    DisplayNames.localeData = {};
    DisplayNames.availableLocales = [];
    DisplayNames.__defaultLocale = 'en';
    DisplayNames.polyfilled = true;
    return DisplayNames;
}());
exports.DisplayNames = DisplayNames;
// https://tc39.es/proposal-intl-displaynames/#sec-isvalidcodefordisplaynames
function isValidCodeForDisplayNames(type, code) {
    switch (type) {
        case 'language':
            // subset of unicode_language_id
            // languageCode ["-" scriptCode] ["-" regionCode] *("-" variant)
            // where:
            // - languageCode is either a two letters ISO 639-1 language code or a three letters ISO 639-2 language code.
            // - scriptCode is should be an ISO-15924 four letters script code
            // - regionCode is either an ISO-3166 two letters region code, or a three digits UN M49 Geographic Regions.
            return /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?(-([a-z\d]{5,8}|\d[a-z\d]{3}))*$/i.test(code);
        case 'region':
            // unicode_region_subtag
            return /^([a-z]{2}|\d{3})$/i.test(code);
        case 'script':
            // unicode_script_subtag
            return /^[a-z]{4}$/i.test(code);
        case 'currency':
            return intl_utils_1.isWellFormedCurrencyCode(code);
    }
}
try {
    // IE11 does not have Symbol
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(DisplayNames.prototype, Symbol.toStringTag, {
            value: 'Intl.DisplayNames',
            configurable: true,
            enumerable: false,
            writable: false,
        });
    }
    Object.defineProperty(DisplayNames, 'length', {
        value: 0,
        writable: false,
        enumerable: false,
        configurable: true,
    });
}
catch (e) {
    // Make test 262 compliant
}
var __INTERNAL_SLOT_MAP__ = new WeakMap();
function getSlot(instance, key) {
    return intl_utils_1.getInternalSlot(__INTERNAL_SLOT_MAP__, instance, key);
}
function setSlot(instance, key, value) {
    intl_utils_1.setInternalSlot(__INTERNAL_SLOT_MAP__, instance, key, value);
}
function checkReceiver(receiver, methodName) {
    if (!(receiver instanceof DisplayNames)) {
        throw TypeError("Method Intl.DisplayNames.prototype." + methodName + " called on incompatible receiver");
    }
}
//# sourceMappingURL=index.js.map