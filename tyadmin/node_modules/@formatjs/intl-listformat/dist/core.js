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
function validateInstance(instance, method) {
    if (!(instance instanceof ListFormat)) {
        throw new TypeError("Method Intl.ListFormat.prototype." + method + " called on incompatible receiver " + String(instance));
    }
}
/**
 * https://tc39.es/proposal-intl-list-format/#sec-createstringlistfromiterable
 * @param list list
 */
function stringListFromIterable(list) {
    if (list === undefined) {
        return [];
    }
    var result = [];
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var el = list_1[_i];
        if (typeof el !== 'string') {
            throw new TypeError("array list[" + list.indexOf(el) + "] is not type String");
        }
        result.push(el);
    }
    return result;
}
function createPartsFromList(internalSlotMap, lf, list) {
    var size = list.length;
    if (size === 0) {
        return [];
    }
    if (size === 2) {
        var pattern = intl_utils_1.getInternalSlot(internalSlotMap, lf, 'templatePair');
        var first = { type: 'element', value: list[0] };
        var second = { type: 'element', value: list[1] };
        return deconstructPattern(pattern, { '0': first, '1': second });
    }
    var last = {
        type: 'element',
        value: list[size - 1],
    };
    var parts = last;
    var i = size - 2;
    while (i >= 0) {
        var pattern = void 0;
        if (i === 0) {
            pattern = intl_utils_1.getInternalSlot(internalSlotMap, lf, 'templateStart');
        }
        else if (i < size - 2) {
            pattern = intl_utils_1.getInternalSlot(internalSlotMap, lf, 'templateMiddle');
        }
        else {
            pattern = intl_utils_1.getInternalSlot(internalSlotMap, lf, 'templateEnd');
        }
        var head = { type: 'element', value: list[i] };
        parts = deconstructPattern(pattern, { '0': head, '1': parts });
        i--;
    }
    return parts;
}
function deconstructPattern(pattern, placeables) {
    var patternParts = intl_utils_1.partitionPattern(pattern);
    var result = [];
    for (var _i = 0, patternParts_1 = patternParts; _i < patternParts_1.length; _i++) {
        var patternPart = patternParts_1[_i];
        var part = patternPart.type;
        if (intl_utils_1.isLiteralPart(patternPart)) {
            result.push({
                type: 'literal',
                value: patternPart.value,
            });
        }
        else {
            intl_utils_1.invariant(part in placeables, part + " is missing from placables");
            var subst = placeables[part];
            if (Array.isArray(subst)) {
                result.push.apply(result, subst);
            }
            else {
                result.push(subst);
            }
        }
    }
    return result;
}
var ListFormat = /** @class */ (function () {
    function ListFormat(locales, options) {
        // test262/test/intl402/ListFormat/constructor/constructor/newtarget-undefined.js
        // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
        var newTarget = this && this instanceof ListFormat ? this.constructor : void 0;
        if (!newTarget) {
            throw new TypeError("Intl.ListFormat must be called with 'new'");
        }
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'initializedListFormat', true);
        var requestedLocales = intl_utils_1.getCanonicalLocales(locales);
        var opt = Object.create(null);
        var opts = options === undefined ? Object.create(null) : intl_utils_1.toObject(options);
        var matcher = intl_utils_1.getOption(opts, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
        opt.localeMatcher = matcher;
        var localeData = ListFormat.localeData;
        var r = intl_utils_1.createResolveLocale(ListFormat.getDefaultLocale)(ListFormat.availableLocales, requestedLocales, opt, ListFormat.relevantExtensionKeys, localeData);
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'locale', r.locale);
        var type = intl_utils_1.getOption(opts, 'type', 'string', ['conjunction', 'disjunction', 'unit'], 'conjunction');
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'type', type);
        var style = intl_utils_1.getOption(opts, 'style', 'string', ['long', 'short', 'narrow'], 'long');
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'style', style);
        var dataLocale = r.dataLocale;
        var dataLocaleData = localeData[dataLocale];
        var dataLocaleTypes = dataLocaleData[type];
        var templates = dataLocaleTypes[style];
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templatePair', templates.pair);
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templateStart', templates.start);
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templateMiddle', templates.middle);
        intl_utils_1.setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templateEnd', templates.end);
    }
    ListFormat.prototype.format = function (elements) {
        validateInstance(this, 'format');
        var result = '';
        var parts = createPartsFromList(ListFormat.__INTERNAL_SLOT_MAP__, this, stringListFromIterable(elements));
        if (!Array.isArray(parts)) {
            return parts.value;
        }
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var p = parts_1[_i];
            result += p.value;
        }
        return result;
    };
    ListFormat.prototype.formatToParts = function (elements) {
        validateInstance(this, 'format');
        var parts = createPartsFromList(ListFormat.__INTERNAL_SLOT_MAP__, this, stringListFromIterable(elements));
        if (!Array.isArray(parts)) {
            return [parts];
        }
        var result = [];
        for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
            var part = parts_2[_i];
            result.push(__assign({}, part));
        }
        return result;
    };
    ListFormat.prototype.resolvedOptions = function () {
        validateInstance(this, 'resolvedOptions');
        return {
            locale: intl_utils_1.getInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'locale'),
            type: intl_utils_1.getInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'type'),
            style: intl_utils_1.getInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'style'),
        };
    };
    ListFormat.supportedLocalesOf = function (locales, options) {
        // test262/test/intl402/ListFormat/constructor/supportedLocalesOf/result-type.js
        return intl_utils_1.supportedLocales(ListFormat.availableLocales, intl_utils_1.getCanonicalLocales(locales), options);
    };
    ListFormat.__addLocaleData = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var _loop_1 = function (datum) {
            var availableLocales = Object.keys(__spreadArrays(datum.availableLocales, Object.keys(datum.aliases), Object.keys(datum.parentLocales)).reduce(function (all, k) {
                all[k] = true;
                return all;
            }, {}));
            availableLocales.forEach(function (locale) {
                try {
                    ListFormat.localeData[locale] = intl_utils_1.unpackData(locale, datum);
                }
                catch (e) {
                    // If we can't unpack this data, ignore the locale
                }
            });
        };
        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
            var datum = data_1[_a];
            _loop_1(datum);
        }
        ListFormat.availableLocales = Object.keys(ListFormat.localeData);
        if (!ListFormat.__defaultLocale) {
            ListFormat.__defaultLocale = ListFormat.availableLocales[0];
        }
    };
    ListFormat.getDefaultLocale = function () {
        return ListFormat.__defaultLocale;
    };
    ListFormat.localeData = {};
    ListFormat.availableLocales = [];
    ListFormat.__defaultLocale = 'en';
    ListFormat.relevantExtensionKeys = [];
    ListFormat.polyfilled = true;
    ListFormat.__INTERNAL_SLOT_MAP__ = new WeakMap();
    return ListFormat;
}());
exports.default = ListFormat;
try {
    // IE11 does not have Symbol
    if (typeof Symbol !== 'undefined') {
        Object.defineProperty(ListFormat.prototype, Symbol.toStringTag, {
            value: 'Intl.ListFormat',
            writable: false,
            enumerable: false,
            configurable: true,
        });
    }
    // https://github.com/tc39/test262/blob/master/test/intl402/ListFormat/constructor/length.js
    Object.defineProperty(ListFormat.prototype.constructor, 'length', {
        value: 0,
        writable: false,
        enumerable: false,
        configurable: true,
    });
    // https://github.com/tc39/test262/blob/master/test/intl402/ListFormat/constructor/supportedLocalesOf/length.js
    Object.defineProperty(ListFormat.supportedLocalesOf, 'length', {
        value: 1,
        writable: false,
        enumerable: false,
        configurable: true,
    });
}
catch (e) {
    // Meta fix so we're test262-compliant, not important
}
//# sourceMappingURL=core.js.map