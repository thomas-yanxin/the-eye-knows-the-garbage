import { toObject, getOption, getLocaleHierarchy, supportedLocales, getCanonicalLocales, createResolveLocale, setInternalSlot, getInternalSlot, invariant, partitionPattern, isLiteralPart, } from '@formatjs/intl-utils';
function unpackData(locale, localeData) {
    const localeHierarchy = getLocaleHierarchy(locale, localeData.aliases, localeData.parentLocales);
    const dataToMerge = localeHierarchy
        .map(l => localeData.data[l])
        .filter(Boolean);
    if (!dataToMerge.length) {
        throw new Error(`Missing locale data for "${locale}", lookup hierarchy: ${localeHierarchy.join(', ')}`);
    }
    dataToMerge.reverse();
    return dataToMerge.reduce((all, d) => (Object.assign(Object.assign({}, all), d)), { nu: [] });
}
/**
 * https://tc39.es/proposal-intl-relative-time/#sec-singularrelativetimeunit
 * @param unit
 */
function singularRelativeTimeUnit(unit) {
    invariant(typeof unit === 'string', `unit must be a string, instead got ${typeof unit}`, TypeError);
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
        throw new RangeError(`Invalid unit ${unit}`);
    }
    return unit;
}
const NUMBERING_SYSTEM_REGEX = /^[a-z0-9]{3,8}(-[a-z0-9]{3,8})*$/i;
/**
 * https://tc39.es/proposal-intl-relative-time/#sec-makepartslist
 * @param pattern
 * @param unit
 * @param parts
 */
function makePartsList(pattern, unit, parts) {
    const patternParts = partitionPattern(pattern);
    const result = [];
    for (const patternPart of patternParts) {
        if (isLiteralPart(patternPart)) {
            result.push({
                type: 'literal',
                value: patternPart.value,
            });
        }
        else {
            invariant(patternPart.type === '0', `Malformed pattern ${pattern}`);
            for (const part of parts) {
                result.push({
                    type: part.type,
                    value: part.value,
                    unit,
                });
            }
        }
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
    invariant(typeof value === 'number', `value must be number, instead got ${typeof value}`, TypeError);
    invariant(typeof unit === 'string', `unit must be number, instead got ${typeof value}`, TypeError);
    if (isNaN(value) || value === Infinity || value === -Infinity) {
        throw new RangeError(`Invalid value ${value}`);
    }
    const resolvedUnit = singularRelativeTimeUnit(unit);
    const fields = getInternalSlot(internalSlotMap, rtf, 'fields');
    const style = getInternalSlot(internalSlotMap, rtf, 'style');
    let entry = resolvedUnit;
    if (style === 'short') {
        entry = `${unit}-short`;
    }
    else if (style === 'narrow') {
        entry = `${unit}-narrow`;
    }
    if (!(entry in fields)) {
        entry = unit;
    }
    const patterns = fields[entry];
    const numeric = getInternalSlot(internalSlotMap, rtf, 'numeric');
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
    let tl = 'future';
    if (objectIs(value, -0) || value < 0) {
        tl = 'past';
    }
    const po = patterns[tl];
    const pluralRules = getInternalSlot(internalSlotMap, rtf, 'pluralRules');
    const numberFormat = getInternalSlot(internalSlotMap, rtf, 'numberFormat');
    const fv = typeof numberFormat.formatToParts === 'function'
        ? numberFormat.formatToParts(Math.abs(value))
        : // TODO: If formatToParts is not supported, we assume the whole formatted
            // number is a part
            [
                {
                    type: 'literal',
                    value: numberFormat.format(Math.abs(value)),
                    unit,
                },
            ];
    const pr = pluralRules.select(value);
    const pattern = po[pr];
    return makePartsList(pattern, resolvedUnit, fv);
}
export default class RelativeTimeFormat {
    constructor(locales, options) {
        // test262/test/intl402/RelativeTimeFormat/constructor/constructor/newtarget-undefined.js
        // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
        const newTarget = this && this instanceof RelativeTimeFormat ? this.constructor : void 0;
        if (!newTarget) {
            throw new TypeError("Intl.RelativeTimeFormat must be called with 'new'");
        }
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat', true);
        const requestedLocales = getCanonicalLocales(locales);
        const opt = Object.create(null);
        const opts = options === undefined ? Object.create(null) : toObject(options);
        const matcher = getOption(opts, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
        opt.localeMatcher = matcher;
        const numberingSystem = getOption(opts, 'numberingSystem', 'string', undefined, undefined);
        if (numberingSystem !== undefined) {
            if (!NUMBERING_SYSTEM_REGEX.test(numberingSystem)) {
                throw new RangeError(`Invalid numbering system ${numberingSystem}`);
            }
        }
        opt.nu = numberingSystem;
        const r = createResolveLocale(RelativeTimeFormat.getDefaultLocale)(RelativeTimeFormat.availableLocales, requestedLocales, opt, RelativeTimeFormat.relevantExtensionKeys, RelativeTimeFormat.localeData);
        const { locale, nu } = r;
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'locale', locale);
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'style', getOption(opts, 'style', 'string', ['long', 'narrow', 'short'], 'long'));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numeric', getOption(opts, 'numeric', 'string', ['always', 'auto'], 'always'));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'fields', RelativeTimeFormat.localeData[locale]);
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numberFormat', new Intl.NumberFormat(locales));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'pluralRules', new Intl.PluralRules(locales));
        setInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'numberingSystem', nu);
    }
    format(value, unit) {
        if (typeof this !== 'object') {
            throw new TypeError('format was called on a non-object');
        }
        if (!getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat')) {
            throw new TypeError('format was called on a invalid context');
        }
        return partitionRelativeTimePattern(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, Number(value), toString(unit))
            .map(el => el.value)
            .join('');
    }
    formatToParts(value, unit) {
        if (typeof this !== 'object') {
            throw new TypeError('formatToParts was called on a non-object');
        }
        if (!getInternalSlot(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, 'initializedRelativeTimeFormat')) {
            throw new TypeError('formatToParts was called on a invalid context');
        }
        return partitionRelativeTimePattern(RelativeTimeFormat.__INTERNAL_SLOT_MAP__, this, Number(value), toString(unit));
    }
    resolvedOptions() {
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
    }
    static supportedLocalesOf(locales, options) {
        return supportedLocales(RelativeTimeFormat.availableLocales, getCanonicalLocales(locales), options);
    }
    static __addLocaleData(...data) {
        for (const datum of data) {
            const availableLocales = Object.keys([
                ...datum.availableLocales,
                ...Object.keys(datum.aliases),
                ...Object.keys(datum.parentLocales),
            ].reduce((all, k) => {
                all[k] = true;
                return all;
            }, {}));
            availableLocales.forEach(locale => {
                try {
                    RelativeTimeFormat.localeData[locale] = unpackData(locale, datum);
                }
                catch (e) {
                    // If we can't unpack this data, ignore the locale
                }
            });
        }
        RelativeTimeFormat.availableLocales = Object.keys(RelativeTimeFormat.localeData);
        if (!RelativeTimeFormat.__defaultLocale) {
            RelativeTimeFormat.__defaultLocale =
                RelativeTimeFormat.availableLocales[0];
        }
    }
    static getDefaultLocale() {
        return RelativeTimeFormat.__defaultLocale;
    }
}
RelativeTimeFormat.localeData = {};
RelativeTimeFormat.availableLocales = [];
RelativeTimeFormat.__defaultLocale = 'en';
RelativeTimeFormat.relevantExtensionKeys = ['nu'];
RelativeTimeFormat.polyfilled = true;
RelativeTimeFormat.__INTERNAL_SLOT_MAP__ = new WeakMap();
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