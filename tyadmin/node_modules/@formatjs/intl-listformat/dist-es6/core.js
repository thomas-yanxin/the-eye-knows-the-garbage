import { toObject, getOption, unpackData, setInternalSlot, getCanonicalLocales, supportedLocales, createResolveLocale, getInternalSlot, partitionPattern, invariant, isLiteralPart, } from '@formatjs/intl-utils';
function validateInstance(instance, method) {
    if (!(instance instanceof ListFormat)) {
        throw new TypeError(`Method Intl.ListFormat.prototype.${method} called on incompatible receiver ${String(instance)}`);
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
    const result = [];
    for (const el of list) {
        if (typeof el !== 'string') {
            throw new TypeError(`array list[${list.indexOf(el)}] is not type String`);
        }
        result.push(el);
    }
    return result;
}
function createPartsFromList(internalSlotMap, lf, list) {
    const size = list.length;
    if (size === 0) {
        return [];
    }
    if (size === 2) {
        const pattern = getInternalSlot(internalSlotMap, lf, 'templatePair');
        const first = { type: 'element', value: list[0] };
        const second = { type: 'element', value: list[1] };
        return deconstructPattern(pattern, { '0': first, '1': second });
    }
    const last = {
        type: 'element',
        value: list[size - 1],
    };
    let parts = last;
    let i = size - 2;
    while (i >= 0) {
        let pattern;
        if (i === 0) {
            pattern = getInternalSlot(internalSlotMap, lf, 'templateStart');
        }
        else if (i < size - 2) {
            pattern = getInternalSlot(internalSlotMap, lf, 'templateMiddle');
        }
        else {
            pattern = getInternalSlot(internalSlotMap, lf, 'templateEnd');
        }
        const head = { type: 'element', value: list[i] };
        parts = deconstructPattern(pattern, { '0': head, '1': parts });
        i--;
    }
    return parts;
}
function deconstructPattern(pattern, placeables) {
    const patternParts = partitionPattern(pattern);
    const result = [];
    for (const patternPart of patternParts) {
        const { type: part } = patternPart;
        if (isLiteralPart(patternPart)) {
            result.push({
                type: 'literal',
                value: patternPart.value,
            });
        }
        else {
            invariant(part in placeables, `${part} is missing from placables`);
            const subst = placeables[part];
            if (Array.isArray(subst)) {
                result.push(...subst);
            }
            else {
                result.push(subst);
            }
        }
    }
    return result;
}
export default class ListFormat {
    constructor(locales, options) {
        // test262/test/intl402/ListFormat/constructor/constructor/newtarget-undefined.js
        // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
        const newTarget = this && this instanceof ListFormat ? this.constructor : void 0;
        if (!newTarget) {
            throw new TypeError("Intl.ListFormat must be called with 'new'");
        }
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'initializedListFormat', true);
        const requestedLocales = getCanonicalLocales(locales);
        const opt = Object.create(null);
        const opts = options === undefined ? Object.create(null) : toObject(options);
        const matcher = getOption(opts, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
        opt.localeMatcher = matcher;
        const { localeData } = ListFormat;
        const r = createResolveLocale(ListFormat.getDefaultLocale)(ListFormat.availableLocales, requestedLocales, opt, ListFormat.relevantExtensionKeys, localeData);
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'locale', r.locale);
        const type = getOption(opts, 'type', 'string', ['conjunction', 'disjunction', 'unit'], 'conjunction');
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'type', type);
        const style = getOption(opts, 'style', 'string', ['long', 'short', 'narrow'], 'long');
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'style', style);
        const { dataLocale } = r;
        const dataLocaleData = localeData[dataLocale];
        const dataLocaleTypes = dataLocaleData[type];
        const templates = dataLocaleTypes[style];
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templatePair', templates.pair);
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templateStart', templates.start);
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templateMiddle', templates.middle);
        setInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'templateEnd', templates.end);
    }
    format(elements) {
        validateInstance(this, 'format');
        let result = '';
        const parts = createPartsFromList(ListFormat.__INTERNAL_SLOT_MAP__, this, stringListFromIterable(elements));
        if (!Array.isArray(parts)) {
            return parts.value;
        }
        for (const p of parts) {
            result += p.value;
        }
        return result;
    }
    formatToParts(elements) {
        validateInstance(this, 'format');
        const parts = createPartsFromList(ListFormat.__INTERNAL_SLOT_MAP__, this, stringListFromIterable(elements));
        if (!Array.isArray(parts)) {
            return [parts];
        }
        const result = [];
        for (const part of parts) {
            result.push(Object.assign({}, part));
        }
        return result;
    }
    resolvedOptions() {
        validateInstance(this, 'resolvedOptions');
        return {
            locale: getInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'locale'),
            type: getInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'type'),
            style: getInternalSlot(ListFormat.__INTERNAL_SLOT_MAP__, this, 'style'),
        };
    }
    static supportedLocalesOf(locales, options) {
        // test262/test/intl402/ListFormat/constructor/supportedLocalesOf/result-type.js
        return supportedLocales(ListFormat.availableLocales, getCanonicalLocales(locales), options);
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
                    ListFormat.localeData[locale] = unpackData(locale, datum);
                }
                catch (e) {
                    // If we can't unpack this data, ignore the locale
                }
            });
        }
        ListFormat.availableLocales = Object.keys(ListFormat.localeData);
        if (!ListFormat.__defaultLocale) {
            ListFormat.__defaultLocale = ListFormat.availableLocales[0];
        }
    }
    static getDefaultLocale() {
        return ListFormat.__defaultLocale;
    }
}
ListFormat.localeData = {};
ListFormat.availableLocales = [];
ListFormat.__defaultLocale = 'en';
ListFormat.relevantExtensionKeys = [];
ListFormat.polyfilled = true;
ListFormat.__INTERNAL_SLOT_MAP__ = new WeakMap();
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