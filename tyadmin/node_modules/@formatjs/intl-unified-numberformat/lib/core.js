var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { createResolveLocale, toObject, supportedLocales, getCanonicalLocales, setInternalSlot, setMultiInternalSlots, getMultiInternalSlots, getOption, getInternalSlot, InternalSlotToken, setNumberFormatDigitOptions, SANCTIONED_UNITS, invariant, objectIs, unpackData, partitionPattern, isWellFormedCurrencyCode, } from '@formatjs/intl-utils';
import { toRawFixed, toRawPrecision, getMagnitude, repeat, } from './utils';
import { extractILD, Patterns } from './data';
import * as currencyDigitsData from './currency-digits.json';
import * as ILND from './ilnd-numbers.json';
import { names as numberingSystemNames } from './numbering-systems.json';
var VALID_NUMBERING_SYSTEM_NAMES = Object.create(null);
for (var _i = 0, numberingSystemNames_1 = numberingSystemNames; _i < numberingSystemNames_1.length; _i++) {
    var nu = numberingSystemNames_1[_i];
    VALID_NUMBERING_SYSTEM_NAMES[nu] = true;
}
var RESOLVED_OPTIONS_KEYS = [
    'locale',
    'numberingSystem',
    'style',
    'currency',
    'currencyDisplay',
    'currencySign',
    'unit',
    'unitDisplay',
    'minimumIntegerDigits',
    'minimumFractionDigits',
    'maximumFractionDigits',
    'minimumSignificantDigits',
    'maximumSignificantDigits',
    'useGrouping',
    'notation',
    'compactDisplay',
    'signDisplay',
];
var SHORTENED_SACTION_UNITS = SANCTIONED_UNITS.map(function (unit) {
    return unit.replace(/^(.*?)-/, '');
});
/**
 * This follows https://tc39.es/ecma402/#sec-case-sensitivity-and-case-mapping
 * @param str string to convert
 */
function toLowerCase(str) {
    return str.replace(/([A-Z])/g, function (_, c) { return c.toLowerCase(); });
}
/**
 * https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-iswellformedunitidentifier
 * @param unit
 */
function isWellFormedUnitIdentifier(unit) {
    unit = toLowerCase(unit);
    if (SHORTENED_SACTION_UNITS.indexOf(unit) > -1) {
        return true;
    }
    var units = unit.split('-per-');
    if (units.length !== 2) {
        return false;
    }
    if (SHORTENED_SACTION_UNITS.indexOf(units[0]) < 0 ||
        SHORTENED_SACTION_UNITS.indexOf(units[1]) < 0) {
        return false;
    }
    return true;
}
/**
 * Check if a formatting number with unit is supported
 * @public
 * @param unit unit to check
 */
export function isUnitSupported(unit) {
    try {
        new Intl.NumberFormat(undefined, {
            style: 'unit',
            unit: unit,
        });
    }
    catch (e) {
        return false;
    }
    return true;
}
/**
 * Chop off the unicode extension from the locale string.
 */
function removeUnicodeExtensionFromLocale(canonicalLocale) {
    var extensionIndex = canonicalLocale.indexOf('-u-');
    return extensionIndex >= 0
        ? canonicalLocale.slice(0, extensionIndex)
        : canonicalLocale;
}
var __INTERNAL_SLOT_MAP__ = new WeakMap();
function currencyDigits(c) {
    return c in currencyDigitsData ? currencyDigitsData[c] : 2;
}
function initializeNumberFormat(nf, locales, opts) {
    var requestedLocales = getCanonicalLocales(locales);
    var options = opts === undefined ? Object.create(null) : toObject(opts);
    var opt = Object.create(null);
    var matcher = getOption(options, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
    opt.localeMatcher = matcher;
    var numberingSystem = getOption(options, 'numberingSystem', 'string', undefined, undefined);
    if (numberingSystem !== undefined &&
        !VALID_NUMBERING_SYSTEM_NAMES[numberingSystem]) {
        // 8.a. If numberingSystem does not match the Unicode Locale Identifier type nonterminal,
        // throw a RangeError exception.
        throw RangeError("Invalid numberingSystems: " + numberingSystem);
    }
    opt.nu = numberingSystem;
    var localeData = UnifiedNumberFormat.localeData;
    var r = createResolveLocale(UnifiedNumberFormat.getDefaultLocale)(UnifiedNumberFormat.availableLocales, requestedLocales, opt, 
    // [[RelevantExtensionKeys]] slot, which is a constant
    ['nu'], localeData);
    var ildData = localeData[removeUnicodeExtensionFromLocale(r.locale)];
    setMultiInternalSlots(__INTERNAL_SLOT_MAP__, nf, {
        locale: r.locale,
        dataLocale: r.dataLocale,
        numberingSystem: r.nu,
        ild: extractILD(ildData.units, ildData.currencies, ildData.numbers, r.nu),
    });
    // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-setnumberformatunitoptions
    setNumberFormatUnitOptions(nf, options);
    var style = getInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'style');
    // ---
    var mnfdDefault;
    var mxfdDefault;
    if (style === 'currency') {
        var currency = getInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'currency');
        var cDigits = currencyDigits(currency);
        mnfdDefault = cDigits;
        mxfdDefault = cDigits;
    }
    else {
        mnfdDefault = 0;
        mxfdDefault = style === 'percent' ? 0 : 3;
    }
    var notation = getOption(options, 'notation', 'string', ['standard', 'scientific', 'engineering', 'compact'], 'standard');
    setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'notation', notation);
    setNumberFormatDigitOptions(__INTERNAL_SLOT_MAP__, nf, options, mnfdDefault, mxfdDefault);
    var compactDisplay = getOption(options, 'compactDisplay', 'string', ['short', 'long'], 'short');
    if (notation === 'compact') {
        setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'compactDisplay', compactDisplay);
    }
    var useGrouping = getOption(options, 'useGrouping', 'boolean', undefined, true);
    setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'useGrouping', useGrouping);
    var signDisplay = getOption(options, 'signDisplay', 'string', ['auto', 'never', 'always', 'exceptZero'], 'auto');
    setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'signDisplay', signDisplay);
}
function partitionNumberPattern(numberFormat, x) {
    var pl = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'pl');
    var exponent = 0;
    var ild = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'ild');
    var n;
    var formattedX = x;
    if (isNaN(x)) {
        n = ild.symbols.nan;
    }
    else if (!isFinite(x)) {
        n = ild.symbols.infinity;
    }
    else {
        if (getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style') ===
            'percent') {
            formattedX *= 100;
        }
        exponent = computeExponent(numberFormat, formattedX);
        formattedX /= Math.pow(10, exponent);
        var formatNumberResult = formatNumberToString(numberFormat, formattedX);
        n = formatNumberResult.formattedString;
        formattedX = formatNumberResult.roundedNumber;
    }
    var pattern = getNumberFormatPattern(numberFormat, x, exponent);
    var patternParts = partitionPattern(pattern);
    var results = [];
    // Unspec'ed stuff
    // This is to deal w/ cases where {number} is in the middle of a unit pattern
    var unitSymbolChunkIndex = 0;
    var notation = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'notation');
    for (var _i = 0, patternParts_1 = patternParts; _i < patternParts_1.length; _i++) {
        var part = patternParts_1[_i];
        switch (part.type) {
            case 'literal':
                results.push(part);
                break;
            case InternalSlotToken.number: {
                if (isNaN(formattedX)) {
                    results.push({ type: 'nan', value: n });
                }
                else if (formattedX === Infinity || x === -Infinity) {
                    results.push({ type: 'infinity', value: n });
                }
                else {
                    var _a = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'numberingSystem', 'useGrouping', 'notation'), nu = _a.numberingSystem, useGrouping = _a.useGrouping;
                    if (nu && nu in ILND) {
                        // Replace digits
                        var replacementTable = ILND[nu];
                        var replacedDigits = '';
                        for (var _b = 0, n_1 = n; _b < n_1.length; _b++) {
                            var digit = n_1[_b];
                            // digit can be `.` if it's fractional
                            replacedDigits += replacementTable[+digit] || digit;
                        }
                        n = replacedDigits;
                    }
                    var decimalSepIndex = n.indexOf('.');
                    var integer = void 0;
                    var fraction = void 0;
                    if (decimalSepIndex > 0) {
                        integer = n.slice(0, decimalSepIndex);
                        fraction = n.slice(decimalSepIndex + 1);
                    }
                    else {
                        integer = n;
                    }
                    // For compact, default grouping strategy is min2
                    if (useGrouping &&
                        (notation === 'compact' ? integer.length > 4 : true)) {
                        var groupSepSymbol = ild.symbols.group;
                        var groups = [];
                        // Assuming that the group separator is always inserted between every 3 digits.
                        var i = integer.length - 3;
                        for (; i > 0; i -= 3) {
                            groups.push(integer.slice(i, i + 3));
                        }
                        groups.push(integer.slice(0, i + 3));
                        while (groups.length > 0) {
                            var integerGroup = groups.pop();
                            results.push({ type: 'integer', value: integerGroup });
                            if (groups.length > 0) {
                                results.push({ type: 'group', value: groupSepSymbol });
                            }
                        }
                    }
                    else {
                        results.push({ type: 'integer', value: integer });
                    }
                    if (fraction !== undefined) {
                        results.push({ type: 'decimal', value: ild.symbols.decimal }, { type: 'fraction', value: fraction });
                    }
                }
                break;
            }
            case InternalSlotToken.plusSign:
                results.push({
                    type: 'plusSign',
                    value: ild.symbols.plusSign,
                });
                break;
            case InternalSlotToken.minusSign:
                results.push({
                    type: 'minusSign',
                    value: ild.symbols.minusSign,
                });
                break;
            case InternalSlotToken.compactSymbol: {
                var style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
                var compactData = void 0;
                if (style === 'currency') {
                    compactData = ild.currency.compactShort;
                }
                else {
                    compactData = ild.decimal.compactShort;
                }
                if (compactData) {
                    results.push({
                        type: 'compact',
                        value: selectPlural(pl, x, compactData[String(Math.pow(10, exponent))]),
                    });
                }
                break;
            }
            case InternalSlotToken.compactName: {
                var style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
                var currencyDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currencyDisplay');
                var compactData = void 0;
                if (style === 'currency' && currencyDisplay !== 'name') {
                    compactData = ild.currency.compactLong || ild.currency.compactShort;
                }
                else {
                    compactData = ild.decimal.compactLong || ild.decimal.compactShort;
                }
                if (compactData) {
                    results.push({
                        type: 'compact',
                        value: selectPlural(pl, x, compactData[String(Math.pow(10, exponent))]),
                    });
                }
                break;
            }
            case InternalSlotToken.scientificSeparator:
                results.push({
                    type: 'exponentSeparator',
                    value: ild.symbols.exponential,
                });
                break;
            case InternalSlotToken.scientificExponent: {
                if (exponent < 0) {
                    results.push({
                        type: 'exponentMinusSign',
                        value: ild.symbols.minusSign,
                    });
                    exponent = -exponent;
                }
                var exponentResult = toRawFixed(exponent, 0, 0);
                results.push({
                    type: 'exponentInteger',
                    value: exponentResult.formattedString,
                });
                break;
            }
            case InternalSlotToken.percentSign:
                results.push({
                    type: 'percentSign',
                    value: ild.symbols.percentSign,
                });
                break;
            case InternalSlotToken.unitSymbol:
            case InternalSlotToken.unitNarrowSymbol:
            case InternalSlotToken.unitName: {
                var style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
                if (style === 'unit') {
                    var unit = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'unit');
                    var unitSymbols = ild.unitSymbols[unit];
                    var mu = selectPlural(pl, x, unitSymbols[part.type])[unitSymbolChunkIndex];
                    results.push({ type: 'unit', value: mu });
                    unitSymbolChunkIndex++;
                }
                break;
            }
            case InternalSlotToken.currencyCode: {
                var currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                results.push({ type: 'currency', value: currency });
                break;
            }
            case InternalSlotToken.currencySymbol: {
                var currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                results.push({
                    type: 'currency',
                    value: ild.currencySymbols[currency].currencySymbol || currency,
                });
                break;
            }
            case InternalSlotToken.currencyNarrowSymbol: {
                var currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                results.push({
                    type: 'currency',
                    value: ild.currencySymbols[currency].currencyNarrowSymbol || currency,
                });
                break;
            }
            case InternalSlotToken.currencyName: {
                var currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                var cd = selectPlural(pl, x, ild.currencySymbols[currency].currencyName);
                results.push({ type: 'currency', value: cd });
                break;
            }
            default:
                throw Error("unrecognized pattern part \"" + part.type + "\" in \"" + pattern + "\"");
        }
    }
    return results;
}
function formatNumericToParts(numberFormat, x) {
    return partitionNumberPattern(numberFormat, x);
}
export var UnifiedNumberFormat = function NumberFormat(locales, options) {
    // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
    if (!this || !(this instanceof UnifiedNumberFormat)) {
        return new UnifiedNumberFormat(locales, options);
    }
    initializeNumberFormat(this, locales, options);
    var ildData = UnifiedNumberFormat.localeData[removeUnicodeExtensionFromLocale(getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'locale'))];
    setMultiInternalSlots(__INTERNAL_SLOT_MAP__, this, {
        pl: new Intl.PluralRules(locales, getMultiInternalSlots(__INTERNAL_SLOT_MAP__, this, 'minimumFractionDigits', 'maximumFractionDigits', 'minimumIntegerDigits', 'minimumSignificantDigits', 'maximumSignificantDigits', 'roundingType', 'notation')),
        patterns: new Patterns(ildData.units, ildData.currencies, ildData.numbers, getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'numberingSystem'), getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'unit'), getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'currency'), getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'currencySign')),
    });
};
/*
  17 ECMAScript Standard Built-in Objects:
    Every built-in Function object, including constructors, that is not
    identified as an anonymous function has a name property whose value
    is a String.

    Unless otherwise specified, the name property of a built-in Function
    object, if it exists, has the attributes { [[Writable]]: false,
    [[Enumerable]]: false, [[Configurable]]: true }.
*/
function defineProperty(target, name, _a) {
    var value = _a.value;
    Object.defineProperty(target, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value,
    });
}
defineProperty(UnifiedNumberFormat.prototype, 'formatToParts', {
    value: function formatToParts(x) {
        return formatNumericToParts(this, toNumeric(x));
    },
});
defineProperty(UnifiedNumberFormat.prototype, 'resolvedOptions', {
    value: function resolvedOptions() {
        var slots = getMultiInternalSlots.apply(void 0, __spreadArrays([__INTERNAL_SLOT_MAP__,
            this], RESOLVED_OPTIONS_KEYS));
        var ro = {};
        for (var _i = 0, RESOLVED_OPTIONS_KEYS_1 = RESOLVED_OPTIONS_KEYS; _i < RESOLVED_OPTIONS_KEYS_1.length; _i++) {
            var key = RESOLVED_OPTIONS_KEYS_1[_i];
            var value = slots[key];
            if (value !== undefined) {
                ro[key] = value;
            }
        }
        return ro;
    },
});
var formatDescriptor = {
    enumerable: false,
    configurable: true,
    get: function () {
        if (typeof this !== 'object' || !(this instanceof UnifiedNumberFormat)) {
            throw TypeError('Intl.NumberFormat format property accessor called on imcompatible receiver');
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var numberFormat = this;
        var boundFormat = getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'boundFormat');
        if (boundFormat === undefined) {
            // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_diff_out.html#sec-number-format-functions
            boundFormat = function (value) {
                // TODO: check bigint
                var x = toNumeric(value);
                return numberFormat
                    .formatToParts(x)
                    .map(function (x) { return x.value; })
                    .join('');
            };
            // https://github.com/tc39/test262/blob/master/test/intl402/NumberFormat/prototype/format/format-function-name.js
            Object.defineProperty(boundFormat, 'name', {
                configurable: true,
                enumerable: false,
                writable: false,
                value: '',
            });
            setInternalSlot(__INTERNAL_SLOT_MAP__, this, 'boundFormat', boundFormat);
        }
        return boundFormat;
    },
};
// https://github.com/tc39/test262/blob/master/test/intl402/NumberFormat/prototype/format/name.js
Object.defineProperty(formatDescriptor.get, 'name', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: 'get format',
});
Object.defineProperty(UnifiedNumberFormat.prototype, 'format', formatDescriptor);
// Static properties
defineProperty(UnifiedNumberFormat, 'supportedLocalesOf', {
    value: function supportedLocalesOf(locales, options) {
        return supportedLocales(UnifiedNumberFormat.availableLocales, getCanonicalLocales(locales), options);
    },
});
UnifiedNumberFormat.__addLocaleData = function __addLocaleData() {
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
                UnifiedNumberFormat.localeData[locale] = unpackData(locale, datum);
            }
            catch (e) {
                // Ignore if we got no data
            }
        }
    }
    UnifiedNumberFormat.availableLocales = Object.keys(UnifiedNumberFormat.localeData);
    if (!UnifiedNumberFormat.__defaultLocale) {
        UnifiedNumberFormat.__defaultLocale =
            UnifiedNumberFormat.availableLocales[0];
    }
};
UnifiedNumberFormat.__defaultLocale = 'en';
UnifiedNumberFormat.localeData = {};
UnifiedNumberFormat.availableLocales = [];
UnifiedNumberFormat.getDefaultLocale = function () {
    return UnifiedNumberFormat.__defaultLocale;
};
UnifiedNumberFormat.polyfilled = true;
function setNumberFormatUnitOptions(nf, options) {
    if (options === void 0) { options = Object.create(null); }
    // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-setnumberformatunitoptions
    var style = getOption(options, 'style', 'string', ['decimal', 'percent', 'currency', 'unit'], 'decimal');
    setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'style', style);
    var currency = getOption(options, 'currency', 'string', undefined, undefined);
    if (currency !== undefined && !isWellFormedCurrencyCode(currency)) {
        throw RangeError('Malformed currency code');
    }
    var currencyDisplay = getOption(options, 'currencyDisplay', 'string', ['code', 'symbol', 'narrowSymbol', 'name'], 'symbol');
    var currencySign = getOption(options, 'currencySign', 'string', ['standard', 'accounting'], 'standard');
    var unit = getOption(options, 'unit', 'string', undefined, undefined);
    if (unit !== undefined && !isWellFormedUnitIdentifier(unit)) {
        throw RangeError('Invalid unit argument for Intl.NumberFormat()');
    }
    var unitDisplay = getOption(options, 'unitDisplay', 'string', ['short', 'narrow', 'long'], 'short');
    if (style === 'currency') {
        if (currency === undefined) {
            throw new TypeError('currency cannot be undefined');
        }
        setMultiInternalSlots(__INTERNAL_SLOT_MAP__, nf, {
            currency: currency.toUpperCase(),
            currencyDisplay: currencyDisplay,
            currencySign: currencySign,
        });
    }
    else if (style === 'unit') {
        if (unit === undefined) {
            throw new TypeError('unit cannot be undefined');
        }
        setMultiInternalSlots(__INTERNAL_SLOT_MAP__, nf, {
            unit: unit,
            unitDisplay: unitDisplay,
        });
    }
}
// Taking the shortcut here and used the native NumberFormat for formatting numbers.
function formatNumberToString(numberFormat, x) {
    var isNegative = x < 0 || objectIs(x, -0);
    if (isNegative) {
        x = -x;
    }
    var _a = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'roundingType', 'minimumFractionDigits', 'maximumFractionDigits', 'minimumIntegerDigits', 'minimumSignificantDigits', 'maximumSignificantDigits'), roundingType = _a.roundingType, minimumSignificantDigits = _a.minimumSignificantDigits, maximumSignificantDigits = _a.maximumSignificantDigits, minimumFractionDigits = _a.minimumFractionDigits, maximumFractionDigits = _a.maximumFractionDigits, minimumIntegerDigits = _a.minimumIntegerDigits;
    var result;
    if (roundingType === 'significantDigits') {
        result = toRawPrecision(x, minimumSignificantDigits, maximumSignificantDigits);
    }
    else if (roundingType === 'fractionDigits') {
        result = toRawFixed(x, minimumFractionDigits, maximumFractionDigits);
    }
    else {
        invariant(roundingType === 'compactRounding', 'roundingType must be compactRounding');
        result = toRawPrecision(x, 1, 2);
        if (result.integerDigitsCount > 1) {
            result = toRawFixed(x, 0, 0);
        }
    }
    x = result.roundedNumber;
    var string = result.formattedString;
    var int = result.integerDigitsCount;
    var minInteger = minimumIntegerDigits;
    if (int < minInteger) {
        var forwardZeros = repeat('0', minInteger - int);
        string = forwardZeros + string;
    }
    if (isNegative) {
        x = -x;
    }
    return { roundedNumber: x, formattedString: string };
}
/**
 * The abstract operation ComputeExponent computes an exponent (power of ten) by which to scale x
 * according to the number formatting settings. It handles cases such as 999 rounding up to 1000,
 * requiring a different exponent.
 */
function computeExponent(numberFormat, x) {
    if (x === 0) {
        return 0;
    }
    if (x < 0) {
        x = -x;
    }
    var magnitude = getMagnitude(x);
    var exponent = computeExponentForMagnitude(numberFormat, magnitude);
    x = x / Math.pow(10, exponent); // potential IEEE floating point error
    var formatNumberResult = formatNumberToString(numberFormat, x);
    if (formatNumberResult.roundedNumber === 0) {
        return exponent;
    }
    var newMagnitude = getMagnitude(x);
    if (newMagnitude === magnitude - exponent) {
        return exponent;
    }
    return computeExponentForMagnitude(numberFormat, magnitude + 1);
}
/**
 * The abstract operation ComputeExponentForMagnitude computes an exponent by which to scale a
 * number of the given magnitude (power of ten of the most significant digit) according to the
 * locale and the desired notation (scientific, engineering, or compact).
 */
function computeExponentForMagnitude(numberFormat, magnitude) {
    var _a;
    var notation = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'notation');
    var style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
    var ild = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'ild');
    switch (notation) {
        case 'standard':
            return 0;
        case 'scientific':
            return magnitude;
        case 'engineering':
            return Math.floor(magnitude / 3) * 3;
        case 'compact': {
            var compactDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'compactDisplay');
            var currencyDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currencyDisplay');
            var thresholdMap = void 0;
            if (style === 'currency' && currencyDisplay !== 'name') {
                thresholdMap =
                    (compactDisplay === 'long'
                        ? ild.currency.compactLong
                        : ild.currency.compactShort) || ild.currency.compactShort;
            }
            else {
                thresholdMap =
                    compactDisplay === 'long'
                        ? ild.decimal.compactLong
                        : ild.decimal.compactShort;
            }
            if (!thresholdMap) {
                return 0;
            }
            var num = String(Math.pow(10, magnitude));
            var thresholds = Object.keys(thresholdMap); // TODO: this can be pre-processed
            if (!((_a = thresholdMap[num]) === null || _a === void 0 ? void 0 : _a.other)) {
                return 0;
            }
            if (num < thresholds[0]) {
                return 0;
            }
            if (num > thresholds[thresholds.length - 1]) {
                return getMagnitude(+thresholds[thresholds.length - 1]);
            }
            var i = thresholds.indexOf(num);
            for (; i > 0 &&
                thresholdMap[thresholds[i - 1]].other === thresholdMap[num].other; i--)
                ;
            return getMagnitude(+thresholds[i]);
        }
    }
}
/**
 * https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-getnumberformatpattern
 *
 * The abstract operation GetNumberFormatPattern considers the resolved unit-related options in the
 * number format object along with the final scaled and rounded number being formatted and returns a
 * pattern, a String value as described in 1.3.3.
 */
function getNumberFormatPattern(numberFormat, x, exponent) {
    var _a = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'style', 'patterns', 'signDisplay', 'notation'), style = _a.style, slots = _a.patterns;
    var patterns;
    switch (style) {
        case 'percent':
            patterns = slots.percent;
            break;
        case 'unit': {
            var unitDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'unitDisplay');
            var unit = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'unit');
            patterns = slots.unit[unit][unitDisplay];
            break;
        }
        case 'currency': {
            var _b = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'currency', 'currencyDisplay', 'currencySign'), currency = _b.currency, currencyDisplay = _b.currencyDisplay, currencySign = _b.currencySign;
            patterns = slots.currency[currency][currencyDisplay][currencySign];
            break;
        }
        case 'decimal':
            patterns = slots.decimal;
            break;
    }
    var notation = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'notation');
    var signDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'signDisplay');
    var signDisplayPattern = patterns[signDisplay];
    var signPattern;
    if (!isNaN(x) && isFinite(x)) {
        if (notation === 'scientific' || notation === 'engineering') {
            signPattern = signDisplayPattern.scientific;
        }
        else if (exponent !== 0) {
            invariant(notation === 'compact', 'notation must be compact');
            var compactDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'compactDisplay');
            var decimalNum = String(Math.pow(10, exponent));
            if (compactDisplay === 'short' && exponent > 2 && exponent < 15) {
                signPattern = signDisplayPattern.compactShort[decimalNum];
            }
            else if (exponent > 2 && exponent < 15) {
                invariant(compactDisplay === 'long', 'compactDisplay must be long');
                signPattern = signDisplayPattern.compactLong[decimalNum];
            }
        }
    }
    if (!signPattern) {
        signPattern = signDisplayPattern.standard;
    }
    var pattern;
    if (signDisplay === 'never') {
        pattern = signPattern.zeroPattern;
    }
    else if (signDisplay === 'auto') {
        if (objectIs(x, 0) || x > 0 || isNaN(x)) {
            pattern = signPattern.zeroPattern;
        }
        else {
            pattern = signPattern.negativePattern;
        }
    }
    else if (signDisplay === 'always') {
        if (objectIs(x, 0) || x > 0 || isNaN(x)) {
            pattern = signPattern.positivePattern;
        }
        else {
            pattern = signPattern.negativePattern;
        }
    }
    else {
        invariant(signDisplay === 'exceptZero', 'signDisplay must be exceptZero');
        if (objectIs(x, 0) || isNaN(x)) {
            pattern = signPattern.zeroPattern;
        }
        else if (x > 0 || objectIs(x, +0)) {
            pattern = signPattern.positivePattern;
        }
        else {
            pattern = signPattern.negativePattern;
        }
    }
    return pattern;
}
function selectPlural(pl, x, rules) {
    return rules[pl.select(x)] || rules.other;
}
function toNumeric(val) {
    if (typeof val === 'bigint') {
        return val;
    }
    return toNumber(val);
}
function toNumber(val) {
    if (val === undefined) {
        return NaN;
    }
    if (val === null) {
        return +0;
    }
    if (typeof val === 'boolean') {
        return val ? 1 : +0;
    }
    if (typeof val === 'number') {
        return val;
    }
    if (typeof val === 'symbol' || typeof val === 'bigint') {
        throw new TypeError('Cannot convert symbol/bigint to number');
    }
    return Number(val);
}
try {
    // IE11 does not have Symbol
    if (typeof Symbol !== 'undefined') {
        Object.defineProperty(UnifiedNumberFormat.prototype, Symbol.toStringTag, {
            configurable: true,
            enumerable: false,
            writable: false,
            value: 'Object',
        });
    }
    // https://github.com/tc39/test262/blob/master/test/intl402/NumberFormat/length.js
    Object.defineProperty(UnifiedNumberFormat.prototype.constructor, 'length', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: 0,
    });
    // https://github.com/tc39/test262/blob/master/test/intl402/NumberFormat/supportedLocalesOf/length.js
    Object.defineProperty(UnifiedNumberFormat.supportedLocalesOf, 'length', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: 1,
    });
    Object.defineProperty(UnifiedNumberFormat, 'prototype', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: UnifiedNumberFormat.prototype,
    });
}
catch (e) {
    // Meta fix so we're test262-compliant, not important
}
//# sourceMappingURL=core.js.map