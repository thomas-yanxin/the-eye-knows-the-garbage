import aliases from './aliases';
import parentLocales from './parentLocales';
import { invariant } from './invariant';
/**
 * https://tc39.es/ecma262/#sec-toobject
 * @param arg
 */
export function toObject(arg) {
    if (arg == null) {
        throw new TypeError('undefined/null cannot be converted to object');
    }
    return Object(arg);
}
/**
 * https://tc39.es/ecma262/#sec-tostring
 */
export function toString(o) {
    // Only symbol is irregular...
    if (typeof o === 'symbol') {
        throw TypeError('Cannot convert a Symbol value to a string');
    }
    return String(o);
}
/**
 * https://tc39.es/ecma402/#sec-getoption
 * @param opts
 * @param prop
 * @param type
 * @param values
 * @param fallback
 */
export function getOption(opts, prop, type, values, fallback) {
    // const descriptor = Object.getOwnPropertyDescriptor(opts, prop);
    var value = opts[prop];
    if (value !== undefined) {
        if (type !== 'boolean' && type !== 'string') {
            throw new TypeError('invalid type');
        }
        if (type === 'boolean') {
            value = Boolean(value);
        }
        if (type === 'string') {
            value = toString(value);
        }
        if (values !== undefined && !values.filter(function (val) { return val == value; }).length) {
            throw new RangeError(value + " is not within " + values.join(', '));
        }
        return value;
    }
    return fallback;
}
/**
 * https://tc39.es/ecma402/#sec-defaultnumberoption
 * @param val
 * @param min
 * @param max
 * @param fallback
 */
export function defaultNumberOption(val, min, max, fallback) {
    if (val !== undefined) {
        val = Number(val);
        if (isNaN(val) || val < min || val > max) {
            throw new RangeError(val + " is outside of range [" + min + ", " + max + "]");
        }
        return Math.floor(val);
    }
    return fallback;
}
/**
 * https://tc39.es/ecma402/#sec-getnumberoption
 * @param options
 * @param property
 * @param min
 * @param max
 * @param fallback
 */
export function getNumberOption(options, property, minimum, maximum, fallback) {
    var val = options[property];
    return defaultNumberOption(val, minimum, maximum, fallback);
}
export function getAliasesByLang(lang) {
    return Object.keys(aliases).reduce(function (all, locale) {
        if (locale.split('-')[0] === lang) {
            all[locale] = aliases[locale];
        }
        return all;
    }, {});
}
export function getParentLocalesByLang(lang) {
    return Object.keys(parentLocales).reduce(function (all, locale) {
        if (locale.split('-')[0] === lang) {
            all[locale] = parentLocales[locale];
        }
        return all;
    }, {});
}
export function setInternalSlot(map, pl, field, value) {
    if (!map.get(pl)) {
        map.set(pl, Object.create(null));
    }
    var slots = map.get(pl);
    slots[field] = value;
}
export function setMultiInternalSlots(map, pl, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var k = _a[_i];
        setInternalSlot(map, pl, k, props[k]);
    }
}
export function getInternalSlot(map, pl, field) {
    return getMultiInternalSlots(map, pl, field)[field];
}
export function getMultiInternalSlots(map, pl) {
    var fields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        fields[_i - 2] = arguments[_i];
    }
    var slots = map.get(pl);
    if (!slots) {
        throw new TypeError(pl + " InternalSlot has not been initialized");
    }
    return fields.reduce(function (all, f) {
        all[f] = slots[f];
        return all;
    }, Object.create(null));
}
export function isLiteralPart(patternPart) {
    return patternPart.type === 'literal';
}
export function partitionPattern(pattern) {
    var result = [];
    var beginIndex = pattern.indexOf('{');
    var endIndex = 0;
    var nextIndex = 0;
    var length = pattern.length;
    while (beginIndex < pattern.length && beginIndex > -1) {
        endIndex = pattern.indexOf('}', beginIndex);
        invariant(endIndex > beginIndex, "Invalid pattern " + pattern);
        if (beginIndex > nextIndex) {
            result.push({
                type: 'literal',
                value: pattern.substring(nextIndex, beginIndex),
            });
        }
        result.push({
            type: pattern.substring(beginIndex + 1, endIndex),
            value: undefined,
        });
        nextIndex = endIndex + 1;
        beginIndex = pattern.indexOf('{', nextIndex);
    }
    if (nextIndex < length) {
        result.push({
            type: 'literal',
            value: pattern.substring(nextIndex, length),
        });
    }
    return result;
}
/**
 * https://tc39.es/ecma402/#sec-setnfdigitoptions
 * https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_diff_out.html#sec-setnfdigitoptions
 * @param intlObj
 * @param opts
 * @param mnfdDefault
 * @param mxfdDefault
 */
export function setNumberFormatDigitOptions(internalSlotMap, intlObj, opts, mnfdDefault, mxfdDefault) {
    var mnid = getNumberOption(opts, 'minimumIntegerDigits', 1, 21, 1);
    var mnfd = opts.minimumFractionDigits;
    var mxfd = opts.maximumFractionDigits;
    var mnsd = opts.minimumSignificantDigits;
    var mxsd = opts.maximumSignificantDigits;
    setInternalSlot(internalSlotMap, intlObj, 'minimumIntegerDigits', mnid);
    if (mnsd !== undefined || mxsd !== undefined) {
        setInternalSlot(internalSlotMap, intlObj, 'roundingType', 'significantDigits');
        mnsd = defaultNumberOption(mnsd, 1, 21, 1);
        mxsd = defaultNumberOption(mxsd, mnsd, 21, 21);
        setInternalSlot(internalSlotMap, intlObj, 'minimumSignificantDigits', mnsd);
        setInternalSlot(internalSlotMap, intlObj, 'maximumSignificantDigits', mxsd);
    }
    else if (mnfd !== undefined || mxfd !== undefined) {
        setInternalSlot(internalSlotMap, intlObj, 'roundingType', 'fractionDigits');
        mnfd = defaultNumberOption(mnfd, 0, 20, mnfdDefault);
        var mxfdActualDefault = Math.max(mnfd, mxfdDefault);
        mxfd = defaultNumberOption(mxfd, mnfd, 20, mxfdActualDefault);
        setInternalSlot(internalSlotMap, intlObj, 'minimumFractionDigits', mnfd);
        setInternalSlot(internalSlotMap, intlObj, 'maximumFractionDigits', mxfd);
    }
    else if (getInternalSlot(internalSlotMap, intlObj, 'notation') === 'compact') {
        setInternalSlot(internalSlotMap, intlObj, 'roundingType', 'compactRounding');
    }
    else {
        setInternalSlot(internalSlotMap, intlObj, 'roundingType', 'fractionDigits');
        setInternalSlot(internalSlotMap, intlObj, 'minimumFractionDigits', mnfdDefault);
        setInternalSlot(internalSlotMap, intlObj, 'maximumFractionDigits', mxfdDefault);
    }
}
export function objectIs(x, y) {
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
var NOT_A_Z_REGEX = /[^A-Z]/;
/**
 * This follows https://tc39.es/ecma402/#sec-case-sensitivity-and-case-mapping
 * @param str string to convert
 */
function toUpperCase(str) {
    return str.replace(/([a-z])/g, function (_, c) { return c.toUpperCase(); });
}
/**
 * https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-iswellformedcurrencycode
 * @param currency
 */
export function isWellFormedCurrencyCode(currency) {
    currency = toUpperCase(currency);
    if (currency.length !== 3) {
        return false;
    }
    if (NOT_A_Z_REGEX.test(currency)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=polyfill-utils.js.map