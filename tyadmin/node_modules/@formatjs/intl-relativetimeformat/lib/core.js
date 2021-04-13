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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { toObject, getOption, getLocaleHierarchy, supportedLocales, getCanonicalLocales, createResolveLocale, setInternalSlot, getInternalSlot, invariant, partitionPattern, isLiteralPart, } from '@formatjs/intl-utils';
function unpackData(locale, localeData) {
    var localeHierarchy = getLocaleHierarchy(locale, localeData.aliases, localeData.parentLocales);
    var dataToMerge = localeHierarchy
        .map(function (l) { return localeData.data[l]; })
        .filter(Boolean);
    if (!dataToMerge.length) {
        throw new Error("Missing locale data for \"" + locale + "\", lookup hierarchy: " + localeHierarchy.join(', '));
    }
    dataToMerge.reverse();
    return dataToMerge.reduce(function (all, d) { return (__assign(__assign({}, all), d)); }, { nu: [] });
}
/**
 * https://tc39.es/proposal-intl-relative-time/#sec-singularrelativetimeunit
 * @param unit
 */
function singularRelativeTimeUnit(unit) {
    invariant(typeof unit === 'string', "unit must be a string, instead got " + typeof unit, TypeError);
    if (unit === 'seconds')
        return 'second';
    if (unit === 'minutes')
        return 'minute';
    if (unit === 'hours')
        return 'hour';
    if (unit === 'days')
        return 'day';
    if (unit === 'weeks')
        return 'week';
    if (unit === 'months')
        return 'month';
    if (unit === 'quarters')
        return 'quarter';
    if (unit === 'years')
        return 'year';
    if (unit !== 'second' &&
        unit !== 'minute' &&
        unit !== 'hour' &&
        unit !== 'day' &&
        unit !== 'week' &&
        unit !== 'month' &&
        unit !== 'quarter' &&
        unit !== 'year') {
        throw new RangeError("Invalid unit " + unit);
    }
    return unit;
}
var NUMBERING_SYSTEM_REGEX = /^[a-z0-9]{3,8}(-[a-z0-9]{3,8})*$/i;
/**
 * https://tc39.es/proposal-intl-relative-time/#sec-makepartslist
 * @param pattern
 * @param unit
 * @param parts
 */
function makePartsList(pattern, unit, parts) {
    var e_1, _a, e_2, _b;
    var patternParts = partitionPattern(pattern);
    var result = [];
    try {
        for (var patternParts_1 = __values(patternParts), patternParts_1_1 = patternParts_1.next(); !patternParts_1_1.done; patternParts_1_1 = patternParts_1.next()) {
            var patternPart = patternParts_1_1.value;
            if (isLiteralPart(patternPart)) {
                result.push({
                    type: 'literal',
                    value: patternPart.value,
                });
            }
            else {
                invariant(patternPart.type === '0', "Malformed pattern " + pattern);
                try {
                    for (var parts_1 = (e_2 = void 0, __values(parts)), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                        var part = parts_1_1.value;
                        result.push({
                            type: part.type,
                            value: part.value,
                            unit: unit,
                        });
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (parts_1_1 && !parts_1_1.done && (_b = parts_1.return)) _b.call(parts_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (patternParts_1_1 && !patternParts_1_1.done && (_a = patternParts_1.return)) _a.call(patternParts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
function objectIs(x, y) {
    if (Object.is) {
        return Object.is(x, y);
    }
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
    }
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
}
function toString(arg) {
    return arg + '';
}
/**
 * PartitionRelativeTimePattern
 * @param rtf
 * @param value
 * @param unit
 */
function partitionRelativeTimePattern(internalSlotMap, rtf, value, unit) {
    invariant(typeof value === 'number', "value must be number, instead got " + typeof value, TypeError);
    invariant(typeof unit === 'string', "unit must be number, instead got " + typeof value, TypeError);
    if (isNaN(value) || value === Infinity || value === -Infinity) {
        throw new RangeError("Invalid value " + value);
    }
    var resolvedUnit = singularRelativeTimeUnit(unit);
    var fields = getInternalSlot(internalSlotMap, rtf, 'fields');
    var style = getInternalSlot(internalSlotMap, rtf, 'style');
    var entry = resolvedUnit;
    if (style === 'short') {
        entry = unit + "-short";
    }
    else if (style === 'narrow') {
        entry = unit + "-narrow";
    }
    if (!(entry in fields)) {
        entry = unit;
    }
    var patterns = fields[entry];
    var numeric = getInternalSlot(internalSlotMap, rtf, 'numeric');
    if (numeric === 'auto') {
        if (toString(value) in patterns) {
            return [
                {
                    type: 'literal',
                    value: patterns[toString(value)],
                },
            ];
        }
    }
    var tl = 'future';
    if (objectIs(value, -0) || value < 0) {
        tl = 'past';
    }
    var po = patterns[tl];
    var pluralRules = getInternalSlot(internalSlotMap, rtf, 'pluralRules');
    var numberFormat = getInternalSlot(internalSlotMap, rtf, 'numberFormat');
    var fv = typeof numberFormat.formatToParts === 'function'
        ? numberFormat.formatToParts(Math.abs(value))
        : // TODO: If formatToParts is not supported, we assume the whole formatted
            // number is a part
            [
                {
                    type: 'literal',
                    value: numberFormat.format(Math.abs(value)),
                    unit: unit,
                },
            ];
    var pr = pluralRules.select(value);
    var pattern = po[pr];
    return makePartsList(pattern, resolvedUnit, fv);
}
var RelativeTimeFormat = /** @class */ (function () {
    function RelativeTimeFormat(locales, options) {
        // test262/test/intl402/RelativeTimeFormat/constructor/constructor/newtarget-undefined.js
        // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
        var newTarget = this && this instanceof RelativeTimeFormat ? this.constructor : void 0;
        if (!newTarget) {
            throw new TypeError("Intl.RelativeTimeFormat must be called with 'new'");
        }
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat', true);
        var requestedLocales = getCanonicalLocales(locales);
        var opt = Object.create(null);
        var opts = options === undefined ? Object.create(null) : toObject(options);
        var matcher = getOption(opts, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
        opt.localeMatcher = matcher;
        var numberingSystem = getOption(opts, 'numberingSystem', 'string', undefined, undefined);
        if (numberingSystem !== undefined) {
            if (!NUMBERING_SYSTEM_REGEX.test(numberingSystem)) {
                throw new RangeError("Invalid numbering system " + numberingSystem);
            }
        }
        opt.nu = numberingSystem;
        var r = createResolveLocale(RelativeTimeFormat.getDefaultLocale)(RelativeTimeFormat.availableLocales, requestedLocales, opt, RelativeTimeFormat.relevantExtensionKeys, RelativeTimeFormat.localeData);
        var locale = r.locale, nu = r.nu;
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'locale', locale);
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'style', getOption(opts, 'style', 'string', ['long', 'narrow', 'short'], 'long'));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numeric', getOption(opts, 'numeric', 'string', ['always', 'auto'], 'always'));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'fields', RelativeTimeFormat.localeData[locale]);
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numberFormat', new Intl.NumberFormat(locales));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'pluralRules', new Intl.PluralRules(locales));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numberingSystem', nu);
    }
    RelativeTimeFormat.prototype.format = function (value, unit) {
        if (typeof this !== 'object') {
            throw new TypeError('format was called on a non-object');
        }
        if (!getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat')) {
            throw new TypeError('format was called on a invalid context');
        }
        return partitionRelativeTimePattern(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, Number(value), toString(unit))
            .map(function (el) { return el.value; })
            .join('');
    };
    RelativeTimeFormat.prototype.formatToParts = function (value, unit) {
        if (typeof this !== 'object') {
            throw new TypeError('formatToParts was called on a non-object');
        }
        if (!getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat')) {
            throw new TypeError('formatToParts was called on a invalid context');
        }
        return partitionRelativeTimePattern(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, Number(value), toString(unit));
    };
    RelativeTimeFormat.prototype.resolvedOptions = function () {
        if (typeof this !== 'object') {
            throw new TypeError('resolvedOptions was called on a non-object');
        }
        if (!getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat')) {
            throw new TypeError('resolvedOptions was called on a invalid context');
        }
        // test262/test/intl402/RelativeTimeFormat/prototype/resolvedOptions/type.js
        return {
            locale: getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'locale'),
            style: getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'style'),
            numeric: getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numeric'),
            numberingSystem: getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numberingSystem'),
        };
    };
    RelativeTimeFormat.supportedLocalesOf = function (locales, options) {
        return supportedLocales(RelativeTimeFormat.availableLocales, getCanonicalLocales(locales), options);
    };
    RelativeTimeFormat.__addLocaleData = function () {
        var e_3, _a;
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var _loop_1 = function (datum) {
            var availableLocales = Object.keys(__spread(datum.availableLocales, Object.keys(datum.aliases), Object.keys(datum.parentLocales)).reduce(function (all, k) {
                all[k] = true;
                return all;
            }, {}));
            availableLocales.forEach(function (locale) {
                try {
                    RelativeTimeFormat.localeData[locale] = unpackData(locale, datum);
                }
                catch (e) {
                    // If we can't unpack this data, ignore the locale
                }
            });
        };
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var datum = data_1_1.value;
                _loop_1(datum);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        RelativeTimeFormat.availableLocales = Object.keys(RelativeTimeFormat.localeData);
        if (!RelativeTimeFormat.__defaultLocale) {
            RelativeTimeFormat.__defaultLocale =
                RelativeTimeFormat.availableLocales[0];
        }
    };
    RelativeTimeFormat.getDefaultLocale = function () {
        return RelativeTimeFormat.__defaultLocale;
    };
    RelativeTimeFormat.localeData = {};
    RelativeTimeFormat.availableLocales = [];
    RelativeTimeFormat.__defaultLocale = 'en';
    RelativeTimeFormat.relevantExtensionKeys = ['nu'];
    RelativeTimeFormat.polyfilled = true;
    RelativeTimeFormat.__INTERNAL_SLOT_MAP__ = new WeakMap();
    return RelativeTimeFormat;
}());
export default RelativeTimeFormat;
try {
    // IE11 does not have Symbol
    if (typeof Symbol !== 'undefined') {
        Object.defineProperty(RelativeTimeFormat.prototype, Symbol.toStringTag, {
            value: 'Intl.RelativeTimeFormat',
            writable: false,
            enumerable: false,
            configurable: true,
        });
    }
    // https://github.com/tc39/test262/blob/master/test/intl402/RelativeTimeFormat/constructor/length.js
    Object.defineProperty(RelativeTimeFormat.prototype.constructor, 'length', {
        value: 0,
        writable: false,
        enumerable: false,
        configurable: true,
    });
    // https://github.com/tc39/test262/blob/master/test/intl402/RelativeTimeFormat/constructor/supportedLocalesOf/length.js
    Object.defineProperty(RelativeTimeFormat.supportedLocalesOf, 'length', {
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