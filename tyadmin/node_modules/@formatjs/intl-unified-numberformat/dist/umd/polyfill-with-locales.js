(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    function invariant(condition, message, Err) {
        if (Err === void 0) { Err = Error; }
        if (!condition) {
            throw new Err(message);
        }
    }

    /**
     * https://tc39.es/ecma262/#sec-toobject
     * @param arg
     */
    function toObject(arg) {
        if (arg == null) {
            throw new TypeError('undefined/null cannot be converted to object');
        }
        return Object(arg);
    }
    /**
     * https://tc39.es/ecma262/#sec-tostring
     */
    function toString(o) {
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
    function getOption(opts, prop, type, values, fallback) {
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
    function defaultNumberOption(val, min, max, fallback) {
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
    function getNumberOption(options, property, minimum, maximum, fallback) {
        var val = options[property];
        return defaultNumberOption(val, minimum, maximum, fallback);
    }
    function setInternalSlot(map, pl, field, value) {
        if (!map.get(pl)) {
            map.set(pl, Object.create(null));
        }
        var slots = map.get(pl);
        slots[field] = value;
    }
    function setMultiInternalSlots(map, pl, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var k = _a[_i];
            setInternalSlot(map, pl, k, props[k]);
        }
    }
    function getInternalSlot(map, pl, field) {
        return getMultiInternalSlots(map, pl, field)[field];
    }
    function getMultiInternalSlots(map, pl) {
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
    function partitionPattern(pattern) {
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
    function setNumberFormatDigitOptions(internalSlotMap, intlObj, opts, mnfdDefault, mxfdDefault) {
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
    function isWellFormedCurrencyCode(currency) {
        currency = toUpperCase(currency);
        if (currency.length !== 3) {
            return false;
        }
        if (NOT_A_Z_REGEX.test(currency)) {
            return false;
        }
        return true;
    }

    /**
     * IE11-safe version of getCanonicalLocales since it's ES2016
     * @param locales locales
     */
    function getCanonicalLocales(locales) {
        // IE11
        var getCanonicalLocales = Intl.getCanonicalLocales;
        if (typeof getCanonicalLocales === 'function') {
            return getCanonicalLocales(locales);
        }
        // NOTE: we must NOT call `supportedLocalesOf` of a formatjs polyfill, or their implementation
        // will even eventually call this method recursively. Here we use `Intl.DateTimeFormat` since it
        // is not polyfilled by `@formatjs`.
        // TODO: Fix TypeScript type def for this bc undefined is just fine
        return Intl.DateTimeFormat.supportedLocalesOf(locales);
    }

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign = (undefined && undefined.__assign) || function () {
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
    function createResolveLocale(getDefaultLocale) {
        var lookupMatcher = createLookupMatcher(getDefaultLocale);
        var bestFitMatcher = createBestFitMatcher(getDefaultLocale);
        /**
         * https://tc39.es/ecma402/#sec-resolvelocale
         */
        return function resolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData) {
            var matcher = options.localeMatcher;
            var r;
            if (matcher === 'lookup') {
                r = lookupMatcher(availableLocales, requestedLocales);
            }
            else {
                r = bestFitMatcher(availableLocales, requestedLocales);
            }
            var foundLocale = r.locale;
            var result = { locale: '', dataLocale: foundLocale };
            var supportedExtension = '-u';
            for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
                var key = relevantExtensionKeys_1[_i];
                var foundLocaleData = localeData[foundLocale];
                invariant(typeof foundLocaleData === 'object' && foundLocaleData !== null, "locale data " + key + " must be an object");
                var keyLocaleData = foundLocaleData[key];
                invariant(Array.isArray(keyLocaleData), "keyLocaleData for " + key + " must be an array");
                var value = keyLocaleData[0];
                invariant(typeof value === 'string' || value === null, 'value must be string or null');
                var supportedExtensionAddition = '';
                if (r.extension) {
                    var requestedValue = unicodeExtensionValue(r.extension, key);
                    if (requestedValue !== undefined) {
                        if (requestedValue !== '') {
                            if (~keyLocaleData.indexOf(requestedValue)) {
                                value = requestedValue;
                                supportedExtensionAddition = "-" + key + "-" + value;
                            }
                        }
                        else if (~requestedValue.indexOf('true')) {
                            value = 'true';
                            supportedExtensionAddition = "-" + key;
                        }
                    }
                }
                if (key in options) {
                    var optionsValue = options[key];
                    invariant(typeof optionsValue === 'string' ||
                        typeof optionsValue === 'undefined' ||
                        optionsValue === null, 'optionsValue must be String, Undefined or Null');
                    if (~keyLocaleData.indexOf(optionsValue)) {
                        if (optionsValue !== value) {
                            value = optionsValue;
                            supportedExtensionAddition = '';
                        }
                    }
                }
                result[key] = value;
                supportedExtension += supportedExtensionAddition;
            }
            if (supportedExtension.length > 2) {
                var privateIndex = foundLocale.indexOf('-x-');
                if (privateIndex === -1) {
                    foundLocale = foundLocale + supportedExtension;
                }
                else {
                    var preExtension = foundLocale.slice(0, privateIndex);
                    var postExtension = foundLocale.slice(privateIndex, foundLocale.length);
                    foundLocale = preExtension + supportedExtension + postExtension;
                }
                foundLocale = getCanonicalLocales(foundLocale)[0];
            }
            result.locale = foundLocale;
            return result;
        };
    }
    /**
     * https://tc39.es/ecma402/#sec-unicodeextensionvalue
     * @param extension
     * @param key
     */
    function unicodeExtensionValue(extension, key) {
        invariant(key.length === 2, 'key must have 2 elements');
        var size = extension.length;
        var searchValue = "-" + key + "-";
        var pos = extension.indexOf(searchValue);
        if (pos !== -1) {
            var start = pos + 4;
            var end = start;
            var k = start;
            var done = false;
            while (!done) {
                var e = extension.indexOf('-', k);
                var len = void 0;
                if (e === -1) {
                    len = size - k;
                }
                else {
                    len = e - k;
                }
                if (len === 2) {
                    done = true;
                }
                else if (e === -1) {
                    end = size;
                    done = true;
                }
                else {
                    end = e;
                    k = e + 1;
                }
            }
            return extension.slice(start, end);
        }
        searchValue = "-" + key;
        pos = extension.indexOf(searchValue);
        if (pos !== -1 && pos + 3 === size) {
            return '';
        }
        return undefined;
    }
    var UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
    /**
     * https://tc39.es/ecma402/#sec-bestavailablelocale
     * @param availableLocales
     * @param locale
     */
    function bestAvailableLocale(availableLocales, locale) {
        var candidate = locale;
        while (true) {
            if (~availableLocales.indexOf(candidate)) {
                return candidate;
            }
            var pos = candidate.lastIndexOf('-');
            if (!~pos) {
                return undefined;
            }
            if (pos >= 2 && candidate[pos - 2] === '-') {
                pos -= 2;
            }
            candidate = candidate.slice(0, pos);
        }
    }
    function createLookupMatcher(getDefaultLocale) {
        /**
         * https://tc39.es/ecma402/#sec-lookupmatcher
         */
        return function lookupMatcher(availableLocales, requestedLocales) {
            var result = { locale: '' };
            for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
                var locale = requestedLocales_1[_i];
                var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, '');
                var availableLocale = bestAvailableLocale(availableLocales, noExtensionLocale);
                if (availableLocale) {
                    result.locale = availableLocale;
                    if (locale !== noExtensionLocale) {
                        result.extension = locale.slice(noExtensionLocale.length + 1, locale.length);
                    }
                    return result;
                }
            }
            result.locale = getDefaultLocale();
            return result;
        };
    }
    function createBestFitMatcher(getDefaultLocale) {
        return function bestFitMatcher(availableLocales, requestedLocales) {
            var result = { locale: '' };
            for (var _i = 0, requestedLocales_2 = requestedLocales; _i < requestedLocales_2.length; _i++) {
                var locale = requestedLocales_2[_i];
                var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, '');
                var availableLocale = bestAvailableLocale(availableLocales, noExtensionLocale);
                if (availableLocale) {
                    result.locale = availableLocale;
                    if (locale !== noExtensionLocale) {
                        result.extension = locale.slice(noExtensionLocale.length + 1, locale.length);
                    }
                    return result;
                }
            }
            result.locale = getDefaultLocale();
            return result;
        };
    }
    function getLocaleHierarchy(locale, aliases, parentLocales) {
        var results = [locale];
        if (aliases[locale]) {
            locale = aliases[locale];
            results.push(locale);
        }
        var parentLocale = parentLocales[locale];
        if (parentLocale) {
            results.push(parentLocale);
        }
        var localeParts = locale.split('-');
        for (var i = localeParts.length; i > 1; i--) {
            results.push(localeParts.slice(0, i - 1).join('-'));
        }
        return results;
    }
    function lookupSupportedLocales(availableLocales, requestedLocales) {
        var subset = [];
        for (var _i = 0, requestedLocales_3 = requestedLocales; _i < requestedLocales_3.length; _i++) {
            var locale = requestedLocales_3[_i];
            var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, '');
            var availableLocale = bestAvailableLocale(availableLocales, noExtensionLocale);
            if (availableLocale) {
                subset.push(availableLocale);
            }
        }
        return subset;
    }
    function supportedLocales(availableLocales, requestedLocales, options) {
        var matcher = 'best fit';
        if (options !== undefined) {
            options = toObject(options);
            matcher = getOption(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
        }
        if (matcher === 'best fit') {
            return lookupSupportedLocales(availableLocales, requestedLocales);
        }
        return lookupSupportedLocales(availableLocales, requestedLocales);
    }
    var MissingLocaleDataError = /** @class */ (function (_super) {
        __extends(MissingLocaleDataError, _super);
        function MissingLocaleDataError() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = 'MISSING_LOCALE_DATA';
            return _this;
        }
        return MissingLocaleDataError;
    }(Error));
    function unpackData(locale, localeData, 
    /** By default shallow merge the dictionaries. */
    reducer) {
        if (reducer === void 0) { reducer = function (all, d) { return (__assign(__assign({}, all), d)); }; }
        var localeHierarchy = getLocaleHierarchy(locale, localeData.aliases, localeData.parentLocales);
        var dataToMerge = localeHierarchy
            .map(function (l) { return localeData.data[l]; })
            .filter(Boolean);
        if (!dataToMerge.length) {
            throw new MissingLocaleDataError("Missing locale data for \"" + locale + "\", lookup hierarchy: " + localeHierarchy.join(', '));
        }
        dataToMerge.reverse();
        return dataToMerge.reduce(reducer, {});
    }

    // https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_diff_out.html#sec-issanctionedsimpleunitidentifier
    var SANCTIONED_UNITS = [
        'angle-degree',
        'area-acre',
        'area-hectare',
        'concentr-percent',
        'digital-bit',
        'digital-byte',
        'digital-gigabit',
        'digital-gigabyte',
        'digital-kilobit',
        'digital-kilobyte',
        'digital-megabit',
        'digital-megabyte',
        'digital-petabyte',
        'digital-terabit',
        'digital-terabyte',
        'duration-day',
        'duration-hour',
        'duration-millisecond',
        'duration-minute',
        'duration-month',
        'duration-second',
        'duration-week',
        'duration-year',
        'length-centimeter',
        'length-foot',
        'length-inch',
        'length-kilometer',
        'length-meter',
        'length-mile-scandinavian',
        'length-mile',
        'length-millimeter',
        'length-yard',
        'mass-gram',
        'mass-kilogram',
        'mass-ounce',
        'mass-pound',
        'mass-stone',
        'temperature-celsius',
        'temperature-fahrenheit',
        'volume-fluid-ounce',
        'volume-gallon',
        'volume-liter',
        'volume-milliliter',
    ];

    var InternalSlotToken;
    (function (InternalSlotToken) {
        // To prevent collision with {0} in CLDR
        InternalSlotToken["compactName"] = "compactName";
        InternalSlotToken["compactSymbol"] = "compactSymbol";
        InternalSlotToken["currencyCode"] = "currencyCode";
        InternalSlotToken["currencyName"] = "currencyName";
        InternalSlotToken["currencyNarrowSymbol"] = "currencyNarrowSymbol";
        InternalSlotToken["currencySymbol"] = "currencySymbol";
        InternalSlotToken["minusSign"] = "minusSign";
        InternalSlotToken["number"] = "number";
        InternalSlotToken["percentSign"] = "percentSign";
        InternalSlotToken["plusSign"] = "plusSign";
        InternalSlotToken["scientificExponent"] = "scientificExponent";
        InternalSlotToken["scientificSeparator"] = "scientificSeparator";
        InternalSlotToken["unitName"] = "unitName";
        InternalSlotToken["unitNarrowSymbol"] = "unitNarrowSymbol";
        InternalSlotToken["unitSymbol"] = "unitSymbol";
    })(InternalSlotToken || (InternalSlotToken = {}));

    /**
     * Cannot do Math.log(x) / Math.log(10) bc if IEEE floating point issue
     * @param x number
     */
    function getMagnitude(x) {
        // Cannot count string length via Number.toString because it may use scientific notation
        // for very small or very large numbers.
        return Math.floor(Math.log(x) * Math.LOG10E);
    }
    // TODO: dedup with intl-pluralrules
    // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-torawfixed
    function toRawFixed(x, minFraction, maxFraction) {
        const f = maxFraction;
        let n;
        {
            const exactSolve = x * Math.pow(10, f);
            const roundDown = Math.floor(exactSolve);
            const roundUp = Math.ceil(exactSolve);
            n = exactSolve - roundDown < roundUp - exactSolve ? roundDown : roundUp;
        }
        const xFinal = n / Math.pow(10, f);
        // n is a positive integer, but it is possible to be greater than 1e21.
        // In such case we will go the slow path.
        // See also: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
        let m;
        if (n < 1e21) {
            m = n.toString();
        }
        else {
            m = n.toString();
            const idx1 = m.indexOf('.');
            const idx2 = m.indexOf('e+');
            const exponent = parseInt(m.substring(idx2 + 2), 10);
            m =
                m.substring(0, idx1) +
                    m.substring(idx1 + 1, idx2) +
                    repeat('0', exponent - (idx2 - idx1 - 1));
        }
        let int;
        if (f !== 0) {
            let k = m.length;
            if (k <= f) {
                const z = repeat('0', f + 1 - k);
                m = z + m;
                k = f + 1;
            }
            const a = m.slice(0, k - f);
            const b = m.slice(k - f);
            m = `${a}.${b}`;
            int = a.length;
        }
        else {
            int = m.length;
        }
        let cut = maxFraction - minFraction;
        while (cut > 0 && m[m.length - 1] === '0') {
            m = m.slice(0, -1);
            cut--;
        }
        if (m[m.length - 1] === '.') {
            m = m.slice(0, -1);
        }
        return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
    }
    // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-torawprecision
    function toRawPrecision(x, minPrecision, maxPrecision) {
        const p = maxPrecision;
        let m;
        let e;
        let xFinal;
        if (x === 0) {
            m = repeat('0', p);
            e = 0;
            xFinal = 0;
        }
        else {
            e = getMagnitude(x);
            let n;
            {
                const magnitude = e - p + 1;
                const exactSolve = 
                // Preserve floating point precision as much as possible with multiplication.
                magnitude < 0 ? x * Math.pow(10, -magnitude) : x / Math.pow(10, magnitude);
                const roundDown = Math.floor(exactSolve);
                const roundUp = Math.ceil(exactSolve);
                n = exactSolve - roundDown < roundUp - exactSolve ? roundDown : roundUp;
            }
            // See: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
            // No need to worry about scientific notation because it only happens for values >= 1e21,
            // which has 22 significant digits. So it will at least be divided by 10 here to bring the
            // value back into non-scientific-notation range.
            m = n.toString();
            xFinal = n * Math.pow(10, (e - p + 1));
        }
        let int;
        if (e >= p - 1) {
            m = m + repeat('0', e - p + 1);
            int = e + 1;
        }
        else if (e >= 0) {
            m = `${m.slice(0, e + 1)}.${m.slice(e + 1)}`;
            int = e + 1;
        }
        else {
            m = `0.${repeat('0', -e - 1)}${m}`;
            int = 1;
        }
        if (m.indexOf('.') >= 0 && maxPrecision > minPrecision) {
            let cut = maxPrecision - minPrecision;
            while (cut > 0 && m[m.length - 1] === '0') {
                m = m.slice(0, -1);
                cut--;
            }
            if (m[m.length - 1] === '.') {
                m = m.slice(0, -1);
            }
        }
        return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
    }
    function repeat(s, times) {
        if (typeof s.repeat === 'function') {
            return s.repeat(times);
        }
        const arr = new Array(times);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = s;
        }
        return arr.join('');
    }

    function invariant$1(condition, message, Err = Error) {
        if (!condition) {
            throw new Err(message);
        }
    }
    // This is from: unicode-12.1.0/General_Category/Symbol/regex.js
    const S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B98-\u2BFF\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD6C\uDD70-\uDDAC\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED5\uDEE0-\uDEEC\uDEF0-\uDEFA\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD0D-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95]/;
    // g flag bc this appears twice in accounting pattern
    const CURRENCY_SYMBOL_REGEX = /¤/g;
    // Instead of doing just replace '{1}' we use global regex
    // since this can appear more than once (e.g {1} {number} {1})
    const UNIT_1_REGEX = /\{1\}/g;
    const UNIT_0_REGEX = /\{0\}/g;
    function extractDecimalFormatILD(data) {
        if (!data) {
            return;
        }
        return Object.keys(data).reduce((all, num) => {
            const pattern = data[num];
            all[num] = Object.keys(pattern).reduce((all, p) => {
                all[p] = (pattern[p] || '')
                    .replace(/[¤0]/g, '') // apostrophe-escaped
                    .replace(/'(.*?)'/g, '$1')
                    .trim();
                return all;
            }, {
                other: pattern.other
                    .replace(/[¤0]/g, '') // apostrophe-escaped
                    .replace(/'(.*?)'/g, '$1')
                    .trim(),
            });
            return all;
        }, Object.create(null));
    }
    function extractLDMLPluralRuleMap(m, k) {
        return Object.keys(m).reduce((all, rule) => {
            all[rule] = m[rule][k];
            return all;
        }, { other: m.other[k] });
    }
    function extractILD(units, currencies, numbers, numberingSystem) {
        return {
            decimal: {
                compactShort: extractDecimalFormatILD(numbers.decimal[numberingSystem].short),
                compactLong: extractDecimalFormatILD(numbers.decimal[numberingSystem].long),
            },
            currency: {
                compactShort: extractDecimalFormatILD(numbers.currency[numberingSystem].short),
            },
            symbols: numbers.symbols[numberingSystem],
            currencySymbols: Object.keys(currencies).reduce((all, code) => {
                all[code] = {
                    currencyName: currencies[code].displayName,
                    currencySymbol: currencies[code].symbol,
                    currencyNarrowSymbol: currencies[code].narrow || currencies[code].symbol,
                };
                return all;
            }, Object.create(null)),
            unitSymbols: Object.keys(units).reduce((all, unit) => {
                all[unit] = {
                    unitSymbol: extractLDMLPluralRuleMap(units[unit].short, 'symbol'),
                    unitNarrowSymbol: extractLDMLPluralRuleMap(units[unit].narrow, 'symbol'),
                    unitName: extractLDMLPluralRuleMap(units[unit].long, 'symbol'),
                };
                return all;
            }, Object.create(null)),
        };
    }
    function serializeSlotTokens(tokens) {
        if (Array.isArray(tokens))
            return tokens.map(t => `{${t}}`).join('');
        return `{${tokens}}`;
    }
    // Credit: https://github.com/andyearnshaw/Intl.js/blob/master/scripts/utils/reduce.js
    // Matches CLDR number patterns, e.g. #,##0.00, #,##,##0.00, #,##0.##, 0, etc.
    const NUMBER_PATTERN = /[#0](?:[\.,][#0]+)*/g;
    const SCIENTIFIC_POSITIVE_PATTERN = serializeSlotTokens([
        InternalSlotToken.number,
        InternalSlotToken.scientificSeparator,
        InternalSlotToken.scientificExponent,
    ]);
    const SCIENTIFIC_NEGATIVE_PATTERN = serializeSlotTokens([
        InternalSlotToken.minusSign,
        InternalSlotToken.number,
        InternalSlotToken.scientificSeparator,
        InternalSlotToken.scientificExponent,
    ]);
    const DUMMY_POSITIVE_PATTERN = serializeSlotTokens([InternalSlotToken.number]);
    const DUMMY_NEGATIVE_PATTERN = serializeSlotTokens([
        InternalSlotToken.minusSign,
        InternalSlotToken.number,
    ]);
    const DUMMY_PATTERN = DUMMY_POSITIVE_PATTERN + ';' + DUMMY_NEGATIVE_PATTERN;
    const SCIENTIFIC_PATTERN = SCIENTIFIC_POSITIVE_PATTERN + ';' + SCIENTIFIC_NEGATIVE_PATTERN;
    /**
     * Turn compact pattern like `0 trillion` to
     * `0 {compactSymbol};-0 {compactSymbol}`.
     * Negative pattern will not be inserted if there already
     * exist one.
     * TODO: Maybe preprocess this
     * @param pattern decimal long/short pattern
     */
    function processDecimalCompactSymbol(pattern, slotToken = InternalSlotToken.compactSymbol) {
        const compactUnit = pattern.replace(/0+/, '').trim();
        if (compactUnit) {
            pattern = pattern.replace(compactUnit, serializeSlotTokens(slotToken));
        }
        const negativePattern = pattern.indexOf('-') > -1 ? pattern : pattern.replace(/(0+)/, '-$1');
        return [
            pattern.replace(/0+/, '{number}'),
            negativePattern.replace(/0+/, '{number}'),
        ];
    }
    /**
     * Turn compact pattern like `¤0 trillion` to
     * `¤0 {compactSymbol};-¤0 {compactSymbol}`
     * Negative pattern will not be inserted if there already
     * exist one.
     * TODO: Maybe preprocess this
     * @param pattern currency long/short pattern
     */
    function processCurrencyCompactSymbol(pattern, slotToken = InternalSlotToken.compactSymbol) {
        const compactUnit = pattern.replace(/[¤0]/g, '').trim();
        if (compactUnit) {
            pattern = pattern.replace(compactUnit, serializeSlotTokens(slotToken));
        }
        const negativePattern = pattern.indexOf('-') > -1 ? pattern : `-${pattern}`;
        return (pattern.replace(/0+/, '{number}') +
            ';' +
            negativePattern.replace(/0+/, '{number}'));
    }
    const INSERT_BEFORE_PATTERN_REGEX = /[^\s;(-]¤/;
    const INSERT_AFTER_PATTERN_REGEX = /¤[^\s);]/;
    function shouldInsertBefore(currency, pattern) {
        // surroundingMatch [:digit:] check
        return (INSERT_BEFORE_PATTERN_REGEX.test(pattern) &&
            // [:^S:]
            !S_UNICODE_REGEX.test(currency[0]));
    }
    function shouldInsertAfter(currency, pattern) {
        return (INSERT_AFTER_PATTERN_REGEX.test(pattern) &&
            // [:^S:]
            !S_UNICODE_REGEX.test(currency[currency.length - 1]));
    }
    function insertBetween(currency, pattern, insertBetweenChar) {
        // Check afterCurrency
        if (shouldInsertAfter(currency, pattern)) {
            return pattern.replace(CURRENCY_SYMBOL_REGEX, `¤${insertBetweenChar}`);
        }
        // Check beforeCurrency
        if (shouldInsertBefore(currency, pattern)) {
            return pattern.replace(CURRENCY_SYMBOL_REGEX, `${insertBetweenChar}¤`);
        }
        return pattern;
    }
    class Patterns {
        constructor(units, currencies, numbers, numberingSystem, unit, currency, currencySign) {
            this.units = units;
            this.currencies = currencies;
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
            this._unit = unit;
            this._currency = currency;
            this.currencySign = currencySign;
        }
        // Style
        get decimal() {
            if (!this.decimalPatterns) {
                this.decimalPatterns = new DecimalPatterns(this.numbers, this.numberingSystem);
            }
            return this.decimalPatterns;
        }
        get percent() {
            if (!this.percentPatterns) {
                this.percentPatterns = new PercentPatterns(this.numbers, this.numberingSystem);
            }
            return this.percentPatterns;
        }
        get unit() {
            if (!this.unitPatterns) {
                invariant$1(!!this._unit, 'unit must be supplied');
                this.unitPatterns = Object.create(null);
                this.unitPatterns[this._unit] = new UnitPatterns(this.units, this.numbers, this.numberingSystem, this._unit);
            }
            return this.unitPatterns;
        }
        get currency() {
            if (!this.currencyPatterns) {
                invariant$1(!!this._currency, 'currency must be supplied');
                invariant$1(!!this.currencySign, 'currencySign must be supplied');
                this.currencyPatterns = Object.create(null);
                this.currencyPatterns[this._currency] = new CurrencyPatterns(this.currencies, this.numbers, this.numberingSystem, this._currency, this.currencySign);
            }
            return this.currencyPatterns;
        }
    }
    function processSignPattern(signPattern, fn) {
        if (!fn) {
            return signPattern;
        }
        return {
            positivePattern: fn(signPattern.positivePattern),
            zeroPattern: fn(signPattern.zeroPattern),
            negativePattern: fn(signPattern.negativePattern),
        };
    }
    /**
     * Produce positive/negative/zero pattern
     * This also converts {0} into {number}
     * @param patterns
     * @param signDisplay
     */
    function produceSignPattern(patterns, signDisplay) {
        invariant$1(!!patterns, 'Pattern should have existed');
        let [positivePattern, negativePattern] = patterns.split(';');
        invariant$1(!!negativePattern, `negativePattern should have existed but got "${patterns}"`);
        let noSignPattern = positivePattern.replace('+', '');
        negativePattern = negativePattern.replace('-', serializeSlotTokens(InternalSlotToken.minusSign));
        let alwaysPositivePattern = positivePattern;
        if (negativePattern.indexOf(InternalSlotToken.minusSign) > -1) {
            alwaysPositivePattern = negativePattern.replace(InternalSlotToken.minusSign, InternalSlotToken.plusSign);
        }
        else if (positivePattern.indexOf('+') > -1) {
            alwaysPositivePattern = positivePattern = positivePattern.replace('+', serializeSlotTokens(InternalSlotToken.plusSign));
        }
        else {
            // In case {0} is in the middle of the pattern
            alwaysPositivePattern = `${serializeSlotTokens(InternalSlotToken.plusSign)}${noSignPattern}`;
        }
        positivePattern = positivePattern.replace('{0}', serializeSlotTokens(InternalSlotToken.number));
        alwaysPositivePattern = alwaysPositivePattern.replace('{0}', serializeSlotTokens(InternalSlotToken.number));
        negativePattern = negativePattern.replace('{0}', serializeSlotTokens(InternalSlotToken.number));
        noSignPattern = noSignPattern.replace('{0}', serializeSlotTokens(InternalSlotToken.number));
        switch (signDisplay) {
            case 'always':
                return {
                    positivePattern: alwaysPositivePattern,
                    zeroPattern: alwaysPositivePattern,
                    negativePattern,
                };
            case 'auto':
                return {
                    positivePattern,
                    zeroPattern: positivePattern,
                    negativePattern,
                };
            case 'exceptZero':
                return {
                    positivePattern: alwaysPositivePattern,
                    zeroPattern: noSignPattern,
                    negativePattern,
                };
            case 'never':
                return {
                    positivePattern: noSignPattern,
                    zeroPattern: noSignPattern,
                    negativePattern: noSignPattern,
                };
        }
    }
    class NotationPatterns {
        get compactShort() {
            this.notation = 'compactShort';
            return this;
        }
        get compactLong() {
            this.notation = 'compactLong';
            return this;
        }
        // DecimalFormatNum
        get '1000'() {
            return this.produceCompactSignPattern('1000');
        }
        get '10000'() {
            return this.produceCompactSignPattern('10000');
        }
        get '100000'() {
            return this.produceCompactSignPattern('100000');
        }
        get '1000000'() {
            return this.produceCompactSignPattern('1000000');
        }
        get '10000000'() {
            return this.produceCompactSignPattern('10000000');
        }
        get '100000000'() {
            return this.produceCompactSignPattern('100000000');
        }
        get '1000000000'() {
            return this.produceCompactSignPattern('1000000000');
        }
        get '10000000000'() {
            return this.produceCompactSignPattern('10000000000');
        }
        get '100000000000'() {
            return this.produceCompactSignPattern('100000000000');
        }
        get '1000000000000'() {
            return this.produceCompactSignPattern('1000000000000');
        }
        get '10000000000000'() {
            return this.produceCompactSignPattern('10000000000000');
        }
        get '100000000000000'() {
            return this.produceCompactSignPattern('100000000000000');
        }
    }
    class DecimalPatterns extends NotationPatterns {
        constructor(numbers, numberingSystem) {
            super();
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
        }
        produceCompactSignPattern(decimalNum) {
            if (!this.compactSignPattern) {
                this.compactSignPattern = Object.create(null);
            }
            const signPattern = this.compactSignPattern;
            if (!signPattern[decimalNum]) {
                invariant$1(!!this.signDisplay, 'Sign Display should have existed');
                if (this.notation === 'compactLong') {
                    signPattern[decimalNum] = produceSignPattern(processDecimalCompactSymbol(this.numbers.decimal[this.numberingSystem].long[decimalNum].other, InternalSlotToken.compactName).join(';'), this.signDisplay);
                }
                else {
                    signPattern[decimalNum] = produceSignPattern(processDecimalCompactSymbol(this.numbers.decimal[this.numberingSystem].short[decimalNum].other, InternalSlotToken.compactSymbol).join(';'), this.signDisplay);
                }
            }
            return signPattern[decimalNum];
        }
        // Sign Display
        get always() {
            this.signDisplay = 'always';
            return this;
        }
        get auto() {
            this.signDisplay = 'auto';
            return this;
        }
        get never() {
            this.signDisplay = 'never';
            return this;
        }
        get exceptZero() {
            this.signDisplay = 'exceptZero';
            return this;
        }
        // Notation
        get standard() {
            if (!this.signPattern) {
                invariant$1(!!this.signDisplay, 'Sign Display should have existed');
                this.signPattern = produceSignPattern(DUMMY_PATTERN, this.signDisplay);
            }
            return this.signPattern;
        }
        get scientific() {
            if (!this.signPattern) {
                invariant$1(!!this.signDisplay, 'Sign Display should have existed');
                this.signPattern = produceSignPattern(SCIENTIFIC_PATTERN, this.signDisplay);
            }
            return this.signPattern;
        }
    }
    class PercentPatterns extends DecimalPatterns {
        generateStandardOrScientificPattern(isScientific) {
            invariant$1(!!this.signDisplay, 'Sign Display should have existed');
            let pattern = this.numbers.percent[this.numberingSystem]
                .replace(/%/g, serializeSlotTokens(InternalSlotToken.percentSign))
                .replace(NUMBER_PATTERN, isScientific
                ? SCIENTIFIC_POSITIVE_PATTERN
                : serializeSlotTokens(InternalSlotToken.number));
            let negativePattern;
            if (pattern.indexOf(';') < 0) {
                negativePattern = `${serializeSlotTokens(InternalSlotToken.minusSign)}${pattern}`;
                pattern += ';' + negativePattern;
            }
            return produceSignPattern(pattern, this.signDisplay);
        }
        // Notation
        get standard() {
            if (!this.signPattern) {
                this.signPattern = this.generateStandardOrScientificPattern();
            }
            return this.signPattern;
        }
        get scientific() {
            if (!this.signPattern) {
                this.signPattern = this.generateStandardOrScientificPattern(true);
            }
            return this.signPattern;
        }
    }
    class UnitPatterns extends NotationPatterns {
        constructor(units, numbers, numberingSystem, unit) {
            super();
            this.unit = unit;
            this.units = units;
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
        }
        generateStandardOrScientificPattern(isScientific) {
            invariant$1(!!this.signDisplay, 'Sign Display should have existed');
            invariant$1(!!this.pattern, 'Pattern must exist');
            let { pattern } = this;
            let negativePattern;
            if (pattern.indexOf(';') < 0) {
                negativePattern = pattern.replace('{0}', '-{0}');
                pattern += ';' + negativePattern;
            }
            pattern = pattern.replace(UNIT_0_REGEX, isScientific
                ? SCIENTIFIC_POSITIVE_PATTERN
                : serializeSlotTokens(InternalSlotToken.number));
            return produceSignPattern(pattern, this.signDisplay);
        }
        produceCompactSignPattern(decimalNum) {
            if (!this.compactSignPattern) {
                this.compactSignPattern = Object.create(null);
            }
            const compactSignPatterns = this.compactSignPattern;
            if (!compactSignPatterns[decimalNum]) {
                invariant$1(!!this.pattern, 'Pattern should exist');
                invariant$1(!!this.signDisplay, 'Sign Display should exist');
                let { pattern } = this;
                let compactPattern;
                if (this.notation === 'compactShort') {
                    compactPattern = processDecimalCompactSymbol(this.numbers.decimal[this.numberingSystem].short[decimalNum].other, InternalSlotToken.compactSymbol);
                }
                else {
                    compactPattern = processDecimalCompactSymbol(this.numbers.decimal[this.numberingSystem].long[decimalNum].other, InternalSlotToken.compactName);
                }
                pattern =
                    pattern.replace('{0}', compactPattern[0]) +
                        ';' +
                        pattern.replace('{0}', compactPattern[1]);
                compactSignPatterns[decimalNum] = produceSignPattern(pattern, this.signDisplay);
            }
            return compactSignPatterns[decimalNum];
        }
        // UnitDisplay
        get narrow() {
            if (!this.pattern) {
                this.pattern = this.units[this.unit].narrow.other.pattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.unitNarrowSymbol));
            }
            return this;
        }
        get short() {
            if (!this.pattern) {
                this.pattern = this.units[this.unit].short.other.pattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.unitSymbol));
            }
            return this;
        }
        get long() {
            if (!this.pattern) {
                this.pattern = this.units[this.unit].long.other.pattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.unitName));
            }
            return this;
        }
        // Sign Display
        get always() {
            this.signDisplay = 'always';
            return this;
        }
        get auto() {
            this.signDisplay = 'auto';
            return this;
        }
        get never() {
            this.signDisplay = 'never';
            return this;
        }
        get exceptZero() {
            this.signDisplay = 'exceptZero';
            return this;
        }
        // Notation
        get standard() {
            if (!this.signPattern) {
                this.signPattern = this.generateStandardOrScientificPattern();
            }
            return this.signPattern;
        }
        get scientific() {
            if (!this.signPattern) {
                this.signPattern = this.generateStandardOrScientificPattern(true);
            }
            return this.signPattern;
        }
    }
    function resolvePatternForCurrencyCode(resolvedCurrency, data, notation, currencySign, decimalNum) {
        const shortPattern = data.short;
        const longPattern = data.long || data.short;
        let pattern = '';
        switch (notation) {
            case 'compactLong': {
                pattern =
                    (longPattern === null || longPattern === void 0 ? void 0 : longPattern[decimalNum].other) || (shortPattern === null || shortPattern === void 0 ? void 0 : shortPattern[decimalNum].other) ||
                        data.standard;
                return processCurrencyCompactSymbol(insertBetween(resolvedCurrency, pattern, data.currencySpacing.beforeInsertBetween), InternalSlotToken.compactName);
            }
            case 'compactShort':
                pattern = (shortPattern === null || shortPattern === void 0 ? void 0 : shortPattern[decimalNum].other) || data.standard;
                return processCurrencyCompactSymbol(insertBetween(resolvedCurrency, pattern, data.currencySpacing.beforeInsertBetween), InternalSlotToken.compactSymbol);
            case 'scientific':
                pattern = currencySign === 'accounting' ? data.accounting : data.standard;
                pattern = insertBetween(resolvedCurrency, pattern, data.currencySpacing.beforeInsertBetween);
                if (pattern.indexOf(';') < 0) {
                    pattern += ';' + `-${pattern}`;
                }
                return pattern.replace(NUMBER_PATTERN, SCIENTIFIC_POSITIVE_PATTERN);
            case 'standard':
                pattern = currencySign === 'accounting' ? data.accounting : data.standard;
                pattern = insertBetween(resolvedCurrency, pattern, data.currencySpacing.beforeInsertBetween);
                if (pattern.indexOf(';') < 0) {
                    pattern += ';' + `-${pattern}`;
                }
                return pattern.replace(NUMBER_PATTERN, serializeSlotTokens(InternalSlotToken.number));
        }
    }
    /**
     * Resolve pattern for currency name
     * TODO: CurrencySign doesn't matter here (accounting or standard).
     * When it comes to using `name`, it's `-1 Australian Dollars`
     * instead of `(1 Australian Dollar)`
     * @param numbers
     * @param numberingSystem
     * @param notation
     * @param decimalNum
     */
    function resolvePatternForCurrencyName(numbers, numberingSystem, notation, decimalNum) {
        const pattern = numbers.currency[numberingSystem].unitPattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.currencyName));
        let numberPattern;
        // currencySign doesn't matter here but notation does
        switch (notation) {
            case 'compactLong':
                numberPattern = processDecimalCompactSymbol(numbers.decimal[numberingSystem].long[decimalNum].other, InternalSlotToken.compactName);
                break;
            case 'compactShort':
                numberPattern = processDecimalCompactSymbol(numbers.decimal[numberingSystem].short[decimalNum].other, InternalSlotToken.compactSymbol);
                break;
            case 'scientific':
                numberPattern = [
                    SCIENTIFIC_POSITIVE_PATTERN,
                    SCIENTIFIC_NEGATIVE_PATTERN,
                ];
                break;
            case 'standard':
                numberPattern = [DUMMY_POSITIVE_PATTERN, DUMMY_NEGATIVE_PATTERN];
                break;
        }
        return (pattern.replace('{0}', numberPattern[0]) +
            ';' +
            pattern.replace('{0}', numberPattern[1]));
    }
    class CurrencyPatterns {
        constructor(currencies, numbers, numberingSystem, currency, currencySign) {
            this.currency = currency;
            this.currencies = currencies;
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
            this.currencySign = currencySign;
        }
        // CurrencyDisplay
        get code() {
            this.currencySlotToken = InternalSlotToken.currencyCode;
            this.resolvedCurrency = this.currency;
            return this;
        }
        get symbol() {
            this.currencySlotToken = InternalSlotToken.currencySymbol;
            this.resolvedCurrency = this.currencies[this.currency].symbol;
            return this;
        }
        get narrowSymbol() {
            this.currencySlotToken = InternalSlotToken.currencyNarrowSymbol;
            this.resolvedCurrency = this.currencies[this.currency].narrow;
            return this;
        }
        get name() {
            this.currencySlotToken = InternalSlotToken.currencyName;
            this.resolvedCurrency = this.currencies[this.currency].displayName.other;
            return this;
        }
        // CurrencySign
        get accounting() {
            this.currencySign = 'accounting';
            if (!this.signDisplayPatterns) {
                invariant$1(!!this.currencySign, 'Currency Sign should have existed');
                invariant$1(!!this.currencySlotToken, 'Currency Slot Token should have existed');
                invariant$1(!!this.resolvedCurrency, 'Currency should have been resolved');
                this.signDisplayPatterns = new CurrencySignDisplayPatterns(this.resolvedCurrency, this.numbers, this.numberingSystem, this.currencySign, this.currencySlotToken);
            }
            return this.signDisplayPatterns;
        }
        get standard() {
            this.currencySign = 'standard';
            if (!this.signDisplayPatterns) {
                invariant$1(!!this.currencySign, 'Currency Sign should have existed');
                invariant$1(!!this.currencySlotToken, 'Currency Display should have existed');
                invariant$1(!!this.resolvedCurrency, 'Currency should have been resolved');
                this.signDisplayPatterns = new CurrencySignDisplayPatterns(this.resolvedCurrency, this.numbers, this.numberingSystem, this.currencySign, this.currencySlotToken);
            }
            return this.signDisplayPatterns;
        }
    }
    class CurrencySignDisplayPatterns extends NotationPatterns {
        constructor(resolvedCurrency, numbers, numberingSystem, currencySign, currencySlotToken) {
            super();
            this.currency = resolvedCurrency;
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
            this.currencySign = currencySign;
            this.currencySlotToken = currencySlotToken;
        }
        // Sign Display
        get always() {
            this.signDisplay = 'always';
            return this;
        }
        get auto() {
            this.signDisplay = 'auto';
            return this;
        }
        get never() {
            this.signDisplay = 'never';
            return this;
        }
        get exceptZero() {
            this.signDisplay = 'exceptZero';
            return this;
        }
        // Notation
        // Standard currency sign
        get standard() {
            if (!this.signPattern) {
                invariant$1(!!this.currencySign, 'Currency sign should exist');
                invariant$1(!!this.signDisplay, 'Sign display must exist');
                let pattern = '';
                // name -> standard -> standard
                // name -> accounting -> standard
                if (this.currencySlotToken === InternalSlotToken.currencyName) {
                    pattern = resolvePatternForCurrencyName(this.numbers, this.numberingSystem, 'standard', '1000' // dummy
                    );
                }
                // code -> standard -> standard
                // code -> accounting -> standard
                // symbol -> standard -> standard
                // symbol -> accounting -> standard
                // narrowSymbol -> standard -> standard
                // narrowSymbol -> accounting -> standard
                else {
                    pattern = resolvePatternForCurrencyCode(this.currency, this.numbers.currency[this.numberingSystem], 'standard', this.currencySign, '1000' // dummy
                    ).replace(CURRENCY_SYMBOL_REGEX, serializeSlotTokens(this.currencySlotToken));
                }
                this.signPattern = produceSignPattern(pattern, this.signDisplay);
            }
            return this.signPattern;
        }
        get scientific() {
            if (!this.signPattern) {
                invariant$1(!!this.currencySign, 'Currency sign should exist');
                invariant$1(!!this.signDisplay, 'Sign display must exist');
                let pattern = '';
                // name -> standard -> scientific
                // name -> accounting -> scientific
                if (this.currencySlotToken === InternalSlotToken.currencyName) {
                    pattern = resolvePatternForCurrencyName(this.numbers, this.numberingSystem, 'scientific', '1000' // dummy
                    );
                }
                // code -> standard -> scientific
                // code -> accounting -> scientific
                // symbol -> standard -> scientific
                // symbol -> accounting -> scientific
                // narrowSymbol -> standard -> scientific
                // narrowSymbol -> accounting -> scientific
                else {
                    pattern = resolvePatternForCurrencyCode(this.currency, this.numbers.currency[this.numberingSystem], 'scientific', this.currencySign, '1000' // dummy
                    ).replace(CURRENCY_SYMBOL_REGEX, serializeSlotTokens(this.currencySlotToken));
                }
                this.signPattern = produceSignPattern(pattern, this.signDisplay);
            }
            return this.signPattern;
        }
        produceCompactSignPattern(decimalNum) {
            if (!this.compactSignPattern) {
                this.compactSignPattern = Object.create(null);
            }
            const compactSignPatterns = this.compactSignPattern;
            if (!compactSignPatterns[decimalNum]) {
                invariant$1(!!this.currencySign, 'Currency sign should exist');
                invariant$1(!!this.signDisplay, 'Sign display must exist');
                let pattern = '';
                // name -> standard -> compact -> compactLong
                // name -> accounting -> compact -> compactShort
                if (this.currencySlotToken === InternalSlotToken.currencyName) {
                    pattern = resolvePatternForCurrencyName(this.numbers, this.numberingSystem, this.notation, decimalNum);
                }
                else {
                    pattern = resolvePatternForCurrencyCode(this.currency, this.numbers.currency[this.numberingSystem], this.notation, this.currencySign, decimalNum).replace(CURRENCY_SYMBOL_REGEX, serializeSlotTokens(this.currencySlotToken));
                }
                compactSignPatterns[decimalNum] = processSignPattern(produceSignPattern(pattern, this.signDisplay), pattern => pattern.replace(/0+/, '{number}'));
            }
            return compactSignPatterns[decimalNum];
        }
    }

    var ADP = 0;
    var AFN = 0;
    var ALL = 0;
    var AMD = 2;
    var BHD = 3;
    var BIF = 0;
    var BYN = 2;
    var BYR = 0;
    var CAD = 2;
    var CHF = 2;
    var CLF = 4;
    var CLP = 0;
    var COP = 2;
    var CRC = 2;
    var CZK = 2;
    var DEFAULT = 2;
    var DJF = 0;
    var DKK = 2;
    var ESP = 0;
    var GNF = 0;
    var GYD = 2;
    var HUF = 2;
    var IDR = 2;
    var IQD = 0;
    var IRR = 0;
    var ISK = 0;
    var ITL = 0;
    var JOD = 3;
    var JPY = 0;
    var KMF = 0;
    var KPW = 0;
    var KRW = 0;
    var KWD = 3;
    var LAK = 0;
    var LBP = 0;
    var LUF = 0;
    var LYD = 3;
    var MGA = 0;
    var MGF = 0;
    var MMK = 0;
    var MNT = 2;
    var MRO = 0;
    var MUR = 2;
    var NOK = 2;
    var OMR = 3;
    var PKR = 2;
    var PYG = 0;
    var RSD = 0;
    var RWF = 0;
    var SEK = 2;
    var SLL = 0;
    var SOS = 0;
    var STD = 0;
    var SYP = 0;
    var TMM = 0;
    var TND = 3;
    var TRL = 0;
    var TWD = 2;
    var TZS = 2;
    var UGX = 0;
    var UYI = 0;
    var UYW = 4;
    var UZS = 2;
    var VEF = 2;
    var VND = 0;
    var VUV = 0;
    var XAF = 0;
    var XOF = 0;
    var XPF = 0;
    var YER = 0;
    var ZMK = 0;
    var ZWD = 0;
    var currencyDigits = {
    	ADP: ADP,
    	AFN: AFN,
    	ALL: ALL,
    	AMD: AMD,
    	BHD: BHD,
    	BIF: BIF,
    	BYN: BYN,
    	BYR: BYR,
    	CAD: CAD,
    	CHF: CHF,
    	CLF: CLF,
    	CLP: CLP,
    	COP: COP,
    	CRC: CRC,
    	CZK: CZK,
    	DEFAULT: DEFAULT,
    	DJF: DJF,
    	DKK: DKK,
    	ESP: ESP,
    	GNF: GNF,
    	GYD: GYD,
    	HUF: HUF,
    	IDR: IDR,
    	IQD: IQD,
    	IRR: IRR,
    	ISK: ISK,
    	ITL: ITL,
    	JOD: JOD,
    	JPY: JPY,
    	KMF: KMF,
    	KPW: KPW,
    	KRW: KRW,
    	KWD: KWD,
    	LAK: LAK,
    	LBP: LBP,
    	LUF: LUF,
    	LYD: LYD,
    	MGA: MGA,
    	MGF: MGF,
    	MMK: MMK,
    	MNT: MNT,
    	MRO: MRO,
    	MUR: MUR,
    	NOK: NOK,
    	OMR: OMR,
    	PKR: PKR,
    	PYG: PYG,
    	RSD: RSD,
    	RWF: RWF,
    	SEK: SEK,
    	SLL: SLL,
    	SOS: SOS,
    	STD: STD,
    	SYP: SYP,
    	TMM: TMM,
    	TND: TND,
    	TRL: TRL,
    	TWD: TWD,
    	TZS: TZS,
    	UGX: UGX,
    	UYI: UYI,
    	UYW: UYW,
    	UZS: UZS,
    	VEF: VEF,
    	VND: VND,
    	VUV: VUV,
    	XAF: XAF,
    	XOF: XOF,
    	XPF: XPF,
    	YER: YER,
    	ZMK: ZMK,
    	ZWD: ZWD
    };

    var currencyDigitsData = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ADP: ADP,
        AFN: AFN,
        ALL: ALL,
        AMD: AMD,
        BHD: BHD,
        BIF: BIF,
        BYN: BYN,
        BYR: BYR,
        CAD: CAD,
        CHF: CHF,
        CLF: CLF,
        CLP: CLP,
        COP: COP,
        CRC: CRC,
        CZK: CZK,
        DEFAULT: DEFAULT,
        DJF: DJF,
        DKK: DKK,
        ESP: ESP,
        GNF: GNF,
        GYD: GYD,
        HUF: HUF,
        IDR: IDR,
        IQD: IQD,
        IRR: IRR,
        ISK: ISK,
        ITL: ITL,
        JOD: JOD,
        JPY: JPY,
        KMF: KMF,
        KPW: KPW,
        KRW: KRW,
        KWD: KWD,
        LAK: LAK,
        LBP: LBP,
        LUF: LUF,
        LYD: LYD,
        MGA: MGA,
        MGF: MGF,
        MMK: MMK,
        MNT: MNT,
        MRO: MRO,
        MUR: MUR,
        NOK: NOK,
        OMR: OMR,
        PKR: PKR,
        PYG: PYG,
        RSD: RSD,
        RWF: RWF,
        SEK: SEK,
        SLL: SLL,
        SOS: SOS,
        STD: STD,
        SYP: SYP,
        TMM: TMM,
        TND: TND,
        TRL: TRL,
        TWD: TWD,
        TZS: TZS,
        UGX: UGX,
        UYI: UYI,
        UYW: UYW,
        UZS: UZS,
        VEF: VEF,
        VND: VND,
        VUV: VUV,
        XAF: XAF,
        XOF: XOF,
        XPF: XPF,
        YER: YER,
        ZMK: ZMK,
        ZWD: ZWD,
        'default': currencyDigits
    });

    var arab = [
    	"٠",
    	"١",
    	"٢",
    	"٣",
    	"٤",
    	"٥",
    	"٦",
    	"٧",
    	"٨",
    	"٩"
    ];
    var arabext = [
    	"۰",
    	"۱",
    	"۲",
    	"۳",
    	"۴",
    	"۵",
    	"۶",
    	"۷",
    	"۸",
    	"۹"
    ];
    var bali = [
    	"᭐",
    	"᭑",
    	"᭒",
    	"᭓",
    	"᭔",
    	"᭕",
    	"᭖",
    	"᭗",
    	"᭘",
    	"᭙"
    ];
    var beng = [
    	"০",
    	"১",
    	"২",
    	"৩",
    	"৪",
    	"৫",
    	"৬",
    	"৭",
    	"৮",
    	"৯"
    ];
    var deva = [
    	"०",
    	"१",
    	"२",
    	"३",
    	"४",
    	"५",
    	"६",
    	"७",
    	"८",
    	"९"
    ];
    var fullwide = [
    	"０",
    	"１",
    	"２",
    	"３",
    	"４",
    	"５",
    	"６",
    	"７",
    	"８",
    	"９"
    ];
    var gujr = [
    	"૦",
    	"૧",
    	"૨",
    	"૩",
    	"૪",
    	"૫",
    	"૬",
    	"૭",
    	"૮",
    	"૯"
    ];
    var guru = [
    	"੦",
    	"੧",
    	"੨",
    	"੩",
    	"੪",
    	"੫",
    	"੬",
    	"੭",
    	"੮",
    	"੯"
    ];
    var khmr = [
    	"០",
    	"១",
    	"២",
    	"៣",
    	"៤",
    	"៥",
    	"៦",
    	"៧",
    	"៨",
    	"៩"
    ];
    var knda = [
    	"೦",
    	"೧",
    	"೨",
    	"೩",
    	"೪",
    	"೫",
    	"೬",
    	"೭",
    	"೮",
    	"೯"
    ];
    var laoo = [
    	"໐",
    	"໑",
    	"໒",
    	"໓",
    	"໔",
    	"໕",
    	"໖",
    	"໗",
    	"໘",
    	"໙"
    ];
    var latn = [
    	"0",
    	"1",
    	"2",
    	"3",
    	"4",
    	"5",
    	"6",
    	"7",
    	"8",
    	"9"
    ];
    var limb = [
    	"᥆",
    	"᥇",
    	"᥈",
    	"᥉",
    	"᥊",
    	"᥋",
    	"᥌",
    	"᥍",
    	"᥎",
    	"᥏"
    ];
    var mlym = [
    	"൦",
    	"൧",
    	"൨",
    	"൩",
    	"൪",
    	"൫",
    	"൬",
    	"൭",
    	"൮",
    	"൯"
    ];
    var mong = [
    	"᠐",
    	"᠑",
    	"᠒",
    	"᠓",
    	"᠔",
    	"᠕",
    	"᠖",
    	"᠗",
    	"᠘",
    	"᠙"
    ];
    var mymr = [
    	"၀",
    	"၁",
    	"၂",
    	"၃",
    	"၄",
    	"၅",
    	"၆",
    	"၇",
    	"၈",
    	"၉"
    ];
    var orya = [
    	"୦",
    	"୧",
    	"୨",
    	"୩",
    	"୪",
    	"୫",
    	"୬",
    	"୭",
    	"୮",
    	"୯"
    ];
    var tamldec = [
    	"௦",
    	"௧",
    	"௨",
    	"௩",
    	"௪",
    	"௫",
    	"௬",
    	"௭",
    	"௮",
    	"௯"
    ];
    var telu = [
    	"౦",
    	"౧",
    	"౨",
    	"౩",
    	"౪",
    	"౫",
    	"౬",
    	"౭",
    	"౮",
    	"౯"
    ];
    var thai = [
    	"๐",
    	"๑",
    	"๒",
    	"๓",
    	"๔",
    	"๕",
    	"๖",
    	"๗",
    	"๘",
    	"๙"
    ];
    var tibt = [
    	"༠",
    	"༡",
    	"༢",
    	"༣",
    	"༤",
    	"༥",
    	"༦",
    	"༧",
    	"༨",
    	"༩"
    ];
    var hanidec = [
    	"〇",
    	"一",
    	"二",
    	"三",
    	"四",
    	"五",
    	"六",
    	"七",
    	"八",
    	"九"
    ];
    var ilndNumbers = {
    	arab: arab,
    	arabext: arabext,
    	bali: bali,
    	beng: beng,
    	deva: deva,
    	fullwide: fullwide,
    	gujr: gujr,
    	guru: guru,
    	khmr: khmr,
    	knda: knda,
    	laoo: laoo,
    	latn: latn,
    	limb: limb,
    	mlym: mlym,
    	mong: mong,
    	mymr: mymr,
    	orya: orya,
    	tamldec: tamldec,
    	telu: telu,
    	thai: thai,
    	tibt: tibt,
    	hanidec: hanidec
    };

    var ILND = /*#__PURE__*/Object.freeze({
        __proto__: null,
        arab: arab,
        arabext: arabext,
        bali: bali,
        beng: beng,
        deva: deva,
        fullwide: fullwide,
        gujr: gujr,
        guru: guru,
        khmr: khmr,
        knda: knda,
        laoo: laoo,
        latn: latn,
        limb: limb,
        mlym: mlym,
        mong: mong,
        mymr: mymr,
        orya: orya,
        tamldec: tamldec,
        telu: telu,
        thai: thai,
        tibt: tibt,
        hanidec: hanidec,
        'default': ilndNumbers
    });

    var names = [
    	"adlm",
    	"ahom",
    	"arab",
    	"arabext",
    	"armn",
    	"armnlow",
    	"bali",
    	"beng",
    	"bhks",
    	"brah",
    	"cakm",
    	"cham",
    	"cyrl",
    	"deva",
    	"ethi",
    	"fullwide",
    	"geor",
    	"gong",
    	"gonm",
    	"grek",
    	"greklow",
    	"gujr",
    	"guru",
    	"hanidays",
    	"hanidec",
    	"hans",
    	"hansfin",
    	"hant",
    	"hantfin",
    	"hebr",
    	"hmng",
    	"hmnp",
    	"java",
    	"jpan",
    	"jpanfin",
    	"jpanyear",
    	"kali",
    	"khmr",
    	"knda",
    	"lana",
    	"lanatham",
    	"laoo",
    	"latn",
    	"lepc",
    	"limb",
    	"mathbold",
    	"mathdbl",
    	"mathmono",
    	"mathsanb",
    	"mathsans",
    	"mlym",
    	"modi",
    	"mong",
    	"mroo",
    	"mtei",
    	"mymr",
    	"mymrshan",
    	"mymrtlng",
    	"newa",
    	"nkoo",
    	"olck",
    	"orya",
    	"osma",
    	"rohg",
    	"roman",
    	"romanlow",
    	"saur",
    	"shrd",
    	"sind",
    	"sinh",
    	"sora",
    	"sund",
    	"takr",
    	"talu",
    	"taml",
    	"tamldec",
    	"telu",
    	"thai",
    	"tibt",
    	"tirh",
    	"vaii",
    	"wara",
    	"wcho"
    ];

    const VALID_NUMBERING_SYSTEM_NAMES = Object.create(null);
    for (const nu of names) {
        VALID_NUMBERING_SYSTEM_NAMES[nu] = true;
    }
    const RESOLVED_OPTIONS_KEYS = [
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
    const SHORTENED_SACTION_UNITS = SANCTIONED_UNITS.map(unit => unit.replace(/^(.*?)-/, ''));
    /**
     * This follows https://tc39.es/ecma402/#sec-case-sensitivity-and-case-mapping
     * @param str string to convert
     */
    function toLowerCase(str) {
        return str.replace(/([A-Z])/g, (_, c) => c.toLowerCase());
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
        const units = unit.split('-per-');
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
    function isUnitSupported(unit) {
        try {
            new Intl.NumberFormat(undefined, {
                style: 'unit',
                unit,
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
        const extensionIndex = canonicalLocale.indexOf('-u-');
        return extensionIndex >= 0
            ? canonicalLocale.slice(0, extensionIndex)
            : canonicalLocale;
    }
    const __INTERNAL_SLOT_MAP__ = new WeakMap();
    function currencyDigits$1(c) {
        return c in currencyDigitsData ? currencyDigitsData[c] : 2;
    }
    function initializeNumberFormat(nf, locales, opts) {
        const requestedLocales = getCanonicalLocales(locales);
        const options = opts === undefined ? Object.create(null) : toObject(opts);
        const opt = Object.create(null);
        const matcher = getOption(options, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
        opt.localeMatcher = matcher;
        const numberingSystem = getOption(options, 'numberingSystem', 'string', undefined, undefined);
        if (numberingSystem !== undefined &&
            !VALID_NUMBERING_SYSTEM_NAMES[numberingSystem]) {
            // 8.a. If numberingSystem does not match the Unicode Locale Identifier type nonterminal,
            // throw a RangeError exception.
            throw RangeError(`Invalid numberingSystems: ${numberingSystem}`);
        }
        opt.nu = numberingSystem;
        const { localeData } = UnifiedNumberFormat;
        const r = createResolveLocale(UnifiedNumberFormat.getDefaultLocale)(UnifiedNumberFormat.availableLocales, requestedLocales, opt, 
        // [[RelevantExtensionKeys]] slot, which is a constant
        ['nu'], localeData);
        const ildData = localeData[removeUnicodeExtensionFromLocale(r.locale)];
        setMultiInternalSlots(__INTERNAL_SLOT_MAP__, nf, {
            locale: r.locale,
            dataLocale: r.dataLocale,
            numberingSystem: r.nu,
            ild: extractILD(ildData.units, ildData.currencies, ildData.numbers, r.nu),
        });
        // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-setnumberformatunitoptions
        setNumberFormatUnitOptions(nf, options);
        const style = getInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'style');
        // ---
        let mnfdDefault;
        let mxfdDefault;
        if (style === 'currency') {
            const currency = getInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'currency');
            const cDigits = currencyDigits$1(currency);
            mnfdDefault = cDigits;
            mxfdDefault = cDigits;
        }
        else {
            mnfdDefault = 0;
            mxfdDefault = style === 'percent' ? 0 : 3;
        }
        const notation = getOption(options, 'notation', 'string', ['standard', 'scientific', 'engineering', 'compact'], 'standard');
        setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'notation', notation);
        setNumberFormatDigitOptions(__INTERNAL_SLOT_MAP__, nf, options, mnfdDefault, mxfdDefault);
        const compactDisplay = getOption(options, 'compactDisplay', 'string', ['short', 'long'], 'short');
        if (notation === 'compact') {
            setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'compactDisplay', compactDisplay);
        }
        const useGrouping = getOption(options, 'useGrouping', 'boolean', undefined, true);
        setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'useGrouping', useGrouping);
        const signDisplay = getOption(options, 'signDisplay', 'string', ['auto', 'never', 'always', 'exceptZero'], 'auto');
        setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'signDisplay', signDisplay);
    }
    function partitionNumberPattern(numberFormat, x) {
        const pl = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'pl');
        let exponent = 0;
        const ild = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'ild');
        let n;
        let formattedX = x;
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
            const formatNumberResult = formatNumberToString(numberFormat, formattedX);
            n = formatNumberResult.formattedString;
            formattedX = formatNumberResult.roundedNumber;
        }
        const pattern = getNumberFormatPattern(numberFormat, x, exponent);
        const patternParts = partitionPattern(pattern);
        const results = [];
        // Unspec'ed stuff
        // This is to deal w/ cases where {number} is in the middle of a unit pattern
        let unitSymbolChunkIndex = 0;
        const notation = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'notation');
        for (const part of patternParts) {
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
                        const { numberingSystem: nu, useGrouping } = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'numberingSystem', 'useGrouping', 'notation');
                        if (nu && nu in ILND) {
                            // Replace digits
                            const replacementTable = ILND[nu];
                            let replacedDigits = '';
                            for (const digit of n) {
                                // digit can be `.` if it's fractional
                                replacedDigits += replacementTable[+digit] || digit;
                            }
                            n = replacedDigits;
                        }
                        const decimalSepIndex = n.indexOf('.');
                        let integer;
                        let fraction;
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
                            const groupSepSymbol = ild.symbols.group;
                            const groups = [];
                            // Assuming that the group separator is always inserted between every 3 digits.
                            let i = integer.length - 3;
                            for (; i > 0; i -= 3) {
                                groups.push(integer.slice(i, i + 3));
                            }
                            groups.push(integer.slice(0, i + 3));
                            while (groups.length > 0) {
                                const integerGroup = groups.pop();
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
                    const style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
                    let compactData;
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
                    const style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
                    const currencyDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currencyDisplay');
                    let compactData;
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
                    const exponentResult = toRawFixed(exponent, 0, 0);
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
                    const style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
                    if (style === 'unit') {
                        const unit = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'unit');
                        const unitSymbols = ild.unitSymbols[unit];
                        const mu = selectPlural(pl, x, unitSymbols[part.type])[unitSymbolChunkIndex];
                        results.push({ type: 'unit', value: mu });
                        unitSymbolChunkIndex++;
                    }
                    break;
                }
                case InternalSlotToken.currencyCode: {
                    const currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                    results.push({ type: 'currency', value: currency });
                    break;
                }
                case InternalSlotToken.currencySymbol: {
                    const currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                    results.push({
                        type: 'currency',
                        value: ild.currencySymbols[currency].currencySymbol || currency,
                    });
                    break;
                }
                case InternalSlotToken.currencyNarrowSymbol: {
                    const currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                    results.push({
                        type: 'currency',
                        value: ild.currencySymbols[currency].currencyNarrowSymbol || currency,
                    });
                    break;
                }
                case InternalSlotToken.currencyName: {
                    const currency = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currency');
                    const cd = selectPlural(pl, x, ild.currencySymbols[currency].currencyName);
                    results.push({ type: 'currency', value: cd });
                    break;
                }
                default:
                    throw Error(`unrecognized pattern part "${part.type}" in "${pattern}"`);
            }
        }
        return results;
    }
    function formatNumericToParts(numberFormat, x) {
        return partitionNumberPattern(numberFormat, x);
    }
    const UnifiedNumberFormat = function NumberFormat(locales, options) {
        // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
        if (!this || !(this instanceof UnifiedNumberFormat)) {
            return new UnifiedNumberFormat(locales, options);
        }
        initializeNumberFormat(this, locales, options);
        const ildData = UnifiedNumberFormat.localeData[removeUnicodeExtensionFromLocale(getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'locale'))];
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
    function defineProperty(target, name, { value }) {
        Object.defineProperty(target, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value,
        });
    }
    defineProperty(UnifiedNumberFormat.prototype, 'formatToParts', {
        value: function formatToParts(x) {
            return formatNumericToParts(this, toNumeric(x));
        },
    });
    defineProperty(UnifiedNumberFormat.prototype, 'resolvedOptions', {
        value: function resolvedOptions() {
            const slots = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, this, ...RESOLVED_OPTIONS_KEYS);
            const ro = {};
            for (const key of RESOLVED_OPTIONS_KEYS) {
                const value = slots[key];
                if (value !== undefined) {
                    ro[key] = value;
                }
            }
            return ro;
        },
    });
    const formatDescriptor = {
        enumerable: false,
        configurable: true,
        get() {
            if (typeof this !== 'object' || !(this instanceof UnifiedNumberFormat)) {
                throw TypeError('Intl.NumberFormat format property accessor called on imcompatible receiver');
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const numberFormat = this;
            let boundFormat = getInternalSlot(__INTERNAL_SLOT_MAP__, this, 'boundFormat');
            if (boundFormat === undefined) {
                // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_diff_out.html#sec-number-format-functions
                boundFormat = (value) => {
                    // TODO: check bigint
                    const x = toNumeric(value);
                    return numberFormat
                        .formatToParts(x)
                        .map(x => x.value)
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
    UnifiedNumberFormat.__addLocaleData = function __addLocaleData(...data) {
        for (const datum of data) {
            const availableLocales = Object.keys([
                ...datum.availableLocales,
                ...Object.keys(datum.aliases),
                ...Object.keys(datum.parentLocales),
            ].reduce((all, k) => {
                all[k] = true;
                return all;
            }, {}));
            for (const locale of availableLocales) {
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
    UnifiedNumberFormat.getDefaultLocale = () => {
        return UnifiedNumberFormat.__defaultLocale;
    };
    UnifiedNumberFormat.polyfilled = true;
    function setNumberFormatUnitOptions(nf, options = Object.create(null)) {
        // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-setnumberformatunitoptions
        const style = getOption(options, 'style', 'string', ['decimal', 'percent', 'currency', 'unit'], 'decimal');
        setInternalSlot(__INTERNAL_SLOT_MAP__, nf, 'style', style);
        const currency = getOption(options, 'currency', 'string', undefined, undefined);
        if (currency !== undefined && !isWellFormedCurrencyCode(currency)) {
            throw RangeError('Malformed currency code');
        }
        const currencyDisplay = getOption(options, 'currencyDisplay', 'string', ['code', 'symbol', 'narrowSymbol', 'name'], 'symbol');
        const currencySign = getOption(options, 'currencySign', 'string', ['standard', 'accounting'], 'standard');
        const unit = getOption(options, 'unit', 'string', undefined, undefined);
        if (unit !== undefined && !isWellFormedUnitIdentifier(unit)) {
            throw RangeError('Invalid unit argument for Intl.NumberFormat()');
        }
        const unitDisplay = getOption(options, 'unitDisplay', 'string', ['short', 'narrow', 'long'], 'short');
        if (style === 'currency') {
            if (currency === undefined) {
                throw new TypeError('currency cannot be undefined');
            }
            setMultiInternalSlots(__INTERNAL_SLOT_MAP__, nf, {
                currency: currency.toUpperCase(),
                currencyDisplay,
                currencySign,
            });
        }
        else if (style === 'unit') {
            if (unit === undefined) {
                throw new TypeError('unit cannot be undefined');
            }
            setMultiInternalSlots(__INTERNAL_SLOT_MAP__, nf, {
                unit,
                unitDisplay,
            });
        }
    }
    // Taking the shortcut here and used the native NumberFormat for formatting numbers.
    function formatNumberToString(numberFormat, x) {
        const isNegative = x < 0 || objectIs(x, -0);
        if (isNegative) {
            x = -x;
        }
        const { roundingType, minimumSignificantDigits, maximumSignificantDigits, minimumFractionDigits, maximumFractionDigits, minimumIntegerDigits, } = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'roundingType', 'minimumFractionDigits', 'maximumFractionDigits', 'minimumIntegerDigits', 'minimumSignificantDigits', 'maximumSignificantDigits');
        let result;
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
        let string = result.formattedString;
        const int = result.integerDigitsCount;
        const minInteger = minimumIntegerDigits;
        if (int < minInteger) {
            const forwardZeros = repeat('0', minInteger - int);
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
        const magnitude = getMagnitude(x);
        const exponent = computeExponentForMagnitude(numberFormat, magnitude);
        x = x / Math.pow(10, exponent); // potential IEEE floating point error
        const formatNumberResult = formatNumberToString(numberFormat, x);
        if (formatNumberResult.roundedNumber === 0) {
            return exponent;
        }
        const newMagnitude = getMagnitude(x);
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
        const notation = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'notation');
        const style = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'style');
        const ild = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'ild');
        switch (notation) {
            case 'standard':
                return 0;
            case 'scientific':
                return magnitude;
            case 'engineering':
                return Math.floor(magnitude / 3) * 3;
            case 'compact': {
                const compactDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'compactDisplay');
                const currencyDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'currencyDisplay');
                let thresholdMap;
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
                const num = String(Math.pow(10, magnitude));
                const thresholds = Object.keys(thresholdMap); // TODO: this can be pre-processed
                if (!((_a = thresholdMap[num]) === null || _a === void 0 ? void 0 : _a.other)) {
                    return 0;
                }
                if (num < thresholds[0]) {
                    return 0;
                }
                if (num > thresholds[thresholds.length - 1]) {
                    return getMagnitude(+thresholds[thresholds.length - 1]);
                }
                let i = thresholds.indexOf(num);
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
        const { style, patterns: slots } = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'style', 'patterns', 'signDisplay', 'notation');
        let patterns;
        switch (style) {
            case 'percent':
                patterns = slots.percent;
                break;
            case 'unit': {
                const unitDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'unitDisplay');
                const unit = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'unit');
                patterns = slots.unit[unit][unitDisplay];
                break;
            }
            case 'currency': {
                const { currency, currencyDisplay, currencySign } = getMultiInternalSlots(__INTERNAL_SLOT_MAP__, numberFormat, 'currency', 'currencyDisplay', 'currencySign');
                patterns = slots.currency[currency][currencyDisplay][currencySign];
                break;
            }
            case 'decimal':
                patterns = slots.decimal;
                break;
        }
        const notation = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'notation');
        const signDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'signDisplay');
        const signDisplayPattern = patterns[signDisplay];
        let signPattern;
        if (!isNaN(x) && isFinite(x)) {
            if (notation === 'scientific' || notation === 'engineering') {
                signPattern = signDisplayPattern.scientific;
            }
            else if (exponent !== 0) {
                invariant(notation === 'compact', 'notation must be compact');
                const compactDisplay = getInternalSlot(__INTERNAL_SLOT_MAP__, numberFormat, 'compactDisplay');
                const decimalNum = String(Math.pow(10, exponent));
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
        let pattern;
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

    if (!isUnitSupported('bit')) {
        Intl.NumberFormat = UnifiedNumberFormat;
    }

    if (Intl.NumberFormat && typeof Intl.NumberFormat.__addLocaleData === 'function') {
      Intl.NumberFormat.__addLocaleData(
        {"data":{"ar":{"units":{"degree":{"displayName":"درجة","long":{"other":{"symbol":["درجة"],"pattern":"{0} {1}"},"one":{"symbol":["درجة"],"pattern":"{1}"},"two":{"symbol":["درجتان"],"pattern":"{1}"},"few":{"symbol":["درجات"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["درجة"],"pattern":"{0} {1}"},"one":{"symbol":["درجة"],"pattern":"{1}"},"two":{"symbol":["درجتان"],"pattern":"{1}"},"few":{"symbol":["درجات"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["درجة"],"pattern":"{0} {1}"},"two":{"symbol":["درجتان (",")"],"pattern":"{1}{0}{1}"},"few":{"symbol":["درجات"],"pattern":"{0} {1}"}}},"acre":{"displayName":"فدان","long":{"other":{"symbol":["فدان"],"pattern":"{0} {1}"},"one":{"symbol":["فدان"],"pattern":"{1}"}},"short":{"other":{"symbol":["فدان"],"pattern":"{0} {1}"},"one":{"symbol":["فدان"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["من الفدادين"],"pattern":"{0} {1}"},"one":{"symbol":["فدان"],"pattern":"{0} {1}"},"two":{"symbol":["فدانان (",")"],"pattern":"{1}{0}{1}"},"few":{"symbol":["فدادين"],"pattern":"{0} {1}"},"many":{"symbol":["فدانًا"],"pattern":"{0} {1}"}}},"hectare":{"displayName":"هكتار","long":{"other":{"symbol":["هكتار"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["هكتار"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["هكت"],"pattern":"{0} {1}"},"one":{"symbol":["هكتار"],"pattern":"{0} {1}"},"few":{"symbol":["هكتارات"],"pattern":"{0} {1}"},"many":{"symbol":["هكتارًا"],"pattern":"{0} {1}"}}},"percent":{"displayName":"بالمائة","long":{"other":{"symbol":["بالمائة"],"pattern":"{0} {1}"},"zero":{"symbol":["٪"],"pattern":"{0}{1}"},"two":{"symbol":["٪"],"pattern":"{0}{1}"},"few":{"symbol":["٪"],"pattern":"{0}{1}"},"many":{"symbol":["٪"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["٪"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["٪"],"pattern":"{0}{1}"}}},"bit":{"displayName":"بت","long":{"other":{"symbol":["بت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["بت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["بت"],"pattern":"{0} {1}"}}},"byte":{"displayName":"بايت","long":{"other":{"symbol":["بايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["بايت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["بايت"],"pattern":"{0} {1}"}}},"gigabit":{"displayName":"غيغابت","long":{"other":{"symbol":["غيغابت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["غيغابت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["غيغابت"],"pattern":"{0} {1}"}}},"gigabyte":{"displayName":"غيغابايت","long":{"other":{"symbol":["غيغابايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["غيغابايت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["غيغابايت"],"pattern":"{0} {1}"}}},"kilobit":{"displayName":"كيلوبت","long":{"other":{"symbol":["كيلوبت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["كيلوبت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["كيلوبت"],"pattern":"{0} {1}"}}},"kilobyte":{"displayName":"كيلوبايت","long":{"other":{"symbol":["كيلوبايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["كيلوبايت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["كيلوبايت"],"pattern":"{0} {1}"}}},"megabit":{"displayName":"ميغابت","long":{"other":{"symbol":["ميغابت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ميغابت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ميغابت"],"pattern":"{0} {1}"}}},"megabyte":{"displayName":"ميغابايت","long":{"other":{"symbol":["ميغابايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ميغابايت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ميغابايت"],"pattern":"{0} {1}"}}},"petabyte":{"displayName":"بيتابايت","long":{"other":{"symbol":["بيتابايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["بيتابايت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["بيتابايت"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"تيرابت","long":{"other":{"symbol":["تيرابت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["تيرابت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["تيرابت"],"pattern":"{0} {1}"}}},"terabyte":{"displayName":"تيرابايت","long":{"other":{"symbol":["تيرابايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["تيرابايت"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["تيرابايت"],"pattern":"{0} {1}"}}},"day":{"displayName":"أيام","long":{"other":{"symbol":["يوم"],"pattern":"{0} {1}"},"one":{"symbol":["يوم"],"pattern":"{1}"},"two":{"symbol":["يومان"],"pattern":"{1}"},"few":{"symbol":["أيام"],"pattern":"{0} {1}"},"many":{"symbol":["يومًا"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["يوم"],"pattern":"{0} {1}"},"one":{"symbol":["يوم"],"pattern":"{1}"},"two":{"symbol":["يومان"],"pattern":"{1}"},"few":{"symbol":["أيام"],"pattern":"{0} {1}"},"many":{"symbol":["يومًا"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ي"],"pattern":"{0} {1}"}}},"hour":{"displayName":"ساعات","long":{"other":{"symbol":["ساعة"],"pattern":"{0} {1}"},"one":{"symbol":["ساعة"],"pattern":"{1}"},"two":{"symbol":["ساعتان"],"pattern":"{1}"},"few":{"symbol":["ساعات"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["س"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["س"],"pattern":"{0} {1}"}}},"millisecond":{"displayName":"ملي ثانية","long":{"other":{"symbol":["ملي ثانية"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ملي ث"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ملي ث"],"pattern":"{0} {1}"}}},"minute":{"displayName":"دقيقة","long":{"other":{"symbol":["دقيقة"],"pattern":"{0} {1}"},"one":{"symbol":["دقيقة"],"pattern":"{1}"},"two":{"symbol":["دقيقتان"],"pattern":"{1}"},"few":{"symbol":["دقائق"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["د"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["د"],"pattern":"{0} {1}"}}},"month":{"displayName":"شهور","long":{"other":{"symbol":["شهر"],"pattern":"{0} {1}"},"one":{"symbol":["شهر"],"pattern":"{1}"},"two":{"symbol":["شهران"],"pattern":"{1}"},"few":{"symbol":["أشهر"],"pattern":"{0} {1}"},"many":{"symbol":["شهرًا"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["شهر"],"pattern":"{0} {1}"},"one":{"symbol":["شهر"],"pattern":"{1}"},"two":{"symbol":["شهران"],"pattern":"{1}"},"few":{"symbol":["أشهر"],"pattern":"{0} {1}"},"many":{"symbol":["شهرًا"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["شهر"],"pattern":"{0} {1}"},"one":{"symbol":["شهر"],"pattern":"{1}"},"two":{"symbol":["شهران"],"pattern":"{1}"}}},"second":{"displayName":"ثانية","long":{"other":{"symbol":["ثانية"],"pattern":"{0} {1}"},"one":{"symbol":["ثانية"],"pattern":"{1}"},"two":{"symbol":["ثانيتان"],"pattern":"{1}"},"few":{"symbol":["ثوان"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ث"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ث"],"pattern":"{0} {1}"}}},"week":{"displayName":"أسابيع","long":{"other":{"symbol":["أسبوع"],"pattern":"{0} {1}"},"one":{"symbol":["أسبوع"],"pattern":"{1}"},"two":{"symbol":["أسبوعان"],"pattern":"{1}"},"few":{"symbol":["أسابيع"],"pattern":"{0} {1}"},"many":{"symbol":["أسبوعًا"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["أسبوع"],"pattern":"{0} {1}"},"one":{"symbol":["أسبوع"],"pattern":"{1}"},"two":{"symbol":["أسبوعان"],"pattern":"{1}"},"few":{"symbol":["أسابيع"],"pattern":"{0} {1}"},"many":{"symbol":["أسبوعًا"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["أ"],"pattern":"{0} {1}"}}},"year":{"displayName":"سنوات","long":{"other":{"symbol":["سنة"],"pattern":"{0} {1}"},"one":{"symbol":["سنة"],"pattern":"{1}"},"two":{"symbol":["سنتان"],"pattern":"{1}"},"few":{"symbol":["سنوات"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["سنة"],"pattern":"{0} {1}"},"one":{"symbol":["سنة واحدة"],"pattern":"{1}"},"two":{"symbol":["سنتان"],"pattern":"{1}"},"few":{"symbol":["سنوات"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["سنة"],"pattern":"{0} {1}"}}},"centimeter":{"displayName":"سنتيمتر","long":{"other":{"symbol":["سنتيمتر"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["سم"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["سم"],"pattern":"{0} {1}"}}},"foot":{"displayName":"قدم","long":{"other":{"symbol":["قدم"],"pattern":"{0} {1}"},"one":{"symbol":["قدم"],"pattern":"{1}"}},"short":{"other":{"symbol":["قدم"],"pattern":"{0} {1}"},"one":{"symbol":["قدم"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["من الأقدام"],"pattern":"{0} {1}"},"one":{"symbol":["قدم"],"pattern":"{0} {1}"},"two":{"symbol":["قدمان (",")"],"pattern":"{1}{0}{1}"},"few":{"symbol":["أقدام"],"pattern":"{0} {1}"},"many":{"symbol":["قدمًا"],"pattern":"{0} {1}"}}},"inch":{"displayName":"بوصة","long":{"other":{"symbol":["بوصة"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["بوصة"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["بوصة"],"pattern":"{0} {1}"}}},"kilometer":{"displayName":"كيلومتر","long":{"other":{"symbol":["كيلومتر"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["كم"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["كم"],"pattern":"{0} {1}"}}},"meter":{"displayName":"متر","long":{"other":{"symbol":["متر"],"pattern":"{0} {1}"},"one":{"symbol":["متر"],"pattern":"{1}"},"two":{"symbol":["متران"],"pattern":"{1}"},"few":{"symbol":["أمتار"],"pattern":"{0} {1}"},"many":{"symbol":["مترًا"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["متر"],"pattern":"{0} {1}"},"one":{"symbol":["متر"],"pattern":"{1}"},"two":{"symbol":["متران"],"pattern":"{1}"},"few":{"symbol":["أمتار"],"pattern":"{0} {1}"},"many":{"symbol":["مترًا"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["م"],"pattern":"{0} {1}"}}},"mile-scandinavian":{"displayName":"ميل اسكندنافي","long":{"other":{"symbol":["ميل اسكندنافي"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ميل اسكندنافي"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ميل اسكندنافي"],"pattern":"{0} {1}"}}},"mile":{"displayName":"ميل","long":{"other":{"symbol":["ميل"],"pattern":"{0} {1}"},"one":{"symbol":["ميل"],"pattern":"{1}"},"two":{"symbol":["ميلان"],"pattern":"{1}"},"few":{"symbol":["أميال"],"pattern":"{0} {1}"},"many":{"symbol":["ميلاً"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ميل"],"pattern":"{0} {1}"},"one":{"symbol":["ميل"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["من الأميال"],"pattern":"{0} {1}"},"one":{"symbol":["ميل"],"pattern":"{0} {1}"},"two":{"symbol":["ميلان (",")"],"pattern":"{1}{0}{1}"},"few":{"symbol":["أميال"],"pattern":"{0} {1}"},"many":{"symbol":["ميلاً"],"pattern":"{0} {1}"}}},"millimeter":{"displayName":"مليمتر","long":{"other":{"symbol":["مليمتر"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["مم"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["مم"],"pattern":"{0} {1}"}}},"yard":{"displayName":"ياردة","long":{"other":{"symbol":["ياردة"],"pattern":"{0} {1}"},"one":{"symbol":["ياردة"],"pattern":"{1}"}},"short":{"other":{"symbol":["ياردة"],"pattern":"{0} {1}"},"one":{"symbol":["ياردة"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["من الياردات"],"pattern":"{0} {1}"},"one":{"symbol":["ياردة"],"pattern":"{0} {1}"},"two":{"symbol":["ياردتان (",")"],"pattern":"{1}{0}{1}"},"few":{"symbol":["ياردات"],"pattern":"{0} {1}"},"many":{"symbol":["ياردة"],"pattern":"{0} {1}"}}},"gram":{"displayName":"غرام","long":{"other":{"symbol":["غرام"],"pattern":"{0} {1}"},"one":{"symbol":["غرام"],"pattern":"{1}"},"two":{"symbol":["غرامان"],"pattern":"{1}"},"few":{"symbol":["غرامات"],"pattern":"{0} {1}"},"many":{"symbol":["غرامًا"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["غرام"],"pattern":"{0} {1}"},"one":{"symbol":["غرام"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["غ"],"pattern":"{0} {1}"}}},"kilogram":{"displayName":"كيلوغرام","long":{"other":{"symbol":["كيلوغرام"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["كغم"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["كغ"],"pattern":"{0} {1}"}}},"ounce":{"displayName":"أونصة","long":{"other":{"symbol":["أونصة"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["أونصة"],"pattern":"{0} {1}"},"one":{"symbol":["أونصة"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["أونس"],"pattern":"{0} {1}"}}},"pound":{"displayName":"رطل","long":{"other":{"symbol":["رطل"],"pattern":"{0} {1}"},"two":{"symbol":["رطلان"],"pattern":"{1}"},"few":{"symbol":["أرطل"],"pattern":"{0} {1}"},"many":{"symbol":["رطلًا"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["رطل"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["#"],"pattern":"{0}{1}"}}},"stone":{"displayName":"st","long":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0} {1}"}}},"celsius":{"displayName":"درجة مئوية","long":{"other":{"symbol":["درجة مئوية"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°م"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°م"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"درجة فهرنهايت","long":{"other":{"symbol":["درجة فهرنهايت"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°ف"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["د ف"],"pattern":"{0} {1}"}}},"fluid-ounce":{"displayName":"أونصة سائلة","long":{"other":{"symbol":["أونصة سائلة"],"pattern":"{0} {1}"},"one":{"symbol":["أونصة سائلة"],"pattern":"{1}"},"two":{"symbol":["أونصتان سائلتان"],"pattern":"{1}"}},"short":{"other":{"symbol":["أونصة سائلة"],"pattern":"{0} {1}"},"one":{"symbol":["أونصة س"],"pattern":"{1}"},"two":{"symbol":["أونصة س"],"pattern":"{0} {1}"},"few":{"symbol":["أونصات سائلة"],"pattern":"{0} {1}"},"many":{"symbol":["أونصة س"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["أونصة سائلة"],"pattern":"{0} {1}"},"one":{"symbol":["أونصة س"],"pattern":"{1}"},"two":{"symbol":["أونصة س"],"pattern":"{0} {1}"},"few":{"symbol":["أونصات سائلة"],"pattern":"{0} {1}"},"many":{"symbol":["أونصة س"],"pattern":"{0} {1}"}}},"gallon":{"displayName":"غالون","long":{"other":{"symbol":["غالون"],"pattern":"{0} {1}"},"one":{"symbol":["غالون"],"pattern":"{1}"}},"short":{"other":{"symbol":["غالون"],"pattern":"{0} {1}"},"one":{"symbol":["غالون"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["غالون"],"pattern":"{0} {1}"},"one":{"symbol":["غالون"],"pattern":"{1}"}}},"liter":{"displayName":"لتر","long":{"other":{"symbol":["لتر"],"pattern":"{0} {1}"},"one":{"symbol":["لتر"],"pattern":"{1}"}},"short":{"other":{"symbol":["لتر"],"pattern":"{0} {1}"},"one":{"symbol":["لتر"],"pattern":"{1}"}},"narrow":{"other":{"symbol":["ل"],"pattern":"{0} {1}"}}},"milliliter":{"displayName":"مليلتر","long":{"other":{"symbol":["مليلتر"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ملتر"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ملتر"],"pattern":"{0} {1}"}}}},"currencies":{"ADP":{"displayName":{"other":"بيستا أندوري"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"درهم إماراتي"},"symbol":"د.إ.‏","narrow":"د.إ.‏"},"AFA":{"displayName":{"other":"أفغاني - 1927-2002"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"أفغاني أفغانستاني"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"ALK"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"ليك ألباني"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"درام أرميني"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"غيلدر أنتيلي هولندي"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"كوانزا أنغولي"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"كوانزا أنجولي - 1977-1990"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"كوانزا أنجولي جديدة - 1990-2000"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"كوانزا أنجولي معدلة - 1995 - 1999"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"استرال أرجنتيني"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"ARL"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"ARM"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"بيزو أرجنتيني - 1983-1985"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"بيزو أرجنتيني"},"symbol":"ARS","narrow":"AR$"},"ATS":{"displayName":{"other":"شلن نمساوي"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"دولار أسترالي"},"symbol":"AU$","narrow":"AU$"},"AWG":{"displayName":{"other":"فلورن أروبي"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"مانات أذريبجاني"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"مانت أذربيجاني"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"دينار البوسنة والهرسك"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"مارك البوسنة والهرسك قابل للتحويل"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"BAN"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"دولار بربادوسي"},"symbol":"BBD","narrow":"BB$"},"BDT":{"displayName":{"other":"تاكا بنغلاديشي"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"فرنك بلجيكي قابل للتحويل"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"فرنك بلجيكي"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"فرنك بلجيكي مالي"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"BGL"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"BGM"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"ليف بلغاري"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"BGO"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"دينار بحريني"},"symbol":"د.ب.‏","narrow":"د.ب.‏"},"BIF":{"displayName":{"other":"فرنك بروندي"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"دولار برمودي"},"symbol":"BMD","narrow":"BM$"},"BND":{"displayName":{"other":"دولار بروناي"},"symbol":"BND","narrow":"BN$"},"BOB":{"displayName":{"other":"بوليفيانو بوليفي"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"BOL"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"بيزو بوليفي"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"مفدول بوليفي"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"نوفو كروزايرو برازيلي - 1967-1986"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"كروزادو برازيلي"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"كروزايرو برازيلي - 1990-1993"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"ريال برازيلي"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"BRN"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"BRR"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"BRZ"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"دولار باهامي"},"symbol":"BSD","narrow":"BS$"},"BTN":{"displayName":{"other":"نولتوم بوتاني"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"كيات بورمي"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"بولا بتسواني"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"روبل بيلاروسي جديد - 1994-1999"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"روبل بيلاروسي"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"روبل بيلاروسي (٢٠٠٠–٢٠١٦)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"دولار بليزي","two":"دولاران بليزيان"},"symbol":"BZD","narrow":"BZ$"},"CAD":{"displayName":{"other":"دولار كندي"},"symbol":"CA$","narrow":"CA$"},"CDF":{"displayName":{"other":"فرنك كونغولي"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"CHE"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"فرنك سويسري"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"CHW"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"CLE"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"CLF"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"بيزو تشيلي"},"symbol":"CLP","narrow":"CL$"},"CNH":{"displayName":{"other":"يوان صيني (في الخارج)"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"CNX"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"يوان صيني"},"symbol":"CN¥","narrow":"CN¥"},"COP":{"displayName":{"other":"بيزو كولومبي"},"symbol":"COP","narrow":"CO$"},"COU":{"displayName":{"other":"COU"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"كولن كوستاريكي"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"دينار صربي قديم"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"كرونة تشيكوسلوفاكيا"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"بيزو كوبي قابل للتحويل"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"بيزو كوبي"},"symbol":"CUP","narrow":"CU$"},"CVE":{"displayName":{"other":"اسكودو الرأس الأخضر"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"جنيه قبرصي"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"كرونة تشيكية"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"أوستمارك ألماني شرقي"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"مارك ألماني"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"فرنك جيبوتي"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"كرونة دنماركية"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"بيزو الدومنيكان"},"symbol":"DOP","narrow":"DO$"},"DZD":{"displayName":{"other":"دينار جزائري","two":"ديناران جزائريان","few":"دينارات جزائرية","many":"دينارًا جزائريًا"},"symbol":"د.ج.‏","narrow":"د.ج.‏"},"ECS":{"displayName":{"other":"ECS"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"ECV"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"كرونة استونية"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"جنيه مصري","two":"جنيهان مصريان","few":"جنيهات مصرية","many":"جنيهًا مصريًا"},"symbol":"ج.م.‏","narrow":"E£"},"ERN":{"displayName":{"other":"ناكفا أريتري"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"ESA"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"ESB"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"بيزيتا إسباني"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"بير أثيوبي"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"يورو"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"ماركا فنلندي"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"دولار فيجي"},"symbol":"FJD","narrow":"FJ$"},"FKP":{"displayName":{"other":"جنيه جزر فوكلاند"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"فرنك فرنسي"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"جنيه إسترليني"},"symbol":"UK£","narrow":"UK£"},"GEK":{"displayName":{"other":"GEK"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"لاري جورجي"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"سيدي غاني"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"سيدي غانا"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"جنيه جبل طارق"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"دلاسي غامبي"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"فرنك غينيا"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"سيلي غينيا"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"اكويل جونينا غينيا الاستوائيّة"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"دراخما يوناني"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"كوتزال غواتيمالا"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"اسكود برتغالي غينيا"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"بيزو غينيا بيساو"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"دولار غيانا"},"symbol":"GYD","narrow":"GY$"},"HKD":{"displayName":{"other":"دولار هونغ كونغ"},"symbol":"HK$","narrow":"HK$"},"HNL":{"displayName":{"other":"ليمبيرا هندوراس"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"دينار كرواتي"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"كونا كرواتي"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"جوردى هايتي"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"فورينت هنغاري"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"روبية إندونيسية"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"جنيه إيرلندي"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"جنيه إسرائيلي"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"ILR"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"شيكل إسرائيلي جديد"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"روبية هندي"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"دينار عراقي"},"symbol":"د.ع.‏","narrow":"د.ع.‏"},"IRR":{"displayName":{"other":"ريال إيراني"},"symbol":"ر.إ.","narrow":"ر.إ."},"ISJ":{"displayName":{"other":"ISJ"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"كرونة أيسلندية"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"ليرة إيطالية"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"دولار جامايكي"},"symbol":"JMD","narrow":"JM$"},"JOD":{"displayName":{"other":"دينار أردني"},"symbol":"د.أ.‏","narrow":"د.أ.‏"},"JPY":{"displayName":{"other":"ين ياباني"},"symbol":"JP¥","narrow":"JP¥"},"KES":{"displayName":{"other":"شلن كينيي"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"سوم قيرغستاني"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"رييال كمبودي"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"فرنك جزر القمر"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"وون كوريا الشمالية"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"KRH"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"KRO"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"وون كوريا الجنوبية"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"دينار كويتي"},"symbol":"د.ك.‏","narrow":"د.ك.‏"},"KYD":{"displayName":{"other":"دولار جزر كيمن"},"symbol":"KYD","narrow":"KY$"},"KZT":{"displayName":{"other":"تينغ كازاخستاني"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"كيب لاوسي"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"جنيه لبناني"},"symbol":"ل.ل.‏","narrow":"L£"},"LKR":{"displayName":{"other":"روبية سريلانكية"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"دولار ليبيري","two":"دولاران ليبيريان","few":"دولارات ليبيرية","many":"دولارًا ليبيريًا"},"symbol":"LRD","narrow":"$LR"},"LSL":{"displayName":{"other":"لوتي ليسوتو"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"ليتا ليتوانية"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"تالوناس ليتواني"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"فرنك لوكسمبرج قابل للتحويل"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"فرنك لوكسمبرج"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"فرنك لوكسمبرج المالي"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"لاتس لاتفي"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"روبل لاتفيا"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"دينار ليبي","two":"ديناران ليبيان","few":"دينارات ليبية","many":"دينارًا ليبيًا"},"symbol":"د.ل.‏","narrow":"د.ل.‏"},"MAD":{"displayName":{"other":"درهم مغربي","two":"درهمان مغربيان","few":"دراهم مغربية","many":"درهمًا مغربيًا"},"symbol":"د.م.‏","narrow":"د.م.‏"},"MAF":{"displayName":{"other":"فرنك مغربي"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"MCF"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"MDC"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"ليو مولدوفي"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"أرياري مدغشقر"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"فرنك مدغشقر"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"دينار مقدوني","two":"ديناران مقدونيان","few":"دينارات مقدونية","many":"دينارًا مقدونيًا"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"MKN"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"فرنك مالي"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"كيات ميانمار"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"توغروغ منغولي"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"باتاكا ماكاوي"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"أوقية موريتانية - 1973-2017"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"أوقية موريتانية"},"symbol":"أ.م.","narrow":"أ.م."},"MTL":{"displayName":{"other":"ليرة مالطية"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"جنيه مالطي"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"روبية موريشيوسية"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"MVP"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"روفيه جزر المالديف"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"كواشا مالاوي"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"بيزو مكسيكي"},"symbol":"MX$","narrow":"MX$"},"MXP":{"displayName":{"other":"بيزو فضي مكسيكي - 1861-1992"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"MXV"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"رينغيت ماليزي"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"اسكود موزمبيقي"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"MZM"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"متكال موزمبيقي"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"دولار ناميبي"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"نايرا نيجيري"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"كوردوبة نيكاراجوا"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"قرطبة نيكاراغوا"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"جلدر هولندي"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"كرونة نرويجية"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"روبية نيبالي"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"دولار نيوزيلندي"},"symbol":"NZ$","narrow":"NZ$"},"OMR":{"displayName":{"other":"ريال عماني"},"symbol":"ر.ع.‏","narrow":"ر.ع.‏"},"PAB":{"displayName":{"other":"بالبوا بنمي"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"PEI"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"سول بيروفي"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"PES"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"كينا بابوا غينيا الجديدة"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"بيزو فلبيني"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"روبية باكستاني"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"زلوتي بولندي"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"زلوتي بولندي - 1950-1995"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"اسكود برتغالي"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"غواراني باراغواي"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"ريال قطري"},"symbol":"ر.ق.‏","narrow":"ر.ق.‏"},"RHD":{"displayName":{"other":"دولار روديسي"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"ليو روماني قديم"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"ليو روماني"},"symbol":"RON","narrow":"lei"},"RSD":{"displayName":{"other":"دينار صربي","two":"ديناران صربيان","few":"دينارات صربية","many":"دينارًا صربيًا"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"روبل روسي"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"روبل روسي - 1991-1998"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"فرنك رواندي"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"ريال سعودي"},"symbol":"ر.س.‏","narrow":"ر.س.‏"},"SBD":{"displayName":{"other":"دولار جزر سليمان"},"symbol":"SBD","narrow":"SB$"},"SCR":{"displayName":{"other":"روبية سيشيلية"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"دينار سوداني"},"symbol":"د.س.‏","narrow":"د.س.‏"},"SDG":{"displayName":{"other":"جنيه سوداني","few":"جنيهات سودانية","many":"جنيهًا سودانيًا"},"symbol":"ج.س.","narrow":"ج.س."},"SDP":{"displayName":{"other":"جنيه سوداني قديم"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"كرونة سويدية"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"دولار سنغافوري"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"جنيه سانت هيلين"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"تولار سلوفيني"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"كرونة سلوفاكية"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"ليون سيراليوني"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"شلن صومالي"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"دولار سورينامي"},"symbol":"SRD","narrow":"SR$"},"SRG":{"displayName":{"other":"جلدر سورينامي"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"جنيه جنوب السودان","two":"جنيهان جنوب السودان","few":"جنيهات جنوب السودان","many":"جنيهًا جنوب السودان"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"دوبرا ساو تومي وبرينسيبي - 1977-2017"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"دوبرا ساو تومي وبرينسيبي"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"روبل سوفيتي"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"كولون سلفادوري"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"ليرة سورية"},"symbol":"ل.س.‏","narrow":"£"},"SZL":{"displayName":{"other":"ليلانجيني سوازيلندي"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"باخت تايلاندي"},"symbol":"฿","narrow":"฿"},"TJR":{"displayName":{"other":"روبل طاجيكستاني"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"سوموني طاجيكستاني"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"مانات تركمنستاني"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"مانات تركمانستان"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"دينار تونسي","two":"ديناران تونسيان","few":"دينارات تونسية","many":"دينارًا تونسيًا"},"symbol":"د.ت.‏","narrow":"د.ت.‏"},"TOP":{"displayName":{"other":"بانغا تونغا"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"اسكود تيموري"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"ليرة تركي"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"ليرة تركية"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"دولار ترينداد وتوباغو"},"symbol":"TTD","narrow":"TT$"},"TWD":{"displayName":{"other":"دولار تايواني"},"symbol":"NT$","narrow":"NT$"},"TZS":{"displayName":{"other":"شلن تنزاني"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"هريفنيا أوكراني"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"UAK"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"شلن أوغندي - 1966-1987"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"شلن أوغندي"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"دولار أمريكي"},"symbol":"US$","narrow":"US$"},"USN":{"displayName":{"other":"دولار أمريكي (اليوم التالي)‏"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"دولار أمريكي (نفس اليوم)‏"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"UYI"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"بيزو أوروجواي - 1975-1993"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"بيزو اوروغواي"},"symbol":"UYU","narrow":"UY$"},"UYW":{"displayName":{"other":"UYW"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"سوم أوزبكستاني"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"بوليفار فنزويلي - 1871-2008"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"بوليفار فنزويلي - 2008–2018"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"بوليفار فنزويلي"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"دونج فيتنامي"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"VNN"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"فاتو فانواتو"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"تالا ساموا"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"فرنك وسط أفريقي"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"فضة"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"ذهب"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"الوحدة الأوروبية المركبة"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"الوحدة المالية الأوروبية"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"الوحدة الحسابية الأوروبية"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"(XBD)وحدة الحساب الأوروبية"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"دولار شرق الكاريبي"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"حقوق السحب الخاصة"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"وحدة النقد الأوروبية"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"فرنك فرنسي ذهبي"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"(UIC)فرنك فرنسي"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"فرنك غرب أفريقي"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"بالاديوم"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"فرنك سي إف بي"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"البلاتين"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"XRE"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"XSU"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"كود اختبار العملة"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"XUA"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"(عملة غير معروفة)"},"symbol":"***","narrow":"***"},"YDD":{"displayName":{"other":"دينار يمني"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"ريال يمني"},"symbol":"ر.ي.‏","narrow":"ر.ي.‏"},"YUD":{"displayName":{"other":"دينار يوغسلافي"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"YUM"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"دينار يوغسلافي قابل للتحويل"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"YUR"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"راند جنوب أفريقيا -مالي"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"راند جنوب أفريقيا"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"كواشا زامبي - 1968-2012"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"كواشا زامبي"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"زائير زائيري جديد"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"زائير زائيري"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"دولار زمبابوي"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"دولار زمبابوي 2009"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"ZWR"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["arab","latn"],"symbols":{"arab":{"decimal":"٫","group":"٬","list":"؛","percentSign":"٪؜","plusSign":"؜+","minusSign":"؜-","exponential":"اس","superscriptingExponent":"×","perMille":"؉","infinity":"∞","nan":"ليس رقم","timeSeparator":":"},"latn":{"decimal":".","group":",","list":";","percentSign":"‎%‎","plusSign":"‎+","minusSign":"‎-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"ليس رقمًا","timeSeparator":":"}},"percent":{"arab":"#,##0%","latn":"#,##0%"},"decimal":{"arab":{"long":{"1000":{"other":"0 ألف","few":"0 آلاف"},"10000":{"other":"00 ألف"},"100000":{"other":"000 ألف"},"1000000":{"other":"0 مليون","few":"0 ملايين"},"10000000":{"other":"00 مليون","few":"00 ملايين"},"100000000":{"other":"000 مليون"},"1000000000":{"other":"0 مليار"},"10000000000":{"other":"00 مليار"},"100000000000":{"other":"000 مليار"},"1000000000000":{"other":"0 ترليون"},"10000000000000":{"other":"00 ترليون"},"100000000000000":{"other":"000 ترليون"}},"short":{"1000":{"other":"0 ألف","few":"0 آلاف"},"10000":{"other":"00 ألف"},"100000":{"other":"000 ألف"},"1000000":{"other":"0 مليون"},"10000000":{"other":"00 مليون"},"100000000":{"other":"000 مليون"},"1000000000":{"other":"0 مليار"},"10000000000":{"other":"00 مليار"},"100000000000":{"other":"000 مليار"},"1000000000000":{"other":"0 ترليون"},"10000000000000":{"other":"00 ترليون"},"100000000000000":{"other":"000 ترليون"}}},"latn":{"long":{"1000":{"other":"0 ألف","few":"0 آلاف"},"10000":{"other":"00 ألف"},"100000":{"other":"000 ألف"},"1000000":{"other":"0 مليون","few":"0 ملايين"},"10000000":{"other":"00 مليون","few":"00 ملايين"},"100000000":{"other":"000 مليون"},"1000000000":{"other":"0 مليار"},"10000000000":{"other":"00 مليار"},"100000000000":{"other":"000 مليار"},"1000000000000":{"other":"0 ترليون"},"10000000000000":{"other":"00 ترليون"},"100000000000000":{"other":"000 ترليون"}},"short":{"1000":{"other":"0 ألف","few":"0 آلاف"},"10000":{"other":"00 ألف"},"100000":{"other":"000 ألف"},"1000000":{"other":"0 مليون"},"10000000":{"other":"00 مليون"},"100000000":{"other":"000 مليون"},"1000000000":{"other":"0 مليار"},"10000000000":{"other":"00 مليار"},"100000000000":{"other":"000 مليار"},"1000000000000":{"other":"0 ترليون"},"10000000000000":{"other":"00 ترليون"},"100000000000000":{"other":"000 ترليون"}}}},"currency":{"arab":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"#,##0.00 ¤","accounting":"#,##0.00 ¤","unitPattern":"{0} {1}"},"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤ #,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0} {1}","short":{"1000":{"other":"¤ 0 ألف"},"10000":{"other":"¤ 00 ألف"},"100000":{"other":"¤ 000 ألف"},"1000000":{"other":"¤ 0 مليون"},"10000000":{"other":"¤ 00 مليون"},"100000000":{"other":"¤ 000 مليون"},"1000000000":{"other":"¤ 0 مليار"},"10000000000":{"other":"¤ 00 مليار"},"100000000000":{"other":"¤ 000 مليار"},"1000000000000":{"other":"¤ 0 ترليون"},"10000000000000":{"other":"¤ 00 ترليون"},"100000000000000":{"other":"¤ 000 ترليون"}}}}},"nu":["arab","latn"]}},"availableLocales":["ar"],"aliases":{},"parentLocales":{}},
    {"data":{"de":{"units":{"degree":{"displayName":"Grad","long":{"other":{"symbol":["Grad"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"acre":{"displayName":"Acres","long":{"other":{"symbol":["Acres"],"pattern":"{0} {1}"},"one":{"symbol":["Acre"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ac"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ac"],"pattern":"{0} {1}"}}},"hectare":{"displayName":"Hektar","long":{"other":{"symbol":["Hektar"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ha"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ha"],"pattern":"{0} {1}"}}},"percent":{"displayName":"Prozent","long":{"other":{"symbol":["Prozent"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0} {1}"}}},"bit":{"displayName":"Bits","long":{"other":{"symbol":["Bits"],"pattern":"{0} {1}"},"one":{"symbol":["Bit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Bits"],"pattern":"{0} {1}"},"one":{"symbol":["Bit"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Bits"],"pattern":"{0} {1}"},"one":{"symbol":["Bit"],"pattern":"{0} {1}"}}},"byte":{"displayName":"Bytes","long":{"other":{"symbol":["Bytes"],"pattern":"{0} {1}"},"one":{"symbol":["Byte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Bytes"],"pattern":"{0} {1}"},"one":{"symbol":["Byte"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Bytes"],"pattern":"{0} {1}"},"one":{"symbol":["Byte"],"pattern":"{0} {1}"}}},"gigabit":{"displayName":"Gigabits","long":{"other":{"symbol":["Gigabits"],"pattern":"{0} {1}"},"one":{"symbol":["Gigabit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}}},"gigabyte":{"displayName":"Gigabytes","long":{"other":{"symbol":["Gigabytes"],"pattern":"{0} {1}"},"one":{"symbol":["Gigabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}}},"kilobit":{"displayName":"Kilobits","long":{"other":{"symbol":["Kilobits"],"pattern":"{0} {1}"},"one":{"symbol":["Kilobit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}}},"kilobyte":{"displayName":"Kilobytes","long":{"other":{"symbol":["Kilobytes"],"pattern":"{0} {1}"},"one":{"symbol":["Kilobyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}}},"megabit":{"displayName":"Megabits","long":{"other":{"symbol":["Megabits"],"pattern":"{0} {1}"},"one":{"symbol":["Megabit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}}},"megabyte":{"displayName":"Megabytes","long":{"other":{"symbol":["Megabytes"],"pattern":"{0} {1}"},"one":{"symbol":["Megabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}}},"petabyte":{"displayName":"Petabytes","long":{"other":{"symbol":["Petabytes"],"pattern":"{0} {1}"},"one":{"symbol":["Petabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"Terabits","long":{"other":{"symbol":["Terabits"],"pattern":"{0} {1}"},"one":{"symbol":["Terabit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}}},"terabyte":{"displayName":"Terabytes","long":{"other":{"symbol":["Terabytes"],"pattern":"{0} {1}"},"one":{"symbol":["Terabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}}},"day":{"displayName":"Tage","long":{"other":{"symbol":["Tage"],"pattern":"{0} {1}"},"one":{"symbol":["Tag"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Tg."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["T"],"pattern":"{0} {1}"}}},"hour":{"displayName":"Stunden","long":{"other":{"symbol":["Stunden"],"pattern":"{0} {1}"},"one":{"symbol":["Stunde"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Std."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Std."],"pattern":"{0} {1}"}}},"millisecond":{"displayName":"Millisekunden","long":{"other":{"symbol":["Millisekunden"],"pattern":"{0} {1}"},"one":{"symbol":["Millisekunde"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ms"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ms"],"pattern":"{0} {1}"}}},"minute":{"displayName":"Minuten","long":{"other":{"symbol":["Minuten"],"pattern":"{0} {1}"},"one":{"symbol":["Minute"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Min."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Min."],"pattern":"{0} {1}"}}},"month":{"displayName":"Monate","long":{"other":{"symbol":["Monate"],"pattern":"{0} {1}"},"one":{"symbol":["Monat"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Mon."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["M"],"pattern":"{0} {1}"}}},"second":{"displayName":"Sekunden","long":{"other":{"symbol":["Sekunden"],"pattern":"{0} {1}"},"one":{"symbol":["Sekunde"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Sek."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Sek."],"pattern":"{0} {1}"}}},"week":{"displayName":"Wochen","long":{"other":{"symbol":["Wochen"],"pattern":"{0} {1}"},"one":{"symbol":["Woche"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Wo."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["W"],"pattern":"{0} {1}"}}},"year":{"displayName":"Jahre","long":{"other":{"symbol":["Jahre"],"pattern":"{0} {1}"},"one":{"symbol":["Jahr"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["J"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["J"],"pattern":"{0} {1}"}}},"centimeter":{"displayName":"Zentimeter","long":{"other":{"symbol":["Zentimeter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["cm"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["cm"],"pattern":"{0} {1}"}}},"foot":{"displayName":"Fuß","long":{"other":{"symbol":["Fuß"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ft"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ft"],"pattern":"{0} {1}"}}},"inch":{"displayName":"Zoll","long":{"other":{"symbol":["Zoll"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["in"],"pattern":"{0} {1}"},"one":{"symbol":["in"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["in"],"pattern":"{0} {1}"},"one":{"symbol":["in"],"pattern":"{0} {1}"}}},"kilometer":{"displayName":"Kilometer","long":{"other":{"symbol":["Kilometer"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["km"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["km"],"pattern":"{0} {1}"}}},"meter":{"displayName":"Meter","long":{"other":{"symbol":["Meter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["m"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0} {1}"}}},"mile-scandinavian":{"displayName":"skandinavische Meilen","long":{"other":{"symbol":["skandinavische Meilen"],"pattern":"{0} {1}"},"one":{"symbol":["skandinavische Meile"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["smi"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["smi"],"pattern":"{0} {1}"}}},"mile":{"displayName":"Meilen","long":{"other":{"symbol":["Meilen"],"pattern":"{0} {1}"},"one":{"symbol":["Meile"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mi"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mi"],"pattern":"{0} {1}"}}},"millimeter":{"displayName":"Millimeter","long":{"other":{"symbol":["Millimeter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mm"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mm"],"pattern":"{0} {1}"}}},"yard":{"displayName":"Yards","long":{"other":{"symbol":["Yards"],"pattern":"{0} {1}"},"one":{"symbol":["Yard"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["yd"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["yd"],"pattern":"{0} {1}"}}},"gram":{"displayName":"Gramm","long":{"other":{"symbol":["Gramm"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["g"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["g"],"pattern":"{0} {1}"}}},"kilogram":{"displayName":"Kilogramm","long":{"other":{"symbol":["Kilogramm"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kg"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kg"],"pattern":"{0} {1}"}}},"ounce":{"displayName":"Unzen","long":{"other":{"symbol":["Unzen"],"pattern":"{0} {1}"},"one":{"symbol":["Unze"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["oz"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["oz"],"pattern":"{0} {1}"}}},"pound":{"displayName":"Pfund","long":{"other":{"symbol":["Pfund"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["lb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["lb"],"pattern":"{0} {1}"}}},"stone":{"displayName":"Stones","long":{"other":{"symbol":["Stones"],"pattern":"{0} {1}"},"one":{"symbol":["Stone"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0} {1}"}}},"celsius":{"displayName":"Grad Celsius","long":{"other":{"symbol":["Grad Celsius"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"Grad Fahrenheit","long":{"other":{"symbol":["Grad Fahrenheit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"Flüssigunzen","long":{"other":{"symbol":["Flüssigunzen"],"pattern":"{0} {1}"},"one":{"symbol":["Flüssigunze"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["fl oz"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["fl oz"],"pattern":"{0} {1}"}}},"gallon":{"displayName":"Gallonen","long":{"other":{"symbol":["Gallonen"],"pattern":"{0} {1}"},"one":{"symbol":["Gallone"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["gal"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["gal"],"pattern":"{0} {1}"}}},"liter":{"displayName":"Liter","long":{"other":{"symbol":["Liter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["l"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["l"],"pattern":"{0} {1}"}}},"milliliter":{"displayName":"Milliliter","long":{"other":{"symbol":["Milliliter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ml"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ml"],"pattern":"{0} {1}"}}}},"currencies":{"ADP":{"displayName":{"other":"Andorranische Peseten","one":"Andorranische Pesete"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"VAE-Dirham"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"Afghanische Afghani (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"Afghanische Afghani","one":"Afghanischer Afghani"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"Albanische Lek (1946–1965)","one":"Albanischer Lek (1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"Albanische Lek","one":"Albanischer Lek"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"Armenische Dram","one":"Armenischer Dram"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"Niederländische-Antillen-Gulden"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"Angolanische Kwanza","one":"Angolanischer Kwanza"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"Angolanische Kwanza (1977–1990)","one":"Angolanischer Kwanza (1977–1990)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"Angolanische Neue Kwanza (1990–2000)","one":"Angolanischer Neuer Kwanza (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"Angolanische Kwanza Reajustado (1995–1999)","one":"Angolanischer Kwanza Reajustado (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"Argentinische Austral","one":"Argentinischer Austral"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"Argentinische Pesos Ley (1970–1983)","one":"Argentinischer Peso Ley (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"Argentinische Pesos (1881–1970)","one":"Argentinischer Peso (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"Argentinische Peso (1983–1985)","one":"Argentinischer Peso (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"Argentinische Pesos","one":"Argentinischer Peso"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"Österreichische Schilling","one":"Österreichischer Schilling"},"symbol":"öS","narrow":"öS"},"AUD":{"displayName":{"other":"Australische Dollar","one":"Australischer Dollar"},"symbol":"AU$","narrow":"$"},"AWG":{"displayName":{"other":"Aruba-Florin"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"Aserbaidschan-Manat (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"Aserbaidschan-Manat"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"Bosnien und Herzegowina Dinar (1992–1994)"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"Bosnien und Herzegowina Konvertierbare Mark"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"Bosnien und Herzegowina Neue Dinar (1994–1997)","one":"Bosnien und Herzegowina Neuer Dinar (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"Barbados-Dollar"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"Bangladesch-Taka"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"Belgische Franc (konvertibel)","one":"Belgischer Franc (konvertibel)"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"Belgische Franc","one":"Belgischer Franc"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"Belgische Finanz-Franc","one":"Belgischer Finanz-Franc"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"Bulgarische Lew (1962–1999)"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"Bulgarische Lew (1952–1962)","one":"Bulgarischer Lew (1952–1962)"},"symbol":"BGK","narrow":"BGK"},"BGN":{"displayName":{"other":"Bulgarische Lew","one":"Bulgarischer Lew"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"Bulgarische Lew (1879–1952)","one":"Bulgarischer Lew (1879–1952)"},"symbol":"BGJ","narrow":"BGJ"},"BHD":{"displayName":{"other":"Bahrain-Dinar"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"Burundi-Francs","one":"Burundi-Franc"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"Bermuda-Dollar"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"Brunei-Dollar"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"Bolivianische Bolivianos","one":"Bolivianischer Boliviano"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"Bolivianische Bolivianos (1863–1963)","one":"Bolivianischer Boliviano (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"Bolivianische Peso","one":"Bolivianischer Peso"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"Bolivianische Mvdol","one":"Boliviansiche Mvdol"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"Brasilianische Cruzeiro Novo (1967–1986)","one":"Brasilianischer Cruzeiro Novo (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"Brasilianische Cruzado (1986–1989)","one":"Brasilianischer Cruzado (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"Brasilianische Cruzeiro (1990–1993)","one":"Brasilianischer Cruzeiro (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"Brasilianische Real","one":"Brasilianischer Real"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"Brasilianische Cruzado Novo (1989–1990)","one":"Brasilianischer Cruzado Novo (1989–1990)"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"Brasilianische Cruzeiro (1993–1994)","one":"Brasilianischer Cruzeiro (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"Brasilianischer Cruzeiro (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"Bahamas-Dollar"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"Bhutan-Ngultrum"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"Birmanische Kyat","one":"Birmanischer Kyat"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"Botswanische Pula","one":"Botswanischer Pula"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"Belarus-Rubel (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"Weißrussische Rubel","one":"Weißrussischer Rubel"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"Weißrussische Rubel (2000–2016)","one":"Weißrussischer Rubel (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"Belize-Dollar"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"Kanadische Dollar","one":"Kanadischer Dollar"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"Kongo-Francs","one":"Kongo-Franc"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"WIR-Euro"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"Schweizer Franken"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"WIR Franken"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"Chilenische Escudo","one":"Chilenischer Escudo"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"Chilenische Unidades de Fomento"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"Chilenische Pesos","one":"Chilenischer Peso"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"Renminbi Yuan (Off–Shore)"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"Dollar der Chinesischen Volksbank"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"Renminbi Yuan","one":"Chinesischer Yuan"},"symbol":"CN¥","narrow":"¥"},"COP":{"displayName":{"other":"Kolumbianische Pesos","one":"Kolumbianischer Peso"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"Kolumbianische Unidades de valor real","one":"Kolumbianische Unidad de valor real"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"Costa-Rica-Colón"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"Serbische Dinar (2002–2006)","one":"Serbischer Dinar (2002–2006)"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"Tschechoslowakische Kronen"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"Kubanische Pesos (konvertibel)","one":"Kubanischer Peso (konvertibel)"},"symbol":"CUC","narrow":"Cub$"},"CUP":{"displayName":{"other":"Kubanische Pesos","one":"Kubanischer Peso"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"Cabo-Verde-Escudos","one":"Cabo-Verde-Escudo"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"Zypern Pfund"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"Tschechische Kronen","one":"Tschechische Krone"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"Mark der DDR"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"Deutsche Mark"},"symbol":"DM","narrow":"DM"},"DJF":{"displayName":{"other":"Dschibuti-Franc"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"Dänische Kronen","one":"Dänische Krone"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"Dominikanische Pesos","one":"Dominikanischer Peso"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"Algerische Dinar","one":"Algerischer Dinar"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"Ecuadorianische Sucre","one":"Ecuadorianischer Sucre"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"Verrechnungseinheiten für Ecuador"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"Estnische Kronen","one":"Estnische Krone"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"Ägyptische Pfund","one":"Ägyptisches Pfund"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"Eritreische Nakfa","one":"Eritreischer Nakfa"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"Spanische Peseten (A–Konten)","one":"Spanische Peseta (A–Konten)"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"Spanische Peseten (konvertibel)","one":"Spanische Peseta (konvertibel)"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"Spanische Peseten","one":"Spanische Peseta"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"Äthiopische Birr","one":"Äthiopischer Birr"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"Euro"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"Finnische Mark"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"Fidschi-Dollar"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"Falkland-Pfund"},"symbol":"FKP","narrow":"Fl£"},"FRF":{"displayName":{"other":"Französische Franc","one":"Französischer Franc"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"Britische Pfund","one":"Britisches Pfund"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"Georgische Kupon Larit","one":"Georgischer Kupon Larit"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"Georgische Lari","one":"Georgischer Lari"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"Ghanaische Cedi (1979–2007)","one":"Ghanaischer Cedi (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"Ghanaische Cedi","one":"Ghanaischer Cedi"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"Gibraltar-Pfund"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"Gambia-Dalasi"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"Guinea-Franc"},"symbol":"GNF","narrow":"F.G."},"GNS":{"displayName":{"other":"Guineische Syli","one":"Guineischer Syli"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"Äquatorialguinea-Ekwele"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"Griechische Drachmen","one":"Griechische Drachme"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"Guatemaltekische Quetzales","one":"Guatemaltekischer Quetzal"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"Portugiesisch Guinea Escudo"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"Guinea-Bissau Pesos","one":"Guinea-Bissau Peso"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"Guyana-Dollar"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"Hongkong-Dollar"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"Honduras-Lempira"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"Kroatische Dinar","one":"Kroatischer Dinar"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"Kroatische Kuna","one":"Kroatischer Kuna"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"Haitianische Gourdes","one":"Haitianische Gourde"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"Ungarische Forint","one":"Ungarischer Forint"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"Indonesische Rupiah"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"Irische Pfund","one":"Irisches Pfund"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"Israelische Pfund","one":"Israelisches Pfund"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"Israelische Schekel (1980–1985)","one":"Israelischer Schekel (1980–1985)"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"Israelische Neue Schekel","one":"Israelischer Neuer Schekel"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"Indische Rupien","one":"Indische Rupie"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"Irakische Dinar","one":"Irakischer Dinar"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"Iranische Rial","one":"Iranischer Rial"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"Isländische Kronen (1918–1981)","one":"Isländische Krone (1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"Isländische Kronen","one":"Isländische Krone"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"Italienische Lire","one":"Italienische Lira"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"Jamaika-Dollar"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"Jordanische Dinar","one":"Jordanischer Dinar"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"Japanische Yen","one":"Japanischer Yen"},"symbol":"¥","narrow":"¥"},"KES":{"displayName":{"other":"Kenia-Schilling"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"Kirgisische Som","one":"Kirgisischer Som"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"Kambodschanische Riel","one":"Kambodschanischer Riel"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"Komoren-Francs","one":"Komoren-Franc"},"symbol":"KMF","narrow":"FC"},"KPW":{"displayName":{"other":"Nordkoreanische Won","one":"Nordkoreanischer Won"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"Südkoreanischer Hwan (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"Südkoreanischer Won (1945–1953)"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"Südkoreanische Won","one":"Südkoreanischer Won"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"Kuwait-Dinar"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"Kaiman-Dollar"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"Kasachische Tenge","one":"Kasachischer Tenge"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"Laotische Kip","one":"Laotischer Kip"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"Libanesische Pfund","one":"Libanesisches Pfund"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"Sri-Lanka-Rupien","one":"Sri-Lanka-Rupie"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"Liberianische Dollar","one":"Liberianischer Dollar"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"Loti"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"Litauische Litas","one":"Litauischer Litas"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"Litauische Talonas"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"Luxemburgische Franc (konvertibel)"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"Luxemburgische Franc"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"Luxemburgische Finanz-Franc"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"Lettische Lats","one":"Lettischer Lats"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"Lettische Rubel"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"Libysche Dinar","one":"Libyscher Dinar"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"Marokkanische Dirham","one":"Marokkanischer Dirham"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"Marokkanische Franc"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"Monegassische Franc","one":"Monegassischer Franc"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"Moldau-Cupon"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"Moldau-Leu"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"Madagaskar-Ariary"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"Madagaskar-Franc"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"Mazedonische Denari","one":"Mazedonischer Denar"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"Mazedonische Denar (1992–1993)","one":"Mazedonischer Denar (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"Malische Franc"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"Myanmarische Kyat","one":"Myanmarischer Kyat"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"Mongolische Tögrög","one":"Mongolischer Tögrög"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"Macao-Pataca"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"Mauretanische Ouguiya (1973–2017)","one":"Mauretanischer Ouguiya (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"Mauretanische Ouguiya","one":"Mauretanischer Ouguiya"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"Maltesische Lira"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"Maltesische Pfund"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"Mauritius-Rupien","one":"Mauritius-Rupie"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"Malediven-Rupien (alt)","one":"Malediven-Rupie (alt)"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"Malediven-Rupien","one":"Malediven-Rufiyaa"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"Malawi-Kwacha"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"Mexikanische Pesos","one":"Mexikanischer Peso"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"Mexikanische Silber-Pesos (1861–1992)","one":"Mexikanische Silber-Peso (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"Mexikanische Unidad de Inversion (UDI)","one":"Mexicanischer Unidad de Inversion (UDI)"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"Malaysische Ringgit","one":"Malaysischer Ringgit"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"Mozambikanische Escudo"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"Mosambikanische Meticais (1980–2006)","one":"Mosambikanischer Metical (1980–2006)"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"Mosambikanische Meticais","one":"Mosambikanischer Metical"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"Namibia-Dollar"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"Nigerianische Naira","one":"Nigerianischer Naira"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"Nicaraguanische Córdoba (1988–1991)","one":"Nicaraguanischer Córdoba (1988–1991)"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"Nicaragua-Córdobas","one":"Nicaragua-Córdoba"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"Niederländische Gulden","one":"Niederländischer Gulden"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"Norwegische Kronen","one":"Norwegische Krone"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"Nepalesische Rupien","one":"Nepalesische Rupie"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"Neuseeland-Dollar"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"Omanische Rials","one":"Omanischer Rial"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"Panamaische Balboas","one":"Panamaischer Balboa"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"Peruanische Inti"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"Peruanische Sol","one":"Peruanischer Sol"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"Peruanische Sol (1863–1965)","one":"Peruanischer Sol (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"Papua-Neuguineische Kina","one":"Papua-Neuguineischer Kina"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"Philippinische Pesos","one":"Philippinischer Peso"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"Pakistanische Rupien","one":"Pakistanische Rupie"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"Polnische Złoty","one":"Polnischer Złoty"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"Polnische Zloty (1950–1995)","one":"Polnischer Zloty (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"Portugiesische Escudo"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"Paraguayische Guaraníes","one":"Paraguayischer Guaraní"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"Katar-Riyal"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"Rhodesische Dollar"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"Rumänische Leu (1952–2006)","one":"Rumänischer Leu (1952–2006)"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"Rumänische Leu","one":"Rumänischer Leu"},"symbol":"RON","narrow":"L"},"RSD":{"displayName":{"other":"Serbische Dinaren","one":"Serbischer Dinar"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"Russische Rubel","one":"Russischer Rubel"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"Russische Rubel (1991–1998)","one":"Russischer Rubel (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"Ruanda-Francs","one":"Ruanda-Franc"},"symbol":"RWF","narrow":"F.Rw"},"SAR":{"displayName":{"other":"Saudi-Rial"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"Salomonen-Dollar"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"Seychellen-Rupien","one":"Seychellen-Rupie"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"Sudanesische Dinar (1992–2007)","one":"Sudanesischer Dinar (1992–2007)"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"Sudanesische Pfund","one":"Sudanesisches Pfund"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"Sudanesische Pfund (1957–1998)","one":"Sudanesisches Pfund (1957–1998)"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"Schwedische Kronen","one":"Schwedische Krone"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"Singapur-Dollar"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"St. Helena-Pfund"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"Slowenische Tolar","one":"Slowenischer Tolar"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"Slowakische Kronen"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"Sierra-leonische Leones","one":"Sierra-leonischer Leone"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"Somalia-Schilling"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"Suriname-Dollar"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"Suriname-Gulden"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"Südsudanesische Pfund","one":"Südsudanesisches Pfund"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"São-toméische Dobra (1977–2017)","one":"São-toméischer Dobra (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"São-toméische Dobras","one":"São-toméischer Dobra"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"Sowjetische Rubel"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"El Salvador-Colon"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"Syrische Pfund","one":"Syrisches Pfund"},"symbol":"SYP","narrow":"SYP"},"SZL":{"displayName":{"other":"Swasiländische Emalangeni","one":"Swasiländischer Lilangeni"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"Thailändische Baht","one":"Thailändischer Baht"},"symbol":"฿","narrow":"฿"},"TJR":{"displayName":{"other":"Tadschikistan-Rubel"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"Tadschikistan-Somoni"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"Turkmenistan-Manat (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"Turkmenistan-Manat"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"Tunesische Dinar","one":"Tunesischer Dinar"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"Tongaische Paʻanga","one":"Tongaischer Paʻanga"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"Timor-Escudo"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"Türkische Lira (1922–2005)"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"Türkische Lira"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"Trinidad und Tobago-Dollar"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"Neue Taiwan-Dollar","one":"Neuer Taiwan-Dollar"},"symbol":"NT$","narrow":"NT$"},"TZS":{"displayName":{"other":"Tansania-Schilling"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"Ukrainische Hrywen","one":"Ukrainische Hrywnja"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"Ukrainische Karbovanetz"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"Uganda-Schilling (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"Uganda-Schilling"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"US-Dollar"},"symbol":"$","narrow":"$"},"USN":{"displayName":{"other":"US-Dollar (Nächster Tag)"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"US-Dollar (Gleicher Tag)"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"Uruguayische Pesos (Indexierte Rechnungseinheiten)","one":"Uruguayischer Peso (Indexierte Rechnungseinheiten)"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"Uruguayische Pesos (1975–1993)","one":"Uruguayischer Peso (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"Uruguayische Pesos","one":"Uruguayischer Peso"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"UYW"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"Usbekistan-Sum"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"Venezolanische Bolívares (1871–2008)","one":"Venezolanischer Bolívar (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"Venezolanische Bolívares (2008–2018)","one":"Venezolanischer Bolívar (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"Venezolanische Bolívares","one":"Venezolanischer Bolívar"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"Vietnamesische Dong","one":"Vietnamesischer Dong"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"Vietnamesische Dong(1978–1985)","one":"Vietnamesischer Dong(1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"Vanuatu-Vatu"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"Samoanische Tala","one":"Samoanischer Tala"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"CFA-Franc (BEAC)"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"Unzen Silber","one":"Unze Silber"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"Unzen Gold","one":"Unze Gold"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"Europäische Rechnungseinheiten"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"Europäische Währungseinheiten (XBB)"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"Europäische Rechnungseinheiten (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"Europäische Rechnungseinheiten (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"Ostkaribische Dollar","one":"Ostkaribischer Dollar"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"Sonderziehungsrechte"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"Europäische Währungseinheiten (XEU)"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"Französische Gold-Franc"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"Französische UIC-Franc"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"CFA-Francs (BCEAO)","one":"CFA-Franc (BCEAO)"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"Unzen Palladium","one":"Unze Palladium"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"CFP-Franc"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"Unzen Platin","one":"Unze Platin"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET Funds"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"SUCRE"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"Testwährung"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"Rechnungseinheiten der AfEB","one":"Rechnungseinheit der AfEB"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"(unbekannte Währung)"},"symbol":"XXX","narrow":"XXX"},"YDD":{"displayName":{"other":"Jemen-Dinar"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"Jemen-Rial"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"Jugoslawische Dinar (1966–1990)","one":"Jugoslawischer Dinar (1966–1990)"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"Jugoslawische Neue Dinar (1994–2002)","one":"Jugoslawischer Neuer Dinar (1994–2002)"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"Jugoslawische Dinar (konvertibel)"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"Jugoslawische reformierte Dinar (1992–1993)","one":"Jugoslawischer reformierter Dinar (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"Südafrikanischer Rand (Finanz)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"Südafrikanische Rand","one":"Südafrikanischer Rand"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"Kwacha (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"Kwacha"},"symbol":"ZMW","narrow":"K"},"ZRN":{"displayName":{"other":"Zaire-Neue Zaïre (1993–1998)","one":"Zaire-Neuer Zaïre (1993–1998)"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"Zaire-Zaïre (1971–1993)"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"Simbabwe-Dollar (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"Simbabwe-Dollar (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"Simbabwe-Dollar (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":",","group":".","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"·","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0 %"},"decimal":{"latn":{"long":{"1000":{"other":"0 Tausend"},"10000":{"other":"00 Tausend"},"100000":{"other":"000 Tausend"},"1000000":{"other":"0 Millionen","one":"0 Million"},"10000000":{"other":"00 Millionen"},"100000000":{"other":"000 Millionen"},"1000000000":{"other":"0 Milliarden","one":"0 Milliarde"},"10000000000":{"other":"00 Milliarden"},"100000000000":{"other":"000 Milliarden"},"1000000000000":{"other":"0 Billionen","one":"0 Billion"},"10000000000000":{"other":"00 Billionen"},"100000000000000":{"other":"000 Billionen"}},"short":{"1000":{"other":"0"},"10000":{"other":"0"},"100000":{"other":"0"},"1000000":{"other":"0 Mio'.'"},"10000000":{"other":"00 Mio'.'"},"100000000":{"other":"000 Mio'.'"},"1000000000":{"other":"0 Mrd'.'"},"10000000000":{"other":"00 Mrd'.'"},"100000000000":{"other":"000 Mrd'.'"},"1000000000000":{"other":"0 Bio'.'"},"10000000000000":{"other":"00 Bio'.'"},"100000000000000":{"other":"000 Bio'.'"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"#,##0.00 ¤","accounting":"#,##0.00 ¤","unitPattern":"{0} {1}","short":{"1000":{"other":"0"},"10000":{"other":"0"},"100000":{"other":"0"},"1000000":{"other":"0 Mio'.' ¤"},"10000000":{"other":"00 Mio'.' ¤"},"100000000":{"other":"000 Mio'.' ¤"},"1000000000":{"other":"0 Mrd'.' ¤"},"10000000000":{"other":"00 Mrd'.' ¤"},"100000000000":{"other":"000 Mrd'.' ¤"},"1000000000000":{"other":"0 Bio'.' ¤"},"10000000000000":{"other":"00 Bio'.' ¤"},"100000000000000":{"other":"000 Bio'.' ¤"}}}}},"nu":["latn"]}},"availableLocales":["de"],"aliases":{},"parentLocales":{}},
    {"data":{"en":{"units":{"degree":{"displayName":"degrees","long":{"other":{"symbol":["degrees"],"pattern":"{0} {1}"},"one":{"symbol":["degree"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["deg"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"acre":{"displayName":"acres","long":{"other":{"symbol":["acres"],"pattern":"{0} {1}"},"one":{"symbol":["acre"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ac"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ac"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"hectares","long":{"other":{"symbol":["hectares"],"pattern":"{0} {1}"},"one":{"symbol":["hectare"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ha"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ha"],"pattern":"{0}{1}"}}},"percent":{"displayName":"percent","long":{"other":{"symbol":["percent"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"bits","long":{"other":{"symbol":["bits"],"pattern":"{0} {1}"},"one":{"symbol":["bit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["bit"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["bit"],"pattern":"{0}{1}"}}},"byte":{"displayName":"bytes","long":{"other":{"symbol":["bytes"],"pattern":"{0} {1}"},"one":{"symbol":["byte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["byte"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["B"],"pattern":"{0}{1}"}}},"gigabit":{"displayName":"gigabits","long":{"other":{"symbol":["gigabits"],"pattern":"{0} {1}"},"one":{"symbol":["gigabit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Gb"],"pattern":"{0}{1}"}}},"gigabyte":{"displayName":"gigabytes","long":{"other":{"symbol":["gigabytes"],"pattern":"{0} {1}"},"one":{"symbol":["gigabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["GB"],"pattern":"{0}{1}"}}},"kilobit":{"displayName":"kilobits","long":{"other":{"symbol":["kilobits"],"pattern":"{0} {1}"},"one":{"symbol":["kilobit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kb"],"pattern":"{0}{1}"}}},"kilobyte":{"displayName":"kilobytes","long":{"other":{"symbol":["kilobytes"],"pattern":"{0} {1}"},"one":{"symbol":["kilobyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kB"],"pattern":"{0}{1}"}}},"megabit":{"displayName":"megabits","long":{"other":{"symbol":["megabits"],"pattern":"{0} {1}"},"one":{"symbol":["megabit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Mb"],"pattern":"{0}{1}"}}},"megabyte":{"displayName":"megabytes","long":{"other":{"symbol":["megabytes"],"pattern":"{0} {1}"},"one":{"symbol":["megabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["MB"],"pattern":"{0}{1}"}}},"petabyte":{"displayName":"petabytes","long":{"other":{"symbol":["petabytes"],"pattern":"{0} {1}"},"one":{"symbol":["petabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0}{1}"}}},"terabit":{"displayName":"terabits","long":{"other":{"symbol":["terabits"],"pattern":"{0} {1}"},"one":{"symbol":["terabit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Tb"],"pattern":"{0}{1}"}}},"terabyte":{"displayName":"terabytes","long":{"other":{"symbol":["terabytes"],"pattern":"{0} {1}"},"one":{"symbol":["terabyte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["TB"],"pattern":"{0}{1}"}}},"day":{"displayName":"days","long":{"other":{"symbol":["days"],"pattern":"{0} {1}"},"one":{"symbol":["day"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["days"],"pattern":"{0} {1}"},"one":{"symbol":["day"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["d"],"pattern":"{0}{1}"}}},"hour":{"displayName":"hours","long":{"other":{"symbol":["hours"],"pattern":"{0} {1}"},"one":{"symbol":["hour"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["hr"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["h"],"pattern":"{0}{1}"}}},"millisecond":{"displayName":"milliseconds","long":{"other":{"symbol":["milliseconds"],"pattern":"{0} {1}"},"one":{"symbol":["millisecond"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ms"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ms"],"pattern":"{0}{1}"}}},"minute":{"displayName":"minutes","long":{"other":{"symbol":["minutes"],"pattern":"{0} {1}"},"one":{"symbol":["minute"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["min"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"month":{"displayName":"months","long":{"other":{"symbol":["months"],"pattern":"{0} {1}"},"one":{"symbol":["month"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mths"],"pattern":"{0} {1}"},"one":{"symbol":["mth"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"second":{"displayName":"seconds","long":{"other":{"symbol":["seconds"],"pattern":"{0} {1}"},"one":{"symbol":["second"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["sec"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["s"],"pattern":"{0}{1}"}}},"week":{"displayName":"weeks","long":{"other":{"symbol":["weeks"],"pattern":"{0} {1}"},"one":{"symbol":["week"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["wks"],"pattern":"{0} {1}"},"one":{"symbol":["wk"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["w"],"pattern":"{0}{1}"}}},"year":{"displayName":"years","long":{"other":{"symbol":["years"],"pattern":"{0} {1}"},"one":{"symbol":["year"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["yrs"],"pattern":"{0} {1}"},"one":{"symbol":["yr"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["y"],"pattern":"{0}{1}"}}},"centimeter":{"displayName":"centimeters","long":{"other":{"symbol":["centimeters"],"pattern":"{0} {1}"},"one":{"symbol":["centimeter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["cm"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["cm"],"pattern":"{0}{1}"}}},"foot":{"displayName":"feet","long":{"other":{"symbol":["feet"],"pattern":"{0} {1}"},"one":{"symbol":["foot"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ft"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["′"],"pattern":"{0}{1}"}}},"inch":{"displayName":"inches","long":{"other":{"symbol":["inches"],"pattern":"{0} {1}"},"one":{"symbol":["inch"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["in"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["″"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"kilometers","long":{"other":{"symbol":["kilometers"],"pattern":"{0} {1}"},"one":{"symbol":["kilometer"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["km"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["km"],"pattern":"{0}{1}"}}},"meter":{"displayName":"meters","long":{"other":{"symbol":["meters"],"pattern":"{0} {1}"},"one":{"symbol":["meter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["m"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"mile-scandinavian","long":{"other":{"symbol":["miles-scandinavian"],"pattern":"{0} {1}"},"one":{"symbol":["mile-scandinavian"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["smi"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["smi"],"pattern":"{0}{1}"}}},"mile":{"displayName":"miles","long":{"other":{"symbol":["miles"],"pattern":"{0} {1}"},"one":{"symbol":["mile"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mi"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mi"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"millimeters","long":{"other":{"symbol":["millimeters"],"pattern":"{0} {1}"},"one":{"symbol":["millimeter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mm"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mm"],"pattern":"{0}{1}"}}},"yard":{"displayName":"yards","long":{"other":{"symbol":["yards"],"pattern":"{0} {1}"},"one":{"symbol":["yard"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["yd"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["yd"],"pattern":"{0}{1}"}}},"gram":{"displayName":"grams","long":{"other":{"symbol":["grams"],"pattern":"{0} {1}"},"one":{"symbol":["gram"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["g"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["g"],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"kilograms","long":{"other":{"symbol":["kilograms"],"pattern":"{0} {1}"},"one":{"symbol":["kilogram"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kg"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kg"],"pattern":"{0}{1}"}}},"ounce":{"displayName":"ounces","long":{"other":{"symbol":["ounces"],"pattern":"{0} {1}"},"one":{"symbol":["ounce"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["oz"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["oz"],"pattern":"{0}{1}"}}},"pound":{"displayName":"pounds","long":{"other":{"symbol":["pounds"],"pattern":"{0} {1}"},"one":{"symbol":["pound"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["lb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["#"],"pattern":"{0}{1}"}}},"stone":{"displayName":"stones","long":{"other":{"symbol":["stones"],"pattern":"{0} {1}"},"one":{"symbol":["stone"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0}{1}"}}},"celsius":{"displayName":"degrees Celsius","long":{"other":{"symbol":["degrees Celsius"],"pattern":"{0} {1}"},"one":{"symbol":["degree Celsius"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"degrees Fahrenheit","long":{"other":{"symbol":["degrees Fahrenheit"],"pattern":"{0} {1}"},"one":{"symbol":["degree Fahrenheit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"fluid ounces","long":{"other":{"symbol":["fluid ounces"],"pattern":"{0} {1}"},"one":{"symbol":["fluid ounce"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["fl oz"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["fl oz"],"pattern":"{0}{1}"}}},"gallon":{"displayName":"gallons","long":{"other":{"symbol":["gallons"],"pattern":"{0} {1}"},"one":{"symbol":["gallon"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["gal"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["gal"],"pattern":"{0}{1}"}}},"liter":{"displayName":"liters","long":{"other":{"symbol":["liters"],"pattern":"{0} {1}"},"one":{"symbol":["liter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["L"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["L"],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"milliliters","long":{"other":{"symbol":["milliliters"],"pattern":"{0} {1}"},"one":{"symbol":["milliliter"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mL"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mL"],"pattern":"{0}{1}"}}}},"currencies":{"ADP":{"displayName":{"other":"Andorran pesetas","one":"Andorran peseta"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"UAE dirhams","one":"UAE dirham"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"Afghan afghanis (1927–2002)","one":"Afghan afghani (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"Afghan Afghanis","one":"Afghan Afghani"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"Albanian lekë (1946–1965)","one":"Albanian lek (1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"Albanian lekë","one":"Albanian lek"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"Armenian drams","one":"Armenian dram"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"Netherlands Antillean guilders","one":"Netherlands Antillean guilder"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"Angolan kwanzas","one":"Angolan kwanza"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"Angolan kwanzas (1977–1991)","one":"Angolan kwanza (1977–1991)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"Angolan new kwanzas (1990–2000)","one":"Angolan new kwanza (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"Angolan readjusted kwanzas (1995–1999)","one":"Angolan readjusted kwanza (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"Argentine australs","one":"Argentine austral"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"Argentine pesos ley (1970–1983)","one":"Argentine peso ley (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"Argentine pesos (1881–1970)","one":"Argentine peso (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"Argentine pesos (1983–1985)","one":"Argentine peso (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"Argentine pesos","one":"Argentine peso"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"Austrian schillings","one":"Austrian schilling"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"Australian dollars","one":"Australian dollar"},"symbol":"A$","narrow":"$"},"AWG":{"displayName":{"other":"Aruban florin"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"Azerbaijani manats (1993–2006)","one":"Azerbaijani manat (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"Azerbaijani manats","one":"Azerbaijani manat"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"Bosnia-Herzegovina dinars (1992–1994)","one":"Bosnia-Herzegovina dinar (1992–1994)"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"Bosnia-Herzegovina convertible marks","one":"Bosnia-Herzegovina convertible mark"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"Bosnia-Herzegovina new dinars (1994–1997)","one":"Bosnia-Herzegovina new dinar (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"Barbadian dollars","one":"Barbadian dollar"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"Bangladeshi takas","one":"Bangladeshi taka"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"Belgian francs (convertible)","one":"Belgian franc (convertible)"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"Belgian francs","one":"Belgian franc"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"Belgian francs (financial)","one":"Belgian franc (financial)"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"Bulgarian hard leva","one":"Bulgarian hard lev"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"Bulgarian socialist leva","one":"Bulgarian socialist lev"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"Bulgarian leva","one":"Bulgarian lev"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"Bulgarian leva (1879–1952)","one":"Bulgarian lev (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"Bahraini dinars","one":"Bahraini dinar"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"Burundian francs","one":"Burundian franc"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"Bermudan dollars","one":"Bermudan dollar"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"Brunei dollars","one":"Brunei dollar"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"Bolivian bolivianos","one":"Bolivian boliviano"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"Bolivian bolivianos (1863–1963)","one":"Bolivian boliviano (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"Bolivian pesos","one":"Bolivian peso"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"Bolivian mvdols","one":"Bolivian mvdol"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"Brazilian new cruzeiros (1967–1986)","one":"Brazilian new cruzeiro (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"Brazilian cruzados (1986–1989)","one":"Brazilian cruzado (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"Brazilian cruzeiros (1990–1993)","one":"Brazilian cruzeiro (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"Brazilian reals","one":"Brazilian real"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"Brazilian new cruzados (1989–1990)","one":"Brazilian new cruzado (1989–1990)"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"Brazilian cruzeiros (1993–1994)","one":"Brazilian cruzeiro (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"Brazilian cruzeiros (1942–1967)","one":"Brazilian cruzeiro (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"Bahamian dollars","one":"Bahamian dollar"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"Bhutanese ngultrums","one":"Bhutanese ngultrum"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"Burmese kyats","one":"Burmese kyat"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"Botswanan pulas","one":"Botswanan pula"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"Belarusian rubles (1994–1999)","one":"Belarusian ruble (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"Belarusian rubles","one":"Belarusian ruble"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"Belarusian rubles (2000–2016)","one":"Belarusian ruble (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"Belize dollars","one":"Belize dollar"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"Canadian dollars","one":"Canadian dollar"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"Congolese francs","one":"Congolese franc"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"WIR euros","one":"WIR euro"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"Swiss francs","one":"Swiss franc"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"WIR francs","one":"WIR franc"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"Chilean escudos","one":"Chilean escudo"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"Chilean units of account (UF)","one":"Chilean unit of account (UF)"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"Chilean pesos","one":"Chilean peso"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"Chinese yuan (offshore)"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"Chinese People’s Bank dollars","one":"Chinese People’s Bank dollar"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"Chinese yuan"},"symbol":"CN¥","narrow":"¥"},"COP":{"displayName":{"other":"Colombian pesos","one":"Colombian peso"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"Colombian real value units","one":"Colombian real value unit"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"Costa Rican colóns","one":"Costa Rican colón"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"Serbian dinars (2002–2006)","one":"Serbian dinar (2002–2006)"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"Czechoslovak hard korunas","one":"Czechoslovak hard koruna"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"Cuban convertible pesos","one":"Cuban convertible peso"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"Cuban pesos","one":"Cuban peso"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"Cape Verdean escudos","one":"Cape Verdean escudo"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"Cypriot pounds","one":"Cypriot pound"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"Czech korunas","one":"Czech koruna"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"East German marks","one":"East German mark"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"German marks","one":"German mark"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"Djiboutian francs","one":"Djiboutian franc"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"Danish kroner","one":"Danish krone"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"Dominican pesos","one":"Dominican peso"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"Algerian dinars","one":"Algerian dinar"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"Ecuadorian sucres","one":"Ecuadorian sucre"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"Ecuadorian units of constant value","one":"Ecuadorian unit of constant value"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"Estonian kroons","one":"Estonian kroon"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"Egyptian pounds","one":"Egyptian pound"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"Eritrean nakfas","one":"Eritrean nakfa"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"Spanish pesetas (A account)","one":"Spanish peseta (A account)"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"Spanish pesetas (convertible account)","one":"Spanish peseta (convertible account)"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"Spanish pesetas","one":"Spanish peseta"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"Ethiopian birrs","one":"Ethiopian birr"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"euros","one":"euro"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"Finnish markkas","one":"Finnish markka"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"Fijian dollars","one":"Fijian dollar"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"Falkland Islands pounds","one":"Falkland Islands pound"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"French francs","one":"French franc"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"British pounds","one":"British pound"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"Georgian kupon larits","one":"Georgian kupon larit"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"Georgian laris","one":"Georgian lari"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"Ghanaian cedis (1979–2007)","one":"Ghanaian cedi (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"Ghanaian cedis","one":"Ghanaian cedi"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"Gibraltar pounds","one":"Gibraltar pound"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"Gambian dalasis","one":"Gambian dalasi"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"Guinean francs","one":"Guinean franc"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"Guinean sylis","one":"Guinean syli"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"Equatorial Guinean ekwele"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"Greek drachmas","one":"Greek drachma"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"Guatemalan quetzals","one":"Guatemalan quetzal"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"Portuguese Guinea escudos","one":"Portuguese Guinea escudo"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"Guinea-Bissau pesos","one":"Guinea-Bissau peso"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"Guyanaese dollars","one":"Guyanaese dollar"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"Hong Kong dollars","one":"Hong Kong dollar"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"Honduran lempiras","one":"Honduran lempira"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"Croatian dinars","one":"Croatian dinar"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"Croatian kunas","one":"Croatian kuna"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"Haitian gourdes","one":"Haitian gourde"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"Hungarian forints","one":"Hungarian forint"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"Indonesian rupiahs","one":"Indonesian rupiah"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"Irish pounds","one":"Irish pound"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"Israeli pounds","one":"Israeli pound"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"Israeli shekels (1980–1985)","one":"Israeli shekel (1980–1985)"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"Israeli new shekels","one":"Israeli new shekel"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"Indian rupees","one":"Indian rupee"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"Iraqi dinars","one":"Iraqi dinar"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"Iranian rials","one":"Iranian rial"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"Icelandic krónur (1918–1981)","one":"Icelandic króna (1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"Icelandic krónur","one":"Icelandic króna"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"Italian liras","one":"Italian lira"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"Jamaican dollars","one":"Jamaican dollar"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"Jordanian dinars","one":"Jordanian dinar"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"Japanese yen"},"symbol":"¥","narrow":"¥"},"KES":{"displayName":{"other":"Kenyan shillings","one":"Kenyan shilling"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"Kyrgystani soms","one":"Kyrgystani som"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"Cambodian riels","one":"Cambodian riel"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"Comorian francs","one":"Comorian franc"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"North Korean won"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"South Korean hwan (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"South Korean won (1945–1953)"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"South Korean won"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"Kuwaiti dinars","one":"Kuwaiti dinar"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"Cayman Islands dollars","one":"Cayman Islands dollar"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"Kazakhstani tenges","one":"Kazakhstani tenge"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"Laotian kips","one":"Laotian kip"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"Lebanese pounds","one":"Lebanese pound"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"Sri Lankan rupees","one":"Sri Lankan rupee"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"Liberian dollars","one":"Liberian dollar"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"Lesotho lotis","one":"Lesotho loti"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"Lithuanian litai","one":"Lithuanian litas"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"Lithuanian talonases","one":"Lithuanian talonas"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"Luxembourgian convertible francs","one":"Luxembourgian convertible franc"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"Luxembourgian francs","one":"Luxembourgian franc"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"Luxembourg financial francs","one":"Luxembourg financial franc"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"Latvian lati","one":"Latvian lats"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"Latvian rubles","one":"Latvian ruble"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"Libyan dinars","one":"Libyan dinar"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"Moroccan dirhams","one":"Moroccan dirham"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"Moroccan francs","one":"Moroccan franc"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"Monegasque francs","one":"Monegasque franc"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"Moldovan cupon"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"Moldovan lei","one":"Moldovan leu"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"Malagasy ariaries","one":"Malagasy ariary"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"Malagasy francs","one":"Malagasy franc"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"Macedonian denari","one":"Macedonian denar"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"Macedonian denari (1992–1993)","one":"Macedonian denar (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"Malian francs","one":"Malian franc"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"Myanmar kyats","one":"Myanmar kyat"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"Mongolian tugriks","one":"Mongolian tugrik"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"Macanese patacas","one":"Macanese pataca"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"Mauritanian ouguiyas (1973–2017)","one":"Mauritanian ouguiya (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"Mauritanian ouguiyas","one":"Mauritanian ouguiya"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"Maltese lira"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"Maltese pounds","one":"Maltese pound"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"Mauritian rupees","one":"Mauritian rupee"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"Maldivian rupees (1947–1981)","one":"Maldivian rupee (1947–1981)"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"Maldivian rufiyaas","one":"Maldivian rufiyaa"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"Malawian kwachas","one":"Malawian kwacha"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"Mexican pesos","one":"Mexican peso"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"Mexican silver pesos (1861–1992)","one":"Mexican silver peso (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"Mexican investment units","one":"Mexican investment unit"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"Malaysian ringgits","one":"Malaysian ringgit"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"Mozambican escudos","one":"Mozambican escudo"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"Mozambican meticals (1980–2006)","one":"Mozambican metical (1980–2006)"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"Mozambican meticals","one":"Mozambican metical"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"Namibian dollars","one":"Namibian dollar"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"Nigerian nairas","one":"Nigerian naira"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"Nicaraguan córdobas (1988–1991)","one":"Nicaraguan córdoba (1988–1991)"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"Nicaraguan córdobas","one":"Nicaraguan córdoba"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"Dutch guilders","one":"Dutch guilder"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"Norwegian kroner","one":"Norwegian krone"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"Nepalese rupees","one":"Nepalese rupee"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"New Zealand dollars","one":"New Zealand dollar"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"Omani rials","one":"Omani rial"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"Panamanian balboas","one":"Panamanian balboa"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"Peruvian intis","one":"Peruvian inti"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"Peruvian soles","one":"Peruvian sol"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"Peruvian soles (1863–1965)","one":"Peruvian sol (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"Papua New Guinean kina"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"Philippine pisos","one":"Philippine piso"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"Pakistani rupees","one":"Pakistani rupee"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"Polish zlotys","one":"Polish zloty"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"Polish zlotys (PLZ)","one":"Polish zloty (PLZ)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"Portuguese escudos","one":"Portuguese escudo"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"Paraguayan guaranis","one":"Paraguayan guarani"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"Qatari rials","one":"Qatari rial"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"Rhodesian dollars","one":"Rhodesian dollar"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"Romanian Lei (1952–2006)","one":"Romanian leu (1952–2006)"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"Romanian lei","one":"Romanian leu"},"symbol":"RON","narrow":"lei"},"RSD":{"displayName":{"other":"Serbian dinars","one":"Serbian dinar"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"Russian rubles","one":"Russian ruble"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"Russian rubles (1991–1998)","one":"Russian ruble (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"Rwandan francs","one":"Rwandan franc"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"Saudi riyals","one":"Saudi riyal"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"Solomon Islands dollars","one":"Solomon Islands dollar"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"Seychellois rupees","one":"Seychellois rupee"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"Sudanese dinars (1992–2007)","one":"Sudanese dinar (1992–2007)"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"Sudanese pounds","one":"Sudanese pound"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"Sudanese pounds (1957–1998)","one":"Sudanese pound (1957–1998)"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"Swedish kronor","one":"Swedish krona"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"Singapore dollars","one":"Singapore dollar"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"St. Helena pounds","one":"St. Helena pound"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"Slovenian tolars","one":"Slovenian tolar"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"Slovak korunas","one":"Slovak koruna"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"Sierra Leonean leones","one":"Sierra Leonean leone"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"Somali shillings","one":"Somali shilling"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"Surinamese dollars","one":"Surinamese dollar"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"Surinamese guilders","one":"Surinamese guilder"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"South Sudanese pounds","one":"South Sudanese pound"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"São Tomé & Príncipe dobras (1977–2017)","one":"São Tomé & Príncipe dobra (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"São Tomé & Príncipe dobras","one":"São Tomé & Príncipe dobra"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"Soviet roubles","one":"Soviet rouble"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"Salvadoran colones","one":"Salvadoran colón"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"Syrian pounds","one":"Syrian pound"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"Swazi emalangeni","one":"Swazi lilangeni"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"Thai baht"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"Tajikistani rubles","one":"Tajikistani ruble"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"Tajikistani somonis","one":"Tajikistani somoni"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"Turkmenistani manat (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"Turkmenistani manat"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"Tunisian dinars","one":"Tunisian dinar"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"Tongan paʻanga"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"Timorese escudos","one":"Timorese escudo"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"Turkish Lira (1922–2005)","one":"Turkish lira (1922–2005)"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"Turkish Lira","one":"Turkish lira"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"Trinidad & Tobago dollars","one":"Trinidad & Tobago dollar"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"New Taiwan dollars","one":"New Taiwan dollar"},"symbol":"NT$","narrow":"$"},"TZS":{"displayName":{"other":"Tanzanian shillings","one":"Tanzanian shilling"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"Ukrainian hryvnias","one":"Ukrainian hryvnia"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"Ukrainian karbovantsiv","one":"Ukrainian karbovanets"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"Ugandan shillings (1966–1987)","one":"Ugandan shilling (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"Ugandan shillings","one":"Ugandan shilling"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"US dollars","one":"US dollar"},"symbol":"$","narrow":"$"},"USN":{"displayName":{"other":"US dollars (next day)","one":"US dollar (next day)"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"US dollars (same day)","one":"US dollar (same day)"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"Uruguayan pesos (indexed units)","one":"Uruguayan peso (indexed units)"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"Uruguayan pesos (1975–1993)","one":"Uruguayan peso (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"Uruguayan pesos","one":"Uruguayan peso"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"Uruguayan nominal wage index units","one":"Uruguayan nominal wage index unit"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"Uzbekistani som"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"Venezuelan bolívars (1871–2008)","one":"Venezuelan bolívar (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"Venezuelan bolívars (2008–2018)","one":"Venezuelan bolívar (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"Venezuelan bolívars","one":"Venezuelan bolívar"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"Vietnamese dong"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"Vietnamese dong (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"Vanuatu vatus","one":"Vanuatu vatu"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"Samoan tala"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"Central African CFA francs","one":"Central African CFA franc"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"troy ounces of silver","one":"troy ounce of silver"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"troy ounces of gold","one":"troy ounce of gold"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"European composite units","one":"European composite unit"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"European monetary units","one":"European monetary unit"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"European units of account (XBC)","one":"European unit of account (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"European units of account (XBD)","one":"European unit of account (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"East Caribbean dollars","one":"East Caribbean dollar"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"special drawing rights"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"European currency units","one":"European currency unit"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"French gold francs","one":"French gold franc"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"French UIC-francs","one":"French UIC-franc"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"West African CFA francs","one":"West African CFA franc"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"troy ounces of palladium","one":"troy ounce of palladium"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"CFP francs","one":"CFP franc"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"troy ounces of platinum","one":"troy ounce of platinum"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET Funds units","one":"RINET Funds unit"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"Sucres","one":"Sucre"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"Testing Currency units","one":"Testing Currency unit"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"ADB units of account","one":"ADB unit of account"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"(unknown currency)","one":"(unknown unit of currency)"},"symbol":"¤","narrow":"¤"},"YDD":{"displayName":{"other":"Yemeni dinars","one":"Yemeni dinar"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"Yemeni rials","one":"Yemeni rial"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"Yugoslavian hard dinars (1966–1990)","one":"Yugoslavian hard dinar (1966–1990)"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"Yugoslavian new dinars (1994–2002)","one":"Yugoslavian new dinar (1994–2002)"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"Yugoslavian convertible dinars (1990–1992)","one":"Yugoslavian convertible dinar (1990–1992)"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"Yugoslavian reformed dinars (1992–1993)","one":"Yugoslavian reformed dinar (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"South African rands (financial)","one":"South African rand (financial)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"South African rand"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"Zambian kwachas (1968–2012)","one":"Zambian kwacha (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"Zambian kwachas","one":"Zambian kwacha"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"Zairean new zaires (1993–1998)","one":"Zairean new zaire (1993–1998)"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"Zairean zaires (1971–1993)","one":"Zairean zaire (1971–1993)"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"Zimbabwean dollars (1980–2008)","one":"Zimbabwean dollar (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"Zimbabwean dollars (2009)","one":"Zimbabwean dollar (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"Zimbabwean dollars (2008)","one":"Zimbabwean dollar (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0 thousand"},"10000":{"other":"00 thousand"},"100000":{"other":"000 thousand"},"1000000":{"other":"0 million"},"10000000":{"other":"00 million"},"100000000":{"other":"000 million"},"1000000000":{"other":"0 billion"},"10000000000":{"other":"00 billion"},"100000000000":{"other":"000 billion"},"1000000000000":{"other":"0 trillion"},"10000000000000":{"other":"00 trillion"},"100000000000000":{"other":"000 trillion"}},"short":{"1000":{"other":"0K"},"10000":{"other":"00K"},"100000":{"other":"000K"},"1000000":{"other":"0M"},"10000000":{"other":"00M"},"100000000":{"other":"000M"},"1000000000":{"other":"0B"},"10000000000":{"other":"00B"},"100000000000":{"other":"000B"},"1000000000000":{"other":"0T"},"10000000000000":{"other":"00T"},"100000000000000":{"other":"000T"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0} {1}","short":{"1000":{"other":"¤0K"},"10000":{"other":"¤00K"},"100000":{"other":"¤000K"},"1000000":{"other":"¤0M"},"10000000":{"other":"¤00M"},"100000000":{"other":"¤000M"},"1000000000":{"other":"¤0B"},"10000000000":{"other":"¤00B"},"100000000000":{"other":"¤000B"},"1000000000000":{"other":"¤0T"},"10000000000000":{"other":"¤00T"},"100000000000000":{"other":"¤000T"}}}}},"nu":["latn"]}},"availableLocales":["en"],"aliases":{},"parentLocales":{"en-150":"en-001","en-AG":"en-001","en-AI":"en-001","en-AU":"en-001","en-BB":"en-001","en-BM":"en-001","en-BS":"en-001","en-BW":"en-001","en-BZ":"en-001","en-CA":"en-001","en-CC":"en-001","en-CK":"en-001","en-CM":"en-001","en-CX":"en-001","en-CY":"en-001","en-DG":"en-001","en-DM":"en-001","en-ER":"en-001","en-FJ":"en-001","en-FK":"en-001","en-FM":"en-001","en-GB":"en-001","en-GD":"en-001","en-GG":"en-001","en-GH":"en-001","en-GI":"en-001","en-GM":"en-001","en-GY":"en-001","en-HK":"en-001","en-IE":"en-001","en-IL":"en-001","en-IM":"en-001","en-IN":"en-001","en-IO":"en-001","en-JE":"en-001","en-JM":"en-001","en-KE":"en-001","en-KI":"en-001","en-KN":"en-001","en-KY":"en-001","en-LC":"en-001","en-LR":"en-001","en-LS":"en-001","en-MG":"en-001","en-MO":"en-001","en-MS":"en-001","en-MT":"en-001","en-MU":"en-001","en-MW":"en-001","en-MY":"en-001","en-NA":"en-001","en-NF":"en-001","en-NG":"en-001","en-NR":"en-001","en-NU":"en-001","en-NZ":"en-001","en-PG":"en-001","en-PH":"en-001","en-PK":"en-001","en-PN":"en-001","en-PW":"en-001","en-RW":"en-001","en-SB":"en-001","en-SC":"en-001","en-SD":"en-001","en-SG":"en-001","en-SH":"en-001","en-SL":"en-001","en-SS":"en-001","en-SX":"en-001","en-SZ":"en-001","en-TC":"en-001","en-TK":"en-001","en-TO":"en-001","en-TT":"en-001","en-TV":"en-001","en-TZ":"en-001","en-UG":"en-001","en-VC":"en-001","en-VG":"en-001","en-VU":"en-001","en-WS":"en-001","en-ZA":"en-001","en-ZM":"en-001","en-ZW":"en-001","en-AT":"en-150","en-BE":"en-150","en-CH":"en-150","en-DE":"en-150","en-DK":"en-150","en-FI":"en-150","en-NL":"en-150","en-SE":"en-150","en-SI":"en-150"}},
    {"data":{"ja":{"units":{"degree":{"displayName":"度","long":{"other":{"symbol":["度"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["度"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["度"],"pattern":"{0} {1}"}}},"acre":{"displayName":"エーカー","long":{"other":{"symbol":["エーカー"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ac"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ac"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"ヘクタール","long":{"other":{"symbol":["ヘクタール"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ha"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ha"],"pattern":"{0}{1}"}}},"percent":{"displayName":"パーセント","long":{"other":{"symbol":["パーセント"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"ビット","long":{"other":{"symbol":["ビット"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["bit"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["b"],"pattern":"{0}{1}"}}},"byte":{"displayName":"バイト","long":{"other":{"symbol":["バイト"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["byte"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["B"],"pattern":"{0}{1}"}}},"gigabit":{"displayName":"ギガビット","long":{"other":{"symbol":["ギガビット"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Gb"],"pattern":"{0}{1}"}}},"gigabyte":{"displayName":"ギガバイト","long":{"other":{"symbol":["ギガバイト"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["GB"],"pattern":"{0}{1}"}}},"kilobit":{"displayName":"キロビット","long":{"other":{"symbol":["キロビット"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kb"],"pattern":"{0}{1}"}}},"kilobyte":{"displayName":"キロバイト","long":{"other":{"symbol":["キロバイト"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["KB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kB"],"pattern":"{0}{1}"}}},"megabit":{"displayName":"メガビット","long":{"other":{"symbol":["メガビット"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Mb"],"pattern":"{0}{1}"}}},"megabyte":{"displayName":"メガバイト","long":{"other":{"symbol":["メガバイト"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["MB"],"pattern":"{0}{1}"}}},"petabyte":{"displayName":"ペタバイト","long":{"other":{"symbol":["ペタバイト"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"テラビット","long":{"other":{"symbol":["テラビット"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Tb"],"pattern":"{0}{1}"}}},"terabyte":{"displayName":"テラバイト","long":{"other":{"symbol":["テラバイト"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["TB"],"pattern":"{0}{1}"}}},"day":{"displayName":"日","long":{"other":{"symbol":["日"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["日"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["d"],"pattern":"{0}{1}"}}},"hour":{"displayName":"時間","long":{"other":{"symbol":["時間"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["時間"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["h"],"pattern":"{0}{1}"}}},"millisecond":{"displayName":"ミリ秒","long":{"other":{"symbol":["ミリ秒"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ms"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ms"],"pattern":"{0}{1}"}}},"minute":{"displayName":"分","long":{"other":{"symbol":["分"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["分"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"month":{"displayName":"か月","long":{"other":{"symbol":["か月"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["か月"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"second":{"displayName":"秒","long":{"other":{"symbol":["秒"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["秒"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["s"],"pattern":"{0}{1}"}}},"week":{"displayName":"週間","long":{"other":{"symbol":["週間"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["週間"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["w"],"pattern":"{0}{1}"}}},"year":{"displayName":"年","long":{"other":{"symbol":["年"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["年"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["y"],"pattern":"{0}{1}"}}},"centimeter":{"displayName":"センチメートル","long":{"other":{"symbol":["センチメートル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["cm"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["cm"],"pattern":"{0}{1}"}}},"foot":{"displayName":"フィート","long":{"other":{"symbol":["フィート"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ft"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["′"],"pattern":"{0}{1}"}}},"inch":{"displayName":"インチ","long":{"other":{"symbol":["インチ"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["in"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["″"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"キロメートル","long":{"other":{"symbol":["キロメートル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["km"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["km"],"pattern":"{0}{1}"}}},"meter":{"displayName":"メートル","long":{"other":{"symbol":["メートル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["m"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"スカンジナビアマイル","long":{"other":{"symbol":["スカンジナビアマイル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["smi"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["smi"],"pattern":"{0} {1}"}}},"mile":{"displayName":"マイル","long":{"other":{"symbol":["マイル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mi"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["マイル"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"ミリメートル","long":{"other":{"symbol":["ミリメートル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["mm"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mm"],"pattern":"{0}{1}"}}},"yard":{"displayName":"ヤード","long":{"other":{"symbol":["ヤード"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["yd"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ヤード"],"pattern":"{0}{1}"}}},"gram":{"displayName":"グラム","long":{"other":{"symbol":["グラム"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["g"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["g"],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"キログラム","long":{"other":{"symbol":["キログラム"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kg"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kg"],"pattern":"{0}{1}"}}},"ounce":{"displayName":"オンス","long":{"other":{"symbol":["オンス"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["oz"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["oz"],"pattern":"{0}{1}"}}},"pound":{"displayName":"ポンド","long":{"other":{"symbol":["ポンド"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["lb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["lb"],"pattern":"{0}{1}"}}},"stone":{"displayName":"ストーン","long":{"other":{"symbol":["ストーン"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0}{1}"}}},"celsius":{"displayName":"摂氏","long":{"other":{"symbol":["摂氏","度"],"pattern":"{1} {0} {1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"華氏","long":{"other":{"symbol":["華氏","度"],"pattern":"{1} {0} {1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"液量オンス","long":{"other":{"symbol":["液量オンス"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["fl oz"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["fl oz"],"pattern":"{0}{1}"}}},"gallon":{"displayName":"ガロン","long":{"other":{"symbol":["ガロン"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["gal"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["gal"],"pattern":"{0}{1}"}}},"liter":{"displayName":"リットル","long":{"other":{"symbol":["リットル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["L"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["L"],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"ミリリットル","long":{"other":{"symbol":["ミリリットル"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ml"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ml"],"pattern":"{0}{1}"}}}},"currencies":{"ADP":{"displayName":{"other":"アンドラ ペセタ"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"UAE ディルハム"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"アフガニスタン アフガニー (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"アフガニスタン アフガニー"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"アルバニア レク (1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"アルバニア レク"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"アルメニア ドラム"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"オランダ領アンティル ギルダー"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"アンゴラ クワンザ"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"アンゴラ クワンザ (1977–1991)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"アンゴラ 新クワンザ (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"アンゴラ 旧クワンザ (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"アルゼンチン アゥストラール"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"アルゼンチン・ペソ・レイ（1970–1983）"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"アルゼンチン・ペソ（1881–1970）"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"アルゼンチン ペソ (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"アルゼンチン ペソ"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"オーストリア シリング"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"オーストラリア ドル"},"symbol":"A$","narrow":"$"},"AWG":{"displayName":{"other":"アルバ ギルダー"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"アゼルバイジャン マナト (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"アゼルバイジャン マナト"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"ボスニア・ヘルツェゴビナ ディナール (1992–1994)"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"ボスニア・ヘルツェゴビナ 兌換マルク (BAM)"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"ボスニア・ヘルツェゴビナ 新ディナール（1994–1997）"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"バルバドス ドル"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"バングラデシュ タカ"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"ベルギー フラン (BEC)"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"ベルギー フラン"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"ベルギー フラン (BEL)"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"ブルガリア レフ"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"ブルガリア社会主義 レフ"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"ブルガリア 新レフ"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"ブルガリア レフ（1879–1952）"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"バーレーン ディナール"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"ブルンジ フラン"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"バミューダ ドル"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"ブルネイ ドル"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"ボリビア ボリビアーノ"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"ボリビア ボリビアーノ (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"ボリビア ペソ"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"ボリビア (Mvdol)"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"ブラジル 新クルゼイロ (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"ブラジル クルザード (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"ブラジル クルゼイロ (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"ブラジル レアル"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"ブラジル 新クルザード (1989–1990)"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"ブラジル クルゼイロ (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"ブラジル クルゼイロ（1942–1967）"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"バハマ ドル"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"ブータン ニュルタム"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"ビルマ チャット"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"ボツワナ プラ"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"ベラルーシ 新ルーブル (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"ベラルーシ ルーブル"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"ベラルーシ ルーブル (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"ベリーズ ドル"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"カナダ ドル"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"コンゴ フラン"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"ユーロ (WIR)"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"スイス フラン"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"フラン (WIR)"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"チリ エスクード"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"チリ ウニダ・デ・フォメント (UF)"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"チリ ペソ"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"中国人民元(オフショア)"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"中国人民銀行ドル"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"中国人民元"},"symbol":"元","narrow":"￥"},"COP":{"displayName":{"other":"コロンビア ペソ"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"コロンビア レアル （UVR)"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"コスタリカ コロン"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"セルビア ディナール (2002–2006)"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"チェコスロバキア コルナ"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"キューバ 兌換ペソ"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"キューバ ペソ"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"カーボベルデ エスクード"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"キプロス ポンド"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"チェコ コルナ"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"東ドイツ マルク"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"ドイツ マルク"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"ジブチ フラン"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"デンマーク クローネ"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"ドミニカ ペソ"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"アルジェリア ディナール"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"エクアドル スクレ"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"エクアドル (UVC)"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"エストニア クルーン"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"エジプト ポンド"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"エリトリア ナクファ"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"スペインペセタ（勘定A）"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"スペイン 兌換ペセタ"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"スペイン ペセタ"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"エチオピア ブル"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"ユーロ"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"フィンランド マルカ"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"フィジー ドル"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"フォークランド（マルビナス）諸島 ポンド"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"フランス フラン"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"英国ポンド"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"ジョージア クーポン ラリ"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"ジョージア ラリ"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"ガーナ セディ (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"ガーナ セディ"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"ジブラルタル ポンド"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"ガンビア ダラシ"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"ギニア フラン"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"ギニア シリー"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"赤道ギニア エクウェレ"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"ギリシャ ドラクマ"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"グアテマラ ケツァル"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"ポルトガル領ギニア エスクード"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"ギニアビサウ ペソ"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"ガイアナ ドル"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"香港ドル"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"ホンジュラス レンピラ"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"クロアチア ディナール"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"クロアチア クーナ"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"ハイチ グールド"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"ハンガリー フォリント"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"インドネシア ルピア"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"アイリッシュ ポンド"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"イスラエル ポンド"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"イスラエル シェケル (1980–1985)"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"イスラエル新シェケル"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"インド ルピー"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"イラク ディナール"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"イラン リアル"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"アイスランド クローナ (1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"アイスランド クローナ"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"イタリア リラ"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"ジャマイカ ドル"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"ヨルダン ディナール"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"円"},"symbol":"￥","narrow":"￥"},"KES":{"displayName":{"other":"ケニア シリング"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"キルギス ソム"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"カンボジア リエル"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"コモロ フラン"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"北朝鮮ウォン"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"韓国 ファン（1953–1962）"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"韓国 ウォン（1945–1953）"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"韓国ウォン"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"クウェート ディナール"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"ケイマン諸島 ドル"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"カザフスタン テンゲ"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"ラオス キープ"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"レバノン ポンド"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"スリランカ ルピー"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"リベリア ドル"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"レソト ロティ"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"リトアニア リタス"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"リトアニア タロナ"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"ルクセンブルク 兌換フラン"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"ルクセンブルグ フラン"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"ルクセンブルク 金融フラン"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"ラトビア ラッツ"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"ラトビア ルーブル"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"リビア ディナール"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"モロッコ ディルハム"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"モロッコ フラン"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"モネガスク フラン"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"モルドバ クーポン"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"モルドバ レイ"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"マダガスカル アリアリ"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"マラガシ フラン"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"マケドニア デナル"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"マケドニア ディナール（1992–1993）"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"マリ フラン"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"ミャンマー チャット"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"モンゴル トグログ"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"マカオ パタカ"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"モーリタニア ウギア (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"モーリタニア ウギア"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"マルタ リラ"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"マルタ ポンド"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"モーリシャス ルピー"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"モルディブ諸島 ルピー"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"モルディブ ルフィア"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"マラウィ クワチャ"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"メキシコ ペソ"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"メキシコ ペソ (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"メキシコ (UDI)"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"マレーシア リンギット"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"モザンピーク エスクード"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"モザンビーク メティカル (1980–2006)"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"モザンビーク メティカル"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"ナミビア ドル"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"ナイジェリア ナイラ"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"ニカラグア コルドバ (1988–1991)"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"ニカラグア コルドバ オロ"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"オランダ ギルダー"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"ノルウェー クローネ"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"ネパール ルピー"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"ニュージーランド ドル"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"オマーン リアル"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"パナマ バルボア"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"ペルー インティ"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"ペルー ソル"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"ペルー ソル (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"パプアニューギニア キナ"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"フィリピン ペソ"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"パキスタン ルピー"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"ポーランド ズウォティ"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"ポーランド ズウォティ (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"ポルトガル エスクード"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"パラグアイ グアラニ"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"カタール リアル"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"ローデシア ドル"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"ルーマニア レイ (1952–2006)"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"ルーマニア レイ"},"symbol":"RON","narrow":"レイ"},"RSD":{"displayName":{"other":"ディナール (セルビア)"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"ロシア ルーブル"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"ロシア ルーブル (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"ルワンダ フラン"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"サウジ リヤル"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"ソロモン諸島 ドル"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"セーシェル ルピー"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"スーダン ディナール (1992–2007)"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"スーダン ポンド"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"スーダン ポンド (1957–1998)"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"スウェーデン クローナ"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"シンガポール ドル"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"セントヘレナ ポンド"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"スロベニア トラール"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"スロバキア コルナ"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"シエラレオネ レオン"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"ソマリア シリング"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"スリナム ドル"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"スリナム ギルダー"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"南スーダン ポンド"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"サントメ・プリンシペ ドブラ (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"サントメ・プリンシペ ドブラ"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"ソ連 ルーブル"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"エルサルバドル コロン"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"シリア ポンド"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"スワジランド リランゲニ"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"タイ バーツ"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"タジキスタン ルーブル"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"タジキスタン ソモニ"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"トルクメニスタン マナト (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"トルクメニスタン マナト"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"チュニジア ディナール"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"トンガ パ・アンガ"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"ティモール エスクード"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"トルコ リラ (1922–2005)"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"新トルコリラ"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"トリニダード・トバゴ ドル"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"新台湾ドル"},"symbol":"NT$","narrow":"$"},"TZS":{"displayName":{"other":"タンザニア シリング"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"ウクライナ グリブナ"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"ウクライナ カルボバネツ"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"ウガンダ シリング (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"ウガンダ シリング"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"米ドル"},"symbol":"$","narrow":"$"},"USN":{"displayName":{"other":"米ドル (翌日)"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"米ドル (当日)"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"ウルグアイ ペソエン"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"ウルグアイ ペソ (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"ウルグアイ ペソ"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"UYW"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"ウズベキスタン スム"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"ベネズエラ ボリバル (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"ベネズエラ ボリバル (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"ベネズエラ ボリバル"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"ベトナム ドン"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"ベトナム ドン（1978–1985）"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"バヌアツ バツ"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"サモア タラ"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"中央アフリカ CFA フラン"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"銀"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"金"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"ヨーロッパ混合単位 (EURCO)"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"ヨーロッパ通貨単位 (EMU–6)"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"ヨーロッパ勘定単位 (EUA–9)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"ヨーロッパ勘定単位 (EUA–17)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"東カリブ ドル"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"特別引き出し権"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"ヨーロッパ通貨単位"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"フランス金フラン"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"フランス フラン (UIC)"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"西アフリカ CFA フラン"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"パラジウム"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"CFP フラン"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"プラチナ"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET基金"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"スクレ"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"テスト用通貨コード"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"UA (アフリカ開発銀行)"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"不明または無効な通貨"},"symbol":"XXX","narrow":"XXX"},"YDD":{"displayName":{"other":"イエメン ディナール"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"イエメン リアル"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"ユーゴスラビア ハード・ディナール (1966–1990)"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"ユーゴスラビア ノビ・ディナール (1994–2002)"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"ユーゴスラビア 兌換ディナール (1990–1992)"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"ユーゴスラビア 改革ディナール（1992–1993）"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"南アフリカ ランド (ZAL)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"南アフリカ ランド"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"ザンビア クワチャ (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"ザンビア クワチャ"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"ザイール 新ザイール (1993–1998)"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"ザイール ザイール (1971–1993)"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"ジンバブエ ドル (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"ジンバブエ ドル (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"シンバブエ ドル（2008）"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}},"short":{"1000":{"other":"0"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0}{1}","short":{"1000":{"other":"0"},"10000":{"other":"¤0万"},"100000":{"other":"¤00万"},"1000000":{"other":"¤000万"},"10000000":{"other":"¤0000万"},"100000000":{"other":"¤0億"},"1000000000":{"other":"¤00億"},"10000000000":{"other":"¤000億"},"100000000000":{"other":"¤0000億"},"1000000000000":{"other":"¤0兆"},"10000000000000":{"other":"¤00兆"},"100000000000000":{"other":"¤000兆"}}}}},"nu":["latn"]}},"availableLocales":["ja"],"aliases":{},"parentLocales":{}},
    {"data":{"ko":{"units":{"degree":{"displayName":"도","long":{"other":{"symbol":["도"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"acre":{"displayName":"에이커","long":{"other":{"symbol":["에이커"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["ac"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ac"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"헥타르","long":{"other":{"symbol":["헥타르"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["ha"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ha"],"pattern":"{0}{1}"}}},"percent":{"displayName":"%","long":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"비트","long":{"other":{"symbol":["비트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["bit"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["bit"],"pattern":"{0}{1}"}}},"byte":{"displayName":"바이트","long":{"other":{"symbol":["바이트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["byte"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["byte"],"pattern":"{0}{1}"}}},"gigabit":{"displayName":"기가비트","long":{"other":{"symbol":["기가비트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["Gb"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["Gb"],"pattern":"{0}{1}"}}},"gigabyte":{"displayName":"기가바이트","long":{"other":{"symbol":["기가바이트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["GB"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["GB"],"pattern":"{0}{1}"}}},"kilobit":{"displayName":"킬로비트","long":{"other":{"symbol":["킬로비트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["kb"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["kb"],"pattern":"{0}{1}"}}},"kilobyte":{"displayName":"킬로바이트","long":{"other":{"symbol":["킬로바이트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["kB"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["kB"],"pattern":"{0}{1}"}}},"megabit":{"displayName":"메가비트","long":{"other":{"symbol":["메가비트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["Mb"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["Mb"],"pattern":"{0}{1}"}}},"megabyte":{"displayName":"메가바이트","long":{"other":{"symbol":["메가바이트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["MB"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["MB"],"pattern":"{0}{1}"}}},"petabyte":{"displayName":"페타바이트","long":{"other":{"symbol":["페타바이트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0}{1}"}}},"terabit":{"displayName":"테라비트","long":{"other":{"symbol":["테라비트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["Tb"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["Tb"],"pattern":"{0}{1}"}}},"terabyte":{"displayName":"테라바이트","long":{"other":{"symbol":["테라바이트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["TB"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["TB"],"pattern":"{0}{1}"}}},"day":{"displayName":"일","long":{"other":{"symbol":["일"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["일"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["일"],"pattern":"{0}{1}"}}},"hour":{"displayName":"시간","long":{"other":{"symbol":["시간"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["시간"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["시간"],"pattern":"{0}{1}"}}},"millisecond":{"displayName":"밀리초","long":{"other":{"symbol":["밀리초"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["ms"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ms"],"pattern":"{0}{1}"}}},"minute":{"displayName":"분","long":{"other":{"symbol":["분"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["분"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["분"],"pattern":"{0}{1}"}}},"month":{"displayName":"개월","long":{"other":{"symbol":["개월"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["개월"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["개월"],"pattern":"{0}{1}"}}},"second":{"displayName":"초","long":{"other":{"symbol":["초"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["초"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["초"],"pattern":"{0}{1}"}}},"week":{"displayName":"주","long":{"other":{"symbol":["주"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["주"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["주"],"pattern":"{0}{1}"}}},"year":{"displayName":"년","long":{"other":{"symbol":["년"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["년"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["년"],"pattern":"{0}{1}"}}},"centimeter":{"displayName":"센티미터","long":{"other":{"symbol":["센티미터"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["cm"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["cm"],"pattern":"{0}{1}"}}},"foot":{"displayName":"피트","long":{"other":{"symbol":["피트"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["ft"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["′"],"pattern":"{0}{1}"}}},"inch":{"displayName":"인치","long":{"other":{"symbol":["인치"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["in"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["″"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"킬로미터","long":{"other":{"symbol":["킬로미터"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["km"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["km"],"pattern":"{0}{1}"}}},"meter":{"displayName":"미터","long":{"other":{"symbol":["미터"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["m"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["m"],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"스칸디나비아 마일","long":{"other":{"symbol":["스칸디나비아 마일"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["smi"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["smi"],"pattern":"{0}{1}"}}},"mile":{"displayName":"마일","long":{"other":{"symbol":["마일"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["mi"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["mi"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"밀리미터","long":{"other":{"symbol":["밀리미터"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["mm"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["mm"],"pattern":"{0}{1}"}}},"yard":{"displayName":"야드","long":{"other":{"symbol":["야드"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["야드"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["yd"],"pattern":"{0}{1}"}}},"gram":{"displayName":"그램","long":{"other":{"symbol":["그램"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["g"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["g"],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"킬로그램","long":{"other":{"symbol":["킬로그램"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["kg"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["kg"],"pattern":"{0}{1}"}}},"ounce":{"displayName":"온스","long":{"other":{"symbol":["온스"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["oz"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["oz"],"pattern":"{0}{1}"}}},"pound":{"displayName":"파운드","long":{"other":{"symbol":["파운드"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["lb"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["lb"],"pattern":"{0}{1}"}}},"stone":{"displayName":"스톤","long":{"other":{"symbol":["스톤"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["st"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0}{1}"}}},"celsius":{"displayName":"섭씨","long":{"other":{"symbol":["섭씨","도"],"pattern":"{1} {0}{1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"화씨","long":{"other":{"symbol":["화씨","도"],"pattern":"{1} {0}{1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"액량 온스","long":{"other":{"symbol":["액량 온스"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["fl oz"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["fl oz"],"pattern":"{0}{1}"}}},"gallon":{"displayName":"갤런","long":{"other":{"symbol":["갤런"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["gal"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["gal"],"pattern":"{0}{1}"}}},"liter":{"displayName":"리터","long":{"other":{"symbol":["리터"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["L"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ℓ"],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"밀리리터","long":{"other":{"symbol":["밀리리터"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["mL"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["mL"],"pattern":"{0}{1}"}}}},"currencies":{"ADP":{"displayName":{"other":"안도라 페세타"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"아랍에미리트 디르함"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"아프가니 (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"아프가니스탄 아프가니"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"ALK"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"알바니아 레크"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"아르메니아 드람"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"네덜란드령 안틸레스 길더"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"앙골라 콴자"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"앙골라 콴자 (1977–1990)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"앙골라 신콴자 (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"앙골라 재조정 콴자 (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"아르헨티나 오스트랄"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"아르헨티나 페소 레이 (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"아르헨티나 페소 (18810–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"아르헨티나 페소 (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"아르헨티나 페소"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"호주 실링"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"호주 달러"},"symbol":"AU$","narrow":"$"},"AWG":{"displayName":{"other":"아루바 플로린"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"아제르바이젠 마나트(1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"아제르바이잔 마나트"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"보스니아-헤르체고비나 디나르"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"보스니아-헤르체고비나 태환 마르크"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"보스니아-헤르체고비나 신디나르 (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"바베이도스 달러"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"방글라데시 타카"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"벨기에 프랑 (태환)"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"벨기에 프랑"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"벨기에 프랑 (금융)"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"불가리아 동전 렛"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"불가리아 사회주의자 렛"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"불가리아 레프"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"불가리아 렛 (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"바레인 디나르"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"부룬디 프랑"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"버뮤다 달러"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"부루나이 달러"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"볼리비아노"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"볼리비아 볼리비아노 (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"볼리비아노 페소"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"볼리비아노 Mvdol(기금)"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"볼리비아노 크루제이루 노보 (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"브라질 크루자두"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"브라질 크루제이루 (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"브라질 헤알"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"브라질 크루자두 노보"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"브라질 크루제이루"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"브라질 크루제이루 (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"바하마 달러"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"부탄 눌투눔"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"버마 차트"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"보츠와나 폴라"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"벨라루스 신권 루블 (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"벨라루스 루블"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"벨라루스 루블 (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"벨리즈 달러"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"캐나다 달러"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"콩고 프랑 콩골라스"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"유로 (WIR)"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"스위스 프랑"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"프랑 (WIR)"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"칠레 에스쿠도"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"칠레 (UF)"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"칠레 페소"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"중국 위안화(역외)"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"CNX"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"중국 위안화"},"symbol":"CN¥","narrow":"¥"},"COP":{"displayName":{"other":"콜롬비아 페소"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"콜롬비아 실가 단위"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"코스타리카 콜론"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"고 세르비아 디나르"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"체코슬로바키아 동전 코루나"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"쿠바 태환 페소"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"쿠바 페소"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"카보베르데 에스쿠도"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"싸이프러스 파운드"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"체코 공화국 코루나"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"동독 오스트마르크"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"독일 마르크"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"지부티 프랑"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"덴마크 크로네"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"도미니카 페소"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"알제리 디나르"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"에쿠아도르 수크레"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"에콰도르 (UVC)"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"에스토니아 크룬"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"이집트 파운드"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"에리트리아 나크파"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"스페인 페세타(예금)"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"스페인 페세타(변환 예금)"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"스페인 페세타"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"에티오피아 비르"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"유로"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"핀란드 마르카"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"피지 달러"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"포클랜드제도 파운드"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"프랑스 프랑"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"영국령 파운드 스털링"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"그루지야 지폐 라리트"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"조지아 라리"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"가나 시디 (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"가나 시디"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"지브롤터 파운드"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"감비아 달라시"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"기니 프랑"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"기니 시리"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"적도 기니 에쿨 (Ekwele)"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"그리스 드라크마"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"과테말라 케트살"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"포르투갈령 기니 에스쿠도"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"기네비쏘 페소"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"가이아나 달러"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"홍콩 달러"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"온두라스 렘피라"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"크로아티아 디나르"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"크로아티아 쿠나"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"하이티 구르드"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"헝가리 포린트"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"인도네시아 루피아"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"아일랜드 파운드"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"이스라엘 파운드"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"ILR"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"이스라엘 신권 세켈"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"인도 루피"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"이라크 디나르"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"이란 리얄"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"ISJ"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"아이슬란드 크로나"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"이탈리아 리라"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"자메이카 달러"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"요르단 디나르"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"일본 엔화"},"symbol":"JP¥","narrow":"¥"},"KES":{"displayName":{"other":"케냐 실링"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"키르기스스탄 솜"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"캄보디아 리얄"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"코모르 프랑"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"조선 민주주의 인민 공화국 원"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"대한민국 환 (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"KRO"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"대한민국 원"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"쿠웨이트 디나르"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"케이맨 제도 달러"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"카자흐스탄 텐게"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"라오스 키프"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"레바논 파운드"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"스리랑카 루피"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"라이베리아 달러"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"레소토 로티"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"리투아니아 리타"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"룩셈부르크 타로나"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"룩셈부르크 변환 프랑"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"룩셈부르크 프랑"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"룩셈부르크 재정 프랑"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"라트비아 라트"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"라트비아 루블"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"리비아 디나르"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"모로코 디렘"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"모로코 프랑"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"모나코 프랑"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"몰도바 쿠폰"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"몰도바 레이"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"마다가스카르 아리아리"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"마다가스카르 프랑"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"마케도니아 디나르"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"MKN"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"말리 프랑"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"미얀마 키얏"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"몽골 투그릭"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"마카오 파타카"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"모리타니 우기야 (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"모리타니 우기야"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"몰타 리라"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"몰타 파운드"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"모리셔스 루피"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"MVP"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"몰디브 제도 루피아"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"말라위 콰쳐"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"멕시코 페소"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"멕시코 실버 페소 (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"멕시코 (UDI)"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"말레이시아 링깃"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"모잠비크 에스쿠도"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"고 모잠비크 메티칼"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"모잠비크 메티칼"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"나미비아 달러"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"니제르 나이라"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"니카라과 코르도바"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"니카라과 코르도바 오로"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"네델란드 길더"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"노르웨이 크로네"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"네팔 루피"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"뉴질랜드 달러"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"오만 리얄"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"파나마 발보아"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"페루 인티"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"페루 솔"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"페루 솔 (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"파푸아뉴기니 키나"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"필리핀 페소"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"파키스탄 루피"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"폴란드 즐로티"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"폴란드 즐로티 (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"포르투갈 에스쿠도"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"파라과이 과라니"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"카타르 리얄"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"로디지아 달러"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"루마니아 레이"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"루마니아 레우"},"symbol":"RON","narrow":"L"},"RSD":{"displayName":{"other":"세르비아 디나르"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"러시아 루블"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"러시아 루블 (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"르완다 프랑"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"사우디아라비아 리얄"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"솔로몬 제도 달러"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"세이셸 루피"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"수단 디나르"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"수단 파운드"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"고 수단 파운드"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"스웨덴 크로나"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"싱가폴 달러"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"세인트헬레나 파운드"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"슬로베니아 톨라르"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"슬로바키아 코루나"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"시에라리온 리온"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"소말리아 실링"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"수리남 달러"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"수리남 길더"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"남수단 파운드"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"상투메 프린시페 도브라 (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"상투메 프린시페 도브라"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"소련 루블"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"엘살바도르 콜론"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"시리아 파운드"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"스와질란드 릴랑게니"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"태국 바트"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"타지키스탄 루블"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"타지키스탄 소모니"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"투르크메니스탄 마나트 (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"투르크메니스탄 마나트"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"튀니지 디나르"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"통가 파앙가"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"티모르 에스쿠도"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"터키 리라"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"신 터키 리라"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"트리니다드 토바고 달러"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"신 타이완 달러"},"symbol":"NT$","narrow":"NT$"},"TZS":{"displayName":{"other":"탄자니아 실링"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"우크라이나 그리브나"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"우크라이나 카보바네츠"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"우간다 실링 (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"우간다 실링"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"미국 달러"},"symbol":"US$","narrow":"$"},"USN":{"displayName":{"other":"미국 달러(다음날)"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"미국 달러(당일)"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"우루과이 페소 (UI)"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"우루과이 페소 (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"우루과이 페소 우루과요"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"UYW"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"우즈베키스탄 숨"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"베네주엘라 볼리바르 (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"베네수엘라 볼리바르 (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"베네수엘라 볼리바르"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"베트남 동"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"베트남 동 (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"바누아투 바투"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"서 사모아 탈라"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"중앙아프리카 CFA 프랑"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"은화"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"금"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"유르코 (유럽 회계 단위)"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"유럽 통화 동맹"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"유럽 계산 단위 (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"유럽 계산 단위 (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"동카리브 달러"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"특별인출권"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"유럽 환율 단위"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"프랑스 프랑 (Gold)"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"프랑스 프랑 (UIC)"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"서아프리카 CFA 프랑"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"팔라듐"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"CFP 프랑"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"백금"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET 기금"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"XSU"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"테스트 통화 코드"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"XUA"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"(알 수 없는 통화 단위)"},"symbol":"¤","narrow":"¤"},"YDD":{"displayName":{"other":"예멘 디나르"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"예멘 리알"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"유고슬라비아 동전 디나르"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"유고슬라비아 노비 디나르"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"유고슬라비아 전환 디나르"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"YUR"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"남아프리카 랜드 (금융)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"남아프리카 랜드"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"쟘비아 콰쳐 (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"잠비아 콰쳐"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"자이르 신권 자이르"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"자이르 자이르"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"짐바브웨 달러"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"짐바브웨 달러 (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"짐바브웨 달러 (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0천"},"10000":{"other":"0만"},"100000":{"other":"00만"},"1000000":{"other":"000만"},"10000000":{"other":"0000만"},"100000000":{"other":"0억"},"1000000000":{"other":"00억"},"10000000000":{"other":"000억"},"100000000000":{"other":"0000억"},"1000000000000":{"other":"0조"},"10000000000000":{"other":"00조"},"100000000000000":{"other":"000조"}},"short":{"1000":{"other":"0천"},"10000":{"other":"0만"},"100000":{"other":"00만"},"1000000":{"other":"000만"},"10000000":{"other":"0000만"},"100000000":{"other":"0억"},"1000000000":{"other":"00억"},"10000000000":{"other":"000억"},"100000000000":{"other":"0000억"},"1000000000000":{"other":"0조"},"10000000000000":{"other":"00조"},"100000000000000":{"other":"000조"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0} {1}","short":{"1000":{"other":"¤0천"},"10000":{"other":"¤0만"},"100000":{"other":"¤00만"},"1000000":{"other":"¤000만"},"10000000":{"other":"¤0000만"},"100000000":{"other":"¤0억"},"1000000000":{"other":"¤00억"},"10000000000":{"other":"¤000억"},"100000000000":{"other":"¤0000억"},"1000000000000":{"other":"¤0조"},"10000000000000":{"other":"¤00조"},"100000000000000":{"other":"¤000조"}}}}},"nu":["latn"]}},"availableLocales":["ko"],"aliases":{},"parentLocales":{}},
    {"data":{"th":{"units":{"degree":{"displayName":"องศา","long":{"other":{"symbol":["องศา"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"acre":{"displayName":"เอเคอร์","long":{"other":{"symbol":["เอเคอร์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["เอเคอร์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["เอเคอร์"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"เฮกตาร์","long":{"other":{"symbol":["เฮกตาร์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["เฮกตาร์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["เฮกตาร์"],"pattern":"{0}{1}"}}},"percent":{"displayName":"เปอร์เซ็นต์","long":{"other":{"symbol":["เปอร์เซ็นต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"บิต","long":{"other":{"symbol":["บิต"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["บิต"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["บิต"],"pattern":"{0} {1}"}}},"byte":{"displayName":"ไบต์","long":{"other":{"symbol":["ไบต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ไบต์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ไบต์"],"pattern":"{0} {1}"}}},"gigabit":{"displayName":"กิกะบิต","long":{"other":{"symbol":["กิกะบิต"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}}},"gigabyte":{"displayName":"กิกะไบต์","long":{"other":{"symbol":["กิกะไบต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}}},"kilobit":{"displayName":"กิโลบิต","long":{"other":{"symbol":["กิโลบิต"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}}},"kilobyte":{"displayName":"กิโลไบต์","long":{"other":{"symbol":["กิโลไบต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}}},"megabit":{"displayName":"เมกะบิต","long":{"other":{"symbol":["เมกะบิต"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}}},"megabyte":{"displayName":"เมกะไบต์","long":{"other":{"symbol":["เมกะไบต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}}},"petabyte":{"displayName":"เพตะไบต์","long":{"other":{"symbol":["เพตะไบต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"เทราบิต","long":{"other":{"symbol":["เทราบิต"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}}},"terabyte":{"displayName":"เทราไบต์","long":{"other":{"symbol":["เทราไบต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}}},"day":{"displayName":"วัน","long":{"other":{"symbol":["วัน"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["วัน"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["วัน"],"pattern":"{0}{1}"}}},"hour":{"displayName":"ชั่วโมง","long":{"other":{"symbol":["ชั่วโมง"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ชม."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ชม."],"pattern":"{0}{1}"}}},"millisecond":{"displayName":"มิลลิวินาที","long":{"other":{"symbol":["มิลลิวินาที"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["มิลลิวินาที"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["มิลลิวิ"],"pattern":"{0} {1}"}}},"minute":{"displayName":"นาที","long":{"other":{"symbol":["นาที"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["นาที"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["นาที"],"pattern":"{0}{1}"}}},"month":{"displayName":"เดือน","long":{"other":{"symbol":["เดือน"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["เดือน"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["เดือน"],"pattern":"{0}{1}"}}},"second":{"displayName":"วินาที","long":{"other":{"symbol":["วินาที"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["วิ"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["วิ"],"pattern":"{0}{1}"}}},"week":{"displayName":"สัปดาห์","long":{"other":{"symbol":["สัปดาห์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["สัปดาห์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["สัปดาห์"],"pattern":"{0}{1}"}}},"year":{"displayName":"ปี","long":{"other":{"symbol":["ปี"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ปี"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ปี"],"pattern":"{0}{1}"}}},"centimeter":{"displayName":"เซนติเมตร","long":{"other":{"symbol":["เซนติเมตร"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ซม."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ซม."],"pattern":"{0}{1}"}}},"foot":{"displayName":"ฟุต","long":{"other":{"symbol":["ฟุต"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ฟุต"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["′"],"pattern":"{0}{1}"}}},"inch":{"displayName":"นิ้ว","long":{"other":{"symbol":["นิ้ว"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["นิ้ว"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["″"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"กิโลเมตร","long":{"other":{"symbol":["กิโลเมตร"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["กม."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["กม."],"pattern":"{0}{1}"}}},"meter":{"displayName":"เมตร","long":{"other":{"symbol":["เมตร"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ม."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ม."],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"ไมล์สแกนดิเนเวีย","long":{"other":{"symbol":["ไมล์สแกนดิเนเวีย"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ไมล์สแกนดินีเวีย"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ไมล์สแกนดินีเวีย"],"pattern":"{0} {1}"}}},"mile":{"displayName":"ไมล์","long":{"other":{"symbol":["ไมล์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ไมล์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ไมล์"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"มิลลิเมตร","long":{"other":{"symbol":["มิลลิเมตร"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["มม."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["มม."],"pattern":"{0}{1}"}}},"yard":{"displayName":"หลา","long":{"other":{"symbol":["หลา"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["หลา"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["หลา"],"pattern":"{0}{1}"}}},"gram":{"displayName":"กรัม","long":{"other":{"symbol":["กรัม"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ก."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ก."],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"กิโลกรัม","long":{"other":{"symbol":["กิโลกรัม"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["กก."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["กก."],"pattern":"{0}{1}"}}},"ounce":{"displayName":"ออนซ์","long":{"other":{"symbol":["ออนซ์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ออนซ์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ออนซ์"],"pattern":"{0}{1}"}}},"pound":{"displayName":"ปอนด์","long":{"other":{"symbol":["ปอนด์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ปอนด์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["#"],"pattern":"{0}{1}"}}},"stone":{"displayName":"st","long":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["st"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0} {1}"}}},"celsius":{"displayName":"องศาเซลเซียส","long":{"other":{"symbol":["องศาเซลเซียส"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"องศาฟาเรนไฮต์","long":{"other":{"symbol":["องศาฟาเรนไฮต์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"ฟลูอิดออนซ์","long":{"other":{"symbol":["ฟลูอิดออนซ์"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ฟลูอิดออนซ์"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ฟลูอิดออนซ์"],"pattern":"{0} {1}"}}},"gallon":{"displayName":"แกลลอน","long":{"other":{"symbol":["แกลลอน"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["แกลลอน"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["แกลลอน"],"pattern":"{0} {1}"}}},"liter":{"displayName":"ลิตร","long":{"other":{"symbol":["ลิตร"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["ล."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["ล."],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"มิลลิลิตร","long":{"other":{"symbol":["มิลลิลิตร"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["มล."],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["มล."],"pattern":"{0} {1}"}}}},"currencies":{"ADP":{"displayName":{"other":"เปเซตาอันดอร์รา"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"เดอร์แฮมสหรัฐอาหรับเอมิเรตส์"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"อัฟกานีอัฟกานิสถาน (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"อัฟกานิอัฟกานิสถาน"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"ALK"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"เลกแอลเบเนีย"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"แดรมอาร์เมเนีย"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"กิลเดอร์เนเธอร์แลนด์แอนทิลลิส"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"กวานซาแองโกลา"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"กวานซาแองโกลา (1977–1990)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"นิวกวานซาแองโกลา (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"กวานซารีจัสทาโดแองโกลา (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"ออสตรัลอาร์เจนตินา"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"เปโซเลย์อาร์เจนตินา (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"เปโซอาร์เจนตินา (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"เปโซอาร์เจนตินา (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"เปโซอาร์เจนตินา"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"ชิลลิงออสเตรีย"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"ดอลลาร์ออสเตรเลีย"},"symbol":"AU$","narrow":"$"},"AWG":{"displayName":{"other":"ฟลอรินอารูบา"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"มานัตอาเซอร์ไบจาน (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"มานัตอาเซอร์ไบจาน"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"ดีนาร์บอสเนีย-เฮอร์เซโกวีนา"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"มาร์กบอสเนีย-เฮอร์เซโกวีนา"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"ดีนาร์ใหม่บอสเนีย-เฮอร์เซโกวีนา (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"ดอลลาร์บาร์เบโดส"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"ตากาบังกลาเทศ"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"ฟรังก์เบลเยียม (เปลี่ยนแปลงได้)"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"ฟรังก์เบลเยียม"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"ฟรังก์เบลเยียม (การเงิน)"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"ฮาร์ดเลฟบัลแกเรีย"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"โซเชียลลิสต์เลฟบัลแกเรีย"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"เลฟบัลแกเรีย"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"เลฟบัลเกเรีย (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"ดีนาร์บาห์เรน"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"ฟรังก์บุรุนดี"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"ดอลลาร์เบอร์มิวดา"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"ดอลลาร์บรูไน"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"โบลิเวียโนโบลิเวีย"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"โบลิเวียโนโบลิเวีย (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"เปโซโบลิเวีย"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"มฟดอลโบลิเวีย"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"ครูเซโรโนโวบราซิล (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"ครูซาโดบราซิล"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"ครูเซโรบราซิล (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"เรียลบราซิล"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"ครูซาโดโนโวบราซิล"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"ครูเซโรบราซิล"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"ครูเซโรบราซิล (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"ดอลลาร์บาฮามาส"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"เอ็งกุลตรัมภูฏาน"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"จ๊าดพม่า"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"ปูลาบอตสวานา"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"นิวรูเบิลเบลารุส (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"รูเบิลเบลารุส"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"รูเบิลเบลารุส (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"ดอลลาร์เบลีซ"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"ดอลลาร์แคนาดา"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"ฟรังก์คองโก"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"ยูโรดับเบิลยูไออาร์"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"ฟรังก์สวิส"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"ฟรังก์ดับเบิลยูไออาร์"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"เอสคูโดชิลี"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"ฟูเมนโตชิลี"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"เปโซชิลี"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"หยวน"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"CNX"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"หยวนจีน"},"symbol":"CN¥","narrow":"¥"},"COP":{"displayName":{"other":"เปโซโคลอมเบีย"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"วาเลอร์เรียลโคลอมเบีย"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"โกลองคอสตาริกา"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"ดีนาร์เซอร์เบียเก่า"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"ฮาร์ดโครูนาเช็กโกสโลวัก"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"เปโซคิวบา (แปลงสภาพ)"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"เปโซคิวบา"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"เอสคูโดเคปเวิร์ด"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"ปอนด์ไซปรัส"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"โครูนาสาธารณรัฐเช็ก"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"มาร์กเยอรมันตะวันออก"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"มาร์กเยอรมัน"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"ฟรังก์จิบูตี"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"โครนเดนมาร์ก"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"เปโซโดมินิกัน"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"ดีนาร์แอลจีเรีย"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"ซูเกรเอกวาดอร์"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"วาเลอร์คอนสแตนต์เอกวาดอร์"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"ครูนเอสโตเนีย"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"ปอนด์อียิปต์"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"แนกฟาเอริเทรีย"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"เปเซตาสเปน (บัญชีเอ)"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"เปเซตาสเปน (บัญชีที่เปลี่ยนแปลงได้)"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"เปเซตาสเปน"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"เบอรร์เอธิโอเปีย"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"ยูโร"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"มาร์กกาฟินแลนด์"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"ดอลลาร์ฟิจิ"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"ปอนด์หมู่เกาะฟอล์กแลนด์"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"ฟรังก์ฝรั่งเศส"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"ปอนด์สเตอร์ลิง (สหราชอาณาจักร)"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"คูปอนลาริตจอร์เจีย"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"ลารีจอร์เจีย"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"เซดีกานา (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"เซดีกานา"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"ปอนด์ยิบรอลตาร์"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"ดาลาซีแกมเบีย"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"ฟรังก์กินี"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"ไซลีกินี"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"เอ็กเวเลอิเควทอเรียลกินี"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"ดรัชมากรีก"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"เควตซัลกัวเตมาลา"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"เอสคูโดกินีโปรตุเกส"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"เปโซกินี-บิสเซา"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"ดอลลาร์กายอานา"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"ดอลลาร์ฮ่องกง"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"เลมปิราฮอนดูรัส"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"ดีนาร์โครเอเชีย"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"คูนาโครเอเชีย"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"กูร์ดเฮติ"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"ฟอรินต์ฮังการี"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"รูเปียห์อินโดนีเซีย"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"ปอนด์ไอริช"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"ปอนด์อิสราเอล"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"ILR"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"นิวเชเกลอิสราเอล"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"รูปีอินเดีย"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"ดีนาร์อิรัก"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"เรียลอิหร่าน"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"ISJ"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"โครนาไอซ์แลนด์"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"ลีราอิตาลี"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"ดอลลาร์จาเมกา"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"ดีนาร์จอร์แดน"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"เยนญี่ปุ่น"},"symbol":"¥","narrow":"¥"},"KES":{"displayName":{"other":"ชิลลิงเคนยา"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"ซอมคีร์กีซสถาน"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"เรียลกัมพูชา"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"ฟรังก์คอโมโรส"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"วอนเกาหลีเหนือ"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"ฮวานเกาหลีใต้ (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"วอนเกาหลีใต้ (1945–1953)"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"วอนเกาหลีใต้"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"ดีนาร์คูเวต"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"ดอลลาร์หมู่เกาะเคย์แมน"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"เทงเจคาซัคสถาน"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"กีบลาว"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"ปอนด์เลบานอน"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"รูปีศรีลังกา"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"ดอลลาร์ไลบีเรีย"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"โลตีเลโซโท"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"ลีตัสลิทัวเนีย"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"ทาโลนัสลิทัวเนีย"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"คอนเวอร์ทิเบิลฟรังก์ลักเซมเบิร์ก"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"ฟรังก์ลักเซมเบิร์ก"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"ไฟแนลเชียลฟรังก์ลักเซมเบิร์ก"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"ลัตส์ลัตเวีย"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"รูเบิลลัตเวีย"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"ดีนาร์ลิเบีย"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"ดีแรห์มโมร็อกโก"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"ฟรังก์โมร็อกโก"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"ฟรังก์โมนาโก"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"บัตรปันส่วนมอลโดวา"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"ลิวมอลโดวา"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"อาเรียรีมาลากาซี"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"ฟรังก์มาดากัสการ์"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"ดีนาร์มาซิโดเนีย"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"ดีนาร์มาซิโดเนีย (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"ฟรังก์มาลี"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"จ๊าตพม่า"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"ทูกริกมองโกเลีย"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"ปาตากามาเก๊า"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"อูกียามอริเตเนีย (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"อูกียามอริเตเนีย"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"ลีรามอลตา"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"ปอนด์มอลตา"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"รูปีมอริเชียส"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"MVP"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"รูฟิยามัลดีฟส์"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"ควาชามาลาวี"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"เปโซเม็กซิโก"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"เงินเปโซเม็กซิโก (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"ยูนิแดด ดี อินเวอร์ชั่น เม็กซิโก"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"ริงกิตมาเลเซีย"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"เอสคูโดโมซัมบิก"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"เมติคัลโมซัมบิกเก่า"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"เมติคัลโมซัมบิก"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"ดอลลาร์นามิเบีย"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"ไนราไนจีเรีย"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"คอร์โดบานิการากัว"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"กอร์โดบานิการากัว"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"กิลเดอร์เนเธอร์แลนด์"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"โครนนอร์เวย์"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"รูปีเนปาล"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"ดอลลาร์นิวซีแลนด์"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"เรียลโอมาน"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"บัลบัวปานามา"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"อินตีเปรู"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"ซอลเปรู"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"ซอลเปรู(1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"กีนาปาปัวนิวกินี"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"เปโซฟิลิปปินส์"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"รูปีปากีสถาน"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"ซลอตีโปแลนด์"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"ซลอตีโปแลนด์ (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"เอสคูโดโปรตุเกส"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"กวารานีปารากวัย"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"เรียลกาตาร์"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"ดอลลาร์โรดีเซีย"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"ลิวโรมาเนียเก่า"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"ลิวโรมาเนีย"},"symbol":"RON","narrow":"lei"},"RSD":{"displayName":{"other":"ดีนาร์เซอร์เบีย"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"รูเบิลรัสเซีย"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"รูเบิลรัสเซีย (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"ฟรังก์รวันดา"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"ริยัลซาอุดีอาระเบีย"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"ดอลลาร์หมู่เกาะโซโลมอน"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"รูปีเซเชลส์"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"ดีนาร์ซูดานเก่า"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"ปอนด์ซูดาน"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"ปอนด์ซูดานเก่า"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"โครนาสวีเดน"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"ดอลลาร์สิงคโปร์"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"ปอนด์เซนต์เฮเลนา"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"ทอลาร์สโลวีเนีย"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"โครูนาสโลวัก"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"ลีโอนเซียร์ราลีโอน"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"ชิลลิงโซมาเลีย"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"ดอลลาร์ซูรินาเม"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"กิลเดอร์ซูรินาเม"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"ปอนด์ซูดานใต้"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"ดอบราเซาตูเมและปรินซิปี (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"ดอบราเซาตูเมและปรินซิปี"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"รูเบิลโซเวียต"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"โคลอนเอลซัลวาดอร์"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"ปอนด์ซีเรีย"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"ลิลันเจนีสวาซิ"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"บาทไทย"},"symbol":"฿","narrow":"฿"},"TJR":{"displayName":{"other":"รูเบิลทาจิกิสถาน"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"โซโมนิทาจิกิสถาน"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"มานัตเติร์กเมนิสถาน (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"มานัตเติร์กเมนิสถาน"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"ดีนาร์ตูนิเซีย"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"พาแองกาตองกา"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"เอสคูโดติมอร์"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"ลีราตุรกีเก่า"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"ลีราตุรกี"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"ดอลลาร์ตรินิแดดและโตเบโก"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"ดอลลาร์ไต้หวันใหม่"},"symbol":"NT$","narrow":"NT$"},"TZS":{"displayName":{"other":"ชิลลิงแทนซาเนีย"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"ฮรีฟเนียยูเครน"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"คาร์โบวาเนตซ์ยูเครน"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"ชิลลิงยูกันดา (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"ชิลลิงยูกันดา"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"ดอลลาร์สหรัฐ"},"symbol":"US$","narrow":"$"},"USN":{"displayName":{"other":"ดอลลาร์สหรัฐ (วันถัดไป)"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"ดอลลาร์สหรัฐ (วันเดียวกัน)"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"เปโซเอนยูนิแดดเซสอินเด็กซาแดสอุรุกวัย"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"เปโซอุรุกวัย (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"เปโซอุรุกวัย"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"UYW"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"ซอมอุซเบกิสถาน"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"โบลิวาร์เวเนซุเอลา (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"โบลิวาร์เวเนซุเอลา"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"โบลีวาร์แห่งเวเนซุเอลา"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"ดองเวียดนาม"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"ดองเวียดนาม (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"วาตูวานูอาตู"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"ทาลาซามัว"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"ฟรังก์เซฟาธนาคารรัฐแอฟริกากลาง"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"เงิน"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"ทอง"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"หน่วยคอมโพสิตยุโรป"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"หน่วยโมเนทารียุโรป"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"หน่วยบัญชียุโรป [XBC]"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"หน่วยบัญชียุโรป [XBD]"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"ดอลลาร์แคริบเบียนตะวันออก"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"สิทธิถอนเงินพิเศษ"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"หน่วยสกุลเงินยุโรป"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"ฟรังก์ทองฝรั่งเศส"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"ฟรังก์ยูไอซีฝรั่งเศส"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"ฟรังก์เซฟาธนาคารกลางรัฐแอฟริกาตะวันตก"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"พัลเลเดียม"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"ฟรังก์ซีเอฟพี"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"แพลตินัม"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"กองทุนไรเน็ต"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"ซูเกร"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"รหัสทดสอบสกุลเงิน"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"หน่วยบัญชี เอดีบี"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"(ไม่ทราบชื่อสกุลเงิน)"},"symbol":"XXX","narrow":"XXX"},"YDD":{"displayName":{"other":"ดีนาร์เยเมน"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"เรียลเยเมน"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"ฮาร์ดดีนาร์ยูโกสลาเวีย"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"โนวิย์ดีนาร์ยูโกสลาเวีย"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"คอนเวอร์ทิเบิลดีนาร์ยูโกสลาเวีย"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"ดีนาร์ปฏิรูปยูโกสลาเวีย (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"แรนด์แอฟริกาใต้ (การเงิน)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"แรนด์แอฟริกาใต้"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"ควาชาแซมเบีย (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"ควาชาแซมเบีย"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"นิวแซร์คองโก"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"แซร์คองโก"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"ดอลลาร์ซิมบับเว"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"ดอลลาร์ซิมบับเว (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"ดอลลาร์ซิมบับเว (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0 พัน"},"10000":{"other":"0 หมื่น"},"100000":{"other":"0 แสน"},"1000000":{"other":"0 ล้าน"},"10000000":{"other":"00 ล้าน"},"100000000":{"other":"000 ล้าน"},"1000000000":{"other":"0 พันล้าน"},"10000000000":{"other":"0 หมื่นล้าน"},"100000000000":{"other":"0 แสนล้าน"},"1000000000000":{"other":"0 ล้านล้าน"},"10000000000000":{"other":"00 ล้านล้าน"},"100000000000000":{"other":"000 ล้านล้าน"}},"short":{"1000":{"other":"0K"},"10000":{"other":"00K"},"100000":{"other":"000K"},"1000000":{"other":"0M"},"10000000":{"other":"00M"},"100000000":{"other":"000M"},"1000000000":{"other":"0B"},"10000000000":{"other":"00B"},"100000000000":{"other":"000B"},"1000000000000":{"other":"0T"},"10000000000000":{"other":"00T"},"100000000000000":{"other":"000T"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0} {1}","short":{"1000":{"other":"¤0K"},"10000":{"other":"¤00K"},"100000":{"other":"¤000K"},"1000000":{"other":"¤0M"},"10000000":{"other":"¤00M"},"100000000":{"other":"¤000M"},"1000000000":{"other":"¤0B"},"10000000000":{"other":"¤00B"},"100000000000":{"other":"¤000B"},"1000000000000":{"other":"¤0T"},"10000000000000":{"other":"¤00T"},"100000000000000":{"other":"¤000T"}}}}},"nu":["latn"]}},"availableLocales":["th"],"aliases":{},"parentLocales":{}},
    {"data":{"zh":{"units":{"degree":{"displayName":"度","long":{"other":{"symbol":["度"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"acre":{"displayName":"英亩","long":{"other":{"symbol":["英亩"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英亩"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ac"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"公顷","long":{"other":{"symbol":["公顷"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["公顷"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ha"],"pattern":"{0}{1}"}}},"percent":{"displayName":"%","long":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"比特","long":{"other":{"symbol":["比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["比特"],"pattern":"{0}{1}"}}},"byte":{"displayName":"字节","long":{"other":{"symbol":["字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["字节"],"pattern":"{0}{1}"}}},"gigabit":{"displayName":"吉比特","long":{"other":{"symbol":["吉比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["吉比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["吉比特"],"pattern":"{0}{1}"}}},"gigabyte":{"displayName":"吉字节","long":{"other":{"symbol":["吉字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["吉字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["吉字节"],"pattern":"{0}{1}"}}},"kilobit":{"displayName":"千比特","long":{"other":{"symbol":["千比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["千比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["千比特"],"pattern":"{0}{1}"}}},"kilobyte":{"displayName":"千字节","long":{"other":{"symbol":["千字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["千字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["千字节"],"pattern":"{0}{1}"}}},"megabit":{"displayName":"兆比特","long":{"other":{"symbol":["兆比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["兆比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["兆比特"],"pattern":"{0}{1}"}}},"megabyte":{"displayName":"兆字节","long":{"other":{"symbol":["兆字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["兆字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["兆字节"],"pattern":"{0}{1}"}}},"petabyte":{"displayName":"拍字节","long":{"other":{"symbol":["拍字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"太比特","long":{"other":{"symbol":["太比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["太比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["太比特"],"pattern":"{0}{1}"}}},"terabyte":{"displayName":"太字节","long":{"other":{"symbol":["太字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["太字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["太字节"],"pattern":"{0}{1}"}}},"day":{"displayName":"天","long":{"other":{"symbol":["天"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["天"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["天"],"pattern":"{0}{1}"}}},"hour":{"displayName":"小时","long":{"other":{"symbol":["小时"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["小时"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["小时"],"pattern":"{0}{1}"}}},"millisecond":{"displayName":"毫秒","long":{"other":{"symbol":["毫秒"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["毫秒"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["毫秒"],"pattern":"{0}{1}"}}},"minute":{"displayName":"分钟","long":{"other":{"symbol":["分钟"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["分钟"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["分钟"],"pattern":"{0}{1}"}}},"month":{"displayName":"个月","long":{"other":{"symbol":["个月"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["个月"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["个月"],"pattern":"{0}{1}"}}},"second":{"displayName":"秒钟","long":{"other":{"symbol":["秒钟"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["秒"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["秒"],"pattern":"{0}{1}"}}},"week":{"displayName":"周","long":{"other":{"symbol":["周"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["周"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["周"],"pattern":"{0}{1}"}}},"year":{"displayName":"年","long":{"other":{"symbol":["年"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["年"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["年"],"pattern":"{0}{1}"}}},"centimeter":{"displayName":"厘米","long":{"other":{"symbol":["厘米"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["厘米"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["厘米"],"pattern":"{0}{1}"}}},"foot":{"displayName":"英尺","long":{"other":{"symbol":["英尺"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英尺"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["′"],"pattern":"{0}{1}"}}},"inch":{"displayName":"英寸","long":{"other":{"symbol":["英寸"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英寸"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["″"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"公里","long":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}}},"meter":{"displayName":"米","long":{"other":{"symbol":["米"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["米"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["米"],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"斯堪的纳维亚英里","long":{"other":{"symbol":["斯堪的纳维亚英里"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["斯堪的纳维亚英里"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["smi"],"pattern":"{0}{1}"}}},"mile":{"displayName":"英里","long":{"other":{"symbol":["英里"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英里"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["mi"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"毫米","long":{"other":{"symbol":["毫米"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["毫米"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["毫米"],"pattern":"{0}{1}"}}},"yard":{"displayName":"码","long":{"other":{"symbol":["码"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["码"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["yd"],"pattern":"{0}{1}"}}},"gram":{"displayName":"克","long":{"other":{"symbol":["克"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["克"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["克"],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"千克","long":{"other":{"symbol":["千克"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["千克"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["千克"],"pattern":"{0}{1}"}}},"ounce":{"displayName":"盎司","long":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}}},"pound":{"displayName":"磅","long":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}}},"stone":{"displayName":"英石","long":{"other":{"symbol":["英石"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英石"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["英石"],"pattern":"{0}{1}"}}},"celsius":{"displayName":"摄氏度","long":{"other":{"symbol":["摄氏度"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"华氏度","long":{"other":{"symbol":["华氏度"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"液盎司","long":{"other":{"symbol":["液盎司"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["液盎司"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["液盎司"],"pattern":"{0}{1}"}}},"gallon":{"displayName":"加仑","long":{"other":{"symbol":["加仑"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["加仑"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["加仑"],"pattern":"{0}{1}"}}},"liter":{"displayName":"升","long":{"other":{"symbol":["升"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["升"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["升"],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"毫升","long":{"other":{"symbol":["毫升"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["毫升"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["毫升"],"pattern":"{0}{1}"}}}},"currencies":{"ADP":{"displayName":{"other":"安道尔比塞塔"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"阿联酋迪拉姆"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"阿富汗尼 (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"阿富汗尼"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"阿尔巴尼亚列克(1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"阿尔巴尼亚列克"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"亚美尼亚德拉姆"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"荷属安的列斯盾"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"安哥拉宽扎"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"安哥拉宽扎 (1977–1990)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"安哥拉新宽扎 (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"安哥拉重新调整宽扎 (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"阿根廷奥斯特拉尔"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"阿根廷法定比索 (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"阿根廷比索 (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"阿根廷比索 (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"阿根廷比索"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"奥地利先令"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"澳大利亚元"},"symbol":"AU$","narrow":"$"},"AWG":{"displayName":{"other":"阿鲁巴弗罗林"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"阿塞拜疆马纳特 (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"阿塞拜疆马纳特"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"波士尼亚-赫塞哥维纳第纳尔 (1992–1994)"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"波斯尼亚-黑塞哥维那可兑换马克"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"波士尼亚-赫塞哥维纳新第纳尔 (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"巴巴多斯元"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"孟加拉塔卡"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"比利时法郎（可兑换）"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"比利时法郎"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"比利时法郎（金融）"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"保加利亚硬列弗"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"保加利亚社会党列弗"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"保加利亚新列弗"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"保加利亚列弗 (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"巴林第纳尔"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"布隆迪法郎"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"百慕大元"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"文莱元"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"玻利维亚诺"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"玻利维亚诺 (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"玻利维亚比索"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"玻利维亚 Mvdol（资金）"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"巴西新克鲁赛罗 (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"巴西克鲁扎多 (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"巴西克鲁塞罗 (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"巴西雷亚尔"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"巴西新克鲁扎多 (1989–1990)"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"巴西克鲁塞罗 (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"巴西克鲁塞罗 (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"巴哈马元"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"不丹努尔特鲁姆"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"缅元"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"博茨瓦纳普拉"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"白俄罗斯新卢布 (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"白俄罗斯卢布"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"白俄罗斯卢布 (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"伯利兹元"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"加拿大元"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"刚果法郎"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"欧元 (WIR)"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"瑞士法郎"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"法郎 (WIR)"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"智利埃斯库多"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"智利（资金）"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"智利比索"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"人民币（离岸）"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"中国人民银行元"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"人民币"},"symbol":"¥","narrow":"¥"},"COP":{"displayName":{"other":"哥伦比亚比索"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"哥伦比亚币"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"哥斯达黎加科朗"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"旧塞尔维亚第纳尔"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"捷克硬克朗"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"古巴可兑换比索"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"古巴比索"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"佛得角埃斯库多"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"塞浦路斯镑"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"捷克克朗"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"东德奥斯特马克"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"德国马克"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"吉布提法郎"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"丹麦克朗"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"多米尼加比索"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"阿尔及利亚第纳尔"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"厄瓜多尔苏克雷"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"厄瓜多尔 (UVC)"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"爱沙尼亚克朗"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"埃及镑"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"厄立特里亚纳克法"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"西班牙比塞塔（帐户 A）"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"西班牙比塞塔（兑换帐户）"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"西班牙比塞塔"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"埃塞俄比亚比尔"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"欧元"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"芬兰马克"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"斐济元"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"福克兰群岛镑"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"法国法郎"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"英镑"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"乔治亚库蓬拉瑞特"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"格鲁吉亚拉里"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"加纳塞第"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"加纳塞地"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"直布罗陀镑"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"冈比亚达拉西"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"几内亚法郎"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"几内亚西里"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"赤道几内亚埃奎勒"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"希腊德拉克马"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"危地马拉格查尔"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"葡萄牙几内亚埃斯库多"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"几内亚比绍比索"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"圭亚那元"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"港元"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"洪都拉斯伦皮拉"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"克罗地亚第纳尔"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"克罗地亚库纳"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"海地古德"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"匈牙利福林"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"印度尼西亚盾"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"爱尔兰镑"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"以色列镑"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"以色列谢克尔(1980–1985)"},"symbol":"ILS","narrow":"ILS"},"ILS":{"displayName":{"other":"以色列新谢克尔"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"印度卢比"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"伊拉克第纳尔"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"伊朗里亚尔"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"冰岛克朗(1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"冰岛克朗"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"意大利里拉"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"牙买加元"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"约旦第纳尔"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"日元"},"symbol":"JP¥","narrow":"¥"},"KES":{"displayName":{"other":"肯尼亚先令"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"吉尔吉斯斯坦索姆"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"柬埔寨瑞尔"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"科摩罗法郎"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"朝鲜元"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"韩元 (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"韩元 (1945–1953)"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"韩元"},"symbol":"￦","narrow":"₩"},"KWD":{"displayName":{"other":"科威特第纳尔"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"开曼元"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"哈萨克斯坦坚戈"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"老挝基普"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"黎巴嫩镑"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"斯里兰卡卢比"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"利比里亚元"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"莱索托洛蒂"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"立陶宛立特"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"立陶宛塔咯呐司"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"卢森堡可兑换法郎"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"卢森堡法郎"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"卢森堡金融法郎"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"拉脱维亚拉特"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"拉脱维亚卢布"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"利比亚第纳尔"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"摩洛哥迪拉姆"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"摩洛哥法郎"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"摩纳哥法郎"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"摩尔多瓦库邦"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"摩尔多瓦列伊"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"马达加斯加阿里亚里"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"马达加斯加法郎"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"马其顿第纳尔"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"马其顿第纳尔 (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"马里法郎"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"缅甸元"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"蒙古图格里克"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"澳门元"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"毛里塔尼亚乌吉亚 (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"毛里塔尼亚乌吉亚"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"马耳他里拉"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"马耳他镑"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"毛里求斯卢比"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"马尔代夫卢比(1947–1981)"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"马尔代夫卢菲亚"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"马拉维克瓦查"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"墨西哥比索"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"墨西哥银比索 (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"墨西哥（资金）"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"马来西亚林吉特"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"莫桑比克埃斯库多"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"旧莫桑比克美提卡"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"莫桑比克美提卡"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"纳米比亚元"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"尼日利亚奈拉"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"尼加拉瓜科多巴 (1988–1991)"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"尼加拉瓜金科多巴"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"荷兰盾"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"挪威克朗"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"尼泊尔卢比"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"新西兰元"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"阿曼里亚尔"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"巴拿马巴波亚"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"秘鲁印第"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"秘鲁索尔"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"秘鲁索尔 (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"巴布亚新几内亚基那"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"菲律宾比索"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"巴基斯坦卢比"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"波兰兹罗提"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"波兰兹罗提 (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"葡萄牙埃斯库多"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"巴拉圭瓜拉尼"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"卡塔尔里亚尔"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"罗得西亚元"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"旧罗马尼亚列伊"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"罗马尼亚列伊"},"symbol":"RON","narrow":"lei"},"RSD":{"displayName":{"other":"塞尔维亚第纳尔"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"俄罗斯卢布"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"俄国卢布 (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"卢旺达法郎"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"沙特里亚尔"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"所罗门群岛元"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"塞舌尔卢比"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"苏丹第纳尔 (1992–2007)"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"苏丹镑"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"旧苏丹镑"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"瑞典克朗"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"新加坡元"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"圣赫勒拿群岛磅"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"斯洛文尼亚托拉尔"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"斯洛伐克克朗"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"塞拉利昂利昂"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"索马里先令"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"苏里南元"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"苏里南盾"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"南苏丹镑"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"圣多美和普林西比多布拉 (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"圣多美和普林西比多布拉"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"苏联卢布"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"萨尔瓦多科朗"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"叙利亚镑"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"斯威士兰里兰吉尼"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"泰铢"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"塔吉克斯坦卢布"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"塔吉克斯坦索莫尼"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"土库曼斯坦马纳特 (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"土库曼斯坦马纳特"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"突尼斯第纳尔"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"汤加潘加"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"帝汶埃斯库多"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"土耳其里拉 (1922–2005)"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"土耳其里拉"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"特立尼达和多巴哥元"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"新台币"},"symbol":"NT$","narrow":"NT$"},"TZS":{"displayName":{"other":"坦桑尼亚先令"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"乌克兰格里夫纳"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"乌克兰币"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"乌干达先令 (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"乌干达先令"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"美元"},"symbol":"US$","narrow":"$"},"USN":{"displayName":{"other":"美元（次日）"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"美元（当日）"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"乌拉圭比索（索引单位）"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"乌拉圭比索 (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"乌拉圭比索"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"乌拉圭票面工资指数单位"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"乌兹别克斯坦苏姆"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"委内瑞拉玻利瓦尔 (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"委内瑞拉玻利瓦尔 (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"委内瑞拉玻利瓦尔"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"越南盾"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"越南盾 (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"瓦努阿图瓦图"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"萨摩亚塔拉"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"中非法郎"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"银"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"黄金"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"欧洲复合单位"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"欧洲货币联盟"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"欧洲计算单位 (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"欧洲计算单位 (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"东加勒比元"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"特别提款权"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"欧洲货币单位"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"法国金法郎"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"法国法郎 (UIC)"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"西非法郎"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"钯"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"太平洋法郎"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"铂"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET 基金"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"苏克雷"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"测试货币代码"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"非洲开发银行记账单位"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"（未知货币）"},"symbol":"XXX","narrow":"XXX"},"YDD":{"displayName":{"other":"也门第纳尔"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"也门里亚尔"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"南斯拉夫硬第纳尔 (1966–1990)"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"南斯拉夫新第纳尔 (1994–2002)"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"南斯拉夫可兑换第纳尔 (1990–1992)"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"南斯拉夫改良第纳尔 (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"南非兰特 (金融)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"南非兰特"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"赞比亚克瓦查 (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"赞比亚克瓦查"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"新扎伊尔 (1993–1998)"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"扎伊尔 (1971–1993)"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"津巴布韦元 (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"津巴布韦元 (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"津巴布韦元 (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0亿"},"1000000000":{"other":"00亿"},"10000000000":{"other":"000亿"},"100000000000":{"other":"0000亿"},"1000000000000":{"other":"0万亿"},"10000000000000":{"other":"00万亿"},"100000000000000":{"other":"000万亿"}},"short":{"1000":{"other":"0"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0亿"},"1000000000":{"other":"00亿"},"10000000000":{"other":"000亿"},"100000000000":{"other":"0000亿"},"1000000000000":{"other":"0万亿"},"10000000000000":{"other":"00万亿"},"100000000000000":{"other":"000万亿"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0}{1}","short":{"1000":{"other":"0"},"10000":{"other":"¤0万"},"100000":{"other":"¤00万"},"1000000":{"other":"¤000万"},"10000000":{"other":"¤0000万"},"100000000":{"other":"¤0亿"},"1000000000":{"other":"¤00亿"},"10000000000":{"other":"¤000亿"},"100000000000":{"other":"¤0000亿"},"1000000000000":{"other":"¤0万亿"},"10000000000000":{"other":"¤00万亿"},"100000000000000":{"other":"¤000万亿"}}}}},"nu":["latn"]}},"availableLocales":["zh"],"aliases":{"zh-CN":"zh-Hans-CN","zh-guoyu":"zh","zh-hakka":"hak","zh-HK":"zh-Hant-HK","zh-min-nan":"nan","zh-MO":"zh-Hant-MO","zh-SG":"zh-Hans-SG","zh-TW":"zh-Hant-TW","zh-xiang":"hsn","zh-min":"nan-x-zh-min"},"parentLocales":{"zh-Hant-MO":"zh-Hant-HK"}},
    {"data":{"zh-Hant":{"units":{"degree":{"displayName":"角度","long":{"other":{"symbol":["度"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["度"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["度"],"pattern":"{0}{1}"}}},"acre":{"displayName":"英畝","long":{"other":{"symbol":["英畝"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["英畝"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["英畝"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"公頃","long":{"other":{"symbol":["公頃"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["公頃"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["公頃"],"pattern":"{0}{1}"}}},"percent":{"displayName":"百分比","long":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"bit","long":{"other":{"symbol":["bit"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["bit"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["bit"],"pattern":"{0}{1}"}}},"byte":{"displayName":"byte","long":{"other":{"symbol":["byte"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["byte"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["byte"],"pattern":"{0}{1}"}}},"gigabit":{"displayName":"Gb","long":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Gb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Gb"],"pattern":"{0}{1}"}}},"gigabyte":{"displayName":"GB","long":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["GB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["GB"],"pattern":"{0}{1}"}}},"kilobit":{"displayName":"kb","long":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kb"],"pattern":"{0}{1}"}}},"kilobyte":{"displayName":"kB","long":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["kB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["kB"],"pattern":"{0}{1}"}}},"megabit":{"displayName":"Mb","long":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Mb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Mb"],"pattern":"{0}{1}"}}},"megabyte":{"displayName":"MB","long":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["MB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["MB"],"pattern":"{0}{1}"}}},"petabyte":{"displayName":"PB","long":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"Tb","long":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["Tb"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["Tb"],"pattern":"{0}{1}"}}},"terabyte":{"displayName":"TB","long":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["TB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["TB"],"pattern":"{0}{1}"}}},"day":{"displayName":"天","long":{"other":{"symbol":["天"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["天"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["天"],"pattern":"{0} {1}"}}},"hour":{"displayName":"小時","long":{"other":{"symbol":["小時"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["小時"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["小時"],"pattern":"{0} {1}"}}},"millisecond":{"displayName":"毫秒","long":{"other":{"symbol":["毫秒"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["毫秒"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["毫秒"],"pattern":"{0} {1}"}}},"minute":{"displayName":"分鐘","long":{"other":{"symbol":["分鐘"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["分鐘"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["分鐘"],"pattern":"{0} {1}"}}},"month":{"displayName":"月","long":{"other":{"symbol":["個月"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["個月"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["個月"],"pattern":"{0} {1}"}}},"second":{"displayName":"秒","long":{"other":{"symbol":["秒"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["秒"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["秒"],"pattern":"{0} {1}"}}},"week":{"displayName":"週","long":{"other":{"symbol":["週"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["週"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["週"],"pattern":"{0} {1}"}}},"year":{"displayName":"年","long":{"other":{"symbol":["年"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["年"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["年"],"pattern":"{0} {1}"}}},"centimeter":{"displayName":"公分","long":{"other":{"symbol":["公分"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["公分"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["公分"],"pattern":"{0}{1}"}}},"foot":{"displayName":"英尺","long":{"other":{"symbol":["英尺"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["呎"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["呎"],"pattern":"{0}{1}"}}},"inch":{"displayName":"英寸","long":{"other":{"symbol":["英寸"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["吋"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["吋"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"公里","long":{"other":{"symbol":["公里"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["公里"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}}},"meter":{"displayName":"公尺","long":{"other":{"symbol":["公尺"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["公尺"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["公尺"],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"斯堪地那維亞英里","long":{"other":{"symbol":["斯堪地那維亞英里"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["斯堪地那維亞英里"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["斯堪地那維亞英里"],"pattern":"{0} {1}"}}},"mile":{"displayName":"英里","long":{"other":{"symbol":["英里"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["英里"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["英里"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"公釐","long":{"other":{"symbol":["公釐"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["公釐"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["公釐"],"pattern":"{0}{1}"}}},"yard":{"displayName":"碼","long":{"other":{"symbol":["碼"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["碼"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["碼"],"pattern":"{0}{1}"}}},"gram":{"displayName":"克","long":{"other":{"symbol":["克"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["克"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["克"],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"公斤","long":{"other":{"symbol":["公斤"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["公斤"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["公斤"],"pattern":"{0} {1}"}}},"ounce":{"displayName":"盎司","long":{"other":{"symbol":["盎司"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["盎司"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}}},"pound":{"displayName":"磅","long":{"other":{"symbol":["磅"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["磅"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}}},"stone":{"displayName":"英石","long":{"other":{"symbol":["英石"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["英石"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["st"],"pattern":"{0}{1}"}}},"celsius":{"displayName":"攝氏度數","long":{"other":{"symbol":["攝氏","度"],"pattern":"{1} {0} {1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"華氏度數","long":{"other":{"symbol":["華氏","度"],"pattern":"{1} {0} {1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"液盎司","long":{"other":{"symbol":["液盎司"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["液盎司"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["fl-oz"],"pattern":"{0}{1}"}}},"gallon":{"displayName":"加侖","long":{"other":{"symbol":["加侖"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["加侖"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["gal"],"pattern":"{0}{1}"}}},"liter":{"displayName":"公升","long":{"other":{"symbol":["公升"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["升"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["升"],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"毫升","long":{"other":{"symbol":["毫升"],"pattern":"{0} {1}"}},"short":{"other":{"symbol":["毫升"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["mL"],"pattern":"{0}{1}"}}}},"currencies":{"ADP":{"displayName":{"other":"安道爾陪士特"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"阿拉伯聯合大公國迪爾汗"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"阿富汗尼 (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"阿富汗尼"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"阿爾巴尼亞列克 (1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"阿爾巴尼亞列克"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"亞美尼亞德拉姆"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"荷屬安地列斯盾"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"安哥拉寬扎"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"安哥拉寬扎 (1977–1990)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"安哥拉新寬扎 (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"安哥拉新調寬扎 (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"阿根廷奧斯特納爾"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"阿根廷披索 (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"阿根廷披索 (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"阿根廷披索 (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"阿根廷披索"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"奧地利先令"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"澳幣"},"symbol":"AU$","narrow":"$"},"AWG":{"displayName":{"other":"阿路巴盾"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"亞塞拜然馬納特 (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"亞塞拜然馬納特"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"波士尼亞-赫塞哥維納第納爾"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"波士尼亞-赫塞哥維納可轉換馬克"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"波士尼亞-赫塞哥維納新第納爾"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"巴貝多元"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"孟加拉塔卡"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"比利時法郎（可轉換）"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"比利時法郎"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"比利時法郎（金融）"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"保加利亞硬列弗"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"保加利亞社會黨列弗"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"保加利亞新列弗"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"保加利亞列弗 (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"巴林第納爾"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"蒲隆地法郎"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"百慕達幣"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"汶萊元"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"玻利維亞諾"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"玻利維亞玻利維亞諾 (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"玻利維亞披索"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"玻利維亞幕多"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"巴西克魯薩多農瓦 (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"巴西克魯賽羅 (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"巴西克魯賽羅 (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"巴西里拉"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"巴西克如爾達農瓦"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"巴西克魯賽羅 (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"巴西克魯賽羅 (1942 –1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"巴哈馬元"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"不丹那特倫"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"緬甸基雅特"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"波札那普拉"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"白俄羅斯新盧布 (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"白俄羅斯盧布"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"白俄羅斯盧布 (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"貝里斯元"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"加幣"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"剛果法郎"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"歐元 (WIR)"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"瑞士法郎"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"法郎 (WIR)"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"智利埃斯庫多"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"卡林油達佛曼跎"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"智利披索"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"人民幣（離岸）"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"CNX"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"人民幣"},"symbol":"CN¥","narrow":"¥"},"COP":{"displayName":{"other":"哥倫比亞披索"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"哥倫比亞幣 (COU)"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"哥斯大黎加科朗"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"舊塞爾維亞第納爾"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"捷克斯洛伐克硬克朗"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"古巴可轉換披索"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"古巴披索"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"維德角埃斯庫多"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"賽普勒斯鎊"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"捷克克朗"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"東德奧斯特馬克"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"德國馬克"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"吉布地法郎"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"丹麥克朗"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"多明尼加披索"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"阿爾及利亞第納爾"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"厄瓜多蘇克雷"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"厄瓜多爾由里達瓦康斯坦 (UVC)"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"愛沙尼亞克朗"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"埃及鎊"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"厄立特里亞納克法"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"西班牙比塞塔（會計單位）"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"西班牙比塞塔（可轉換會計單位）"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"西班牙陪士特"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"衣索比亞比爾"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"歐元"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"芬蘭馬克"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"斐濟元"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"福克蘭群島鎊"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"法國法郎"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"英鎊"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"喬治亞庫旁拉里"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"喬治亞拉里"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"迦納賽地 (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"迦納塞地"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"直布羅陀鎊"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"甘比亞達拉西"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"幾內亞法郎"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"幾內亞西里"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"赤道幾內亞埃奎勒"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"希臘德拉克馬"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"瓜地馬拉格查爾"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"葡屬幾內亞埃斯庫多"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"幾內亞比索披索"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"圭亞那元"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"港幣"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"洪都拉斯倫皮拉"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"克羅埃西亞第納爾"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"克羅埃西亞庫納"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"海地古德"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"匈牙利福林"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"印尼盾"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"愛爾蘭鎊"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"以色列鎊"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"以色列謝克爾 (1980–1985)"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"以色列新謝克爾"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"印度盧比"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"伊拉克第納爾"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"伊朗里亞爾"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"冰島克朗 (1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"冰島克朗"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"義大利里拉"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"牙買加元"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"約旦第納爾"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"日圓"},"symbol":"¥","narrow":"¥"},"KES":{"displayName":{"other":"肯尼亞先令"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"吉爾吉斯索姆"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"柬埔寨瑞爾"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"科摩羅法郎"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"北韓元"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"南韓圜"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"南韓圓"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"韓元"},"symbol":"￦","narrow":"₩"},"KWD":{"displayName":{"other":"科威特第納爾"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"開曼群島元"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"哈薩克堅戈"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"寮國基普"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"黎巴嫩鎊"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"斯里蘭卡盧比"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"賴比瑞亞元"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"賴索托洛蒂"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"立陶宛立特"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"立陶宛特羅"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"盧森堡可兌換法郎"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"盧森堡法郎"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"盧森堡金融法郎"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"拉脫維亞拉特銀幣"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"拉脫維亞盧布"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"利比亞第納爾"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"摩洛哥迪拉姆"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"摩洛哥法郎"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"摩納哥法郎"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"摩爾多瓦券"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"摩杜雲列伊"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"馬達加斯加阿里亞里"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"馬達加斯加法郎"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"馬其頓第納爾"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"馬其頓第納爾 (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"馬里法郎"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"緬甸元"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"蒙古圖格里克"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"澳門元"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"茅利塔尼亞烏吉亞 (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"茅利塔尼亞烏吉亞"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"馬爾他里拉"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"馬爾他鎊"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"模里西斯盧比"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"馬爾地夫盧比"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"馬爾地夫盧非亞"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"馬拉維克瓦查"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"墨西哥披索"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"墨西哥銀披索 (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"墨西哥轉換單位 (UDI)"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"馬來西亞令吉"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"莫三比克埃斯庫多"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"莫三比克梅蒂卡爾 (1980–2006)"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"莫三比克梅蒂卡爾"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"納米比亞元"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"奈及利亞奈拉"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"尼加拉瓜科多巴"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"尼加拉瓜金科多巴"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"荷蘭盾"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"挪威克朗"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"尼泊爾盧比"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"紐西蘭幣"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"阿曼里亞爾"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"巴拿馬巴波亞"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"祕魯因蒂"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"秘魯太陽幣"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"秘魯太陽幣 (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"巴布亞紐幾內亞基那"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"菲律賓披索"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"巴基斯坦盧比"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"波蘭茲羅提"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"波蘭茲羅提 (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"葡萄牙埃斯庫多"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"巴拉圭瓜拉尼"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"卡達里亞爾"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"羅德西亞元"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"舊羅馬尼亞列伊"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"羅馬尼亞列伊"},"symbol":"RON","narrow":"L"},"RSD":{"displayName":{"other":"塞爾維亞戴納"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"俄羅斯盧布"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"俄羅斯盧布 (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"盧安達法郎"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"沙烏地里亞爾"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"索羅門群島元"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"塞席爾盧比"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"蘇丹第納爾"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"蘇丹鎊"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"舊蘇丹鎊"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"瑞典克朗"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"新加坡幣"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"聖赫勒拿鎊"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"斯洛維尼亞托勒"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"斯洛伐克克朗"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"獅子山利昂"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"索馬利亞先令"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"蘇利南元"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"蘇利南基爾"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"南蘇丹鎊"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"聖多美島和普林西比島多布拉 (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"聖多美島和普林西比島多布拉"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"蘇聯盧布"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"薩爾瓦多科郎"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"敘利亞鎊"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"史瓦濟蘭里朗吉尼"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"泰銖"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"塔吉克盧布"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"塔吉克索莫尼"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"土庫曼馬納特 (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"土庫曼馬納特"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"突尼西亞第納爾"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"東加潘加"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"帝汶埃斯庫多"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"土耳其里拉"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"新土耳其里拉"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"千里達及托巴哥元"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"新台幣"},"symbol":"$","narrow":"$"},"TZS":{"displayName":{"other":"坦尚尼亞先令"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"烏克蘭格里夫納"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"烏克蘭卡本瓦那茲"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"烏干達先令 (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"烏干達先令"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"美元"},"symbol":"US$","narrow":"$"},"USN":{"displayName":{"other":"美元（次日）"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"美元（當日）"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"烏拉圭披索（指數單位）"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"烏拉圭披索 (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"烏拉圭披索"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"UYW"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"烏茲別克索姆"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"委內瑞拉玻利瓦 (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"委內瑞拉玻利瓦 (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"委內瑞拉玻利瓦"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"越南盾"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"越南盾 (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"萬那杜瓦圖"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"西薩摩亞塔拉"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"法郎 (CFA–BEAC)"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"白銀"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"黃金"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"歐洲綜合單位"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"歐洲貨幣單位 (XBB)"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"歐洲會計單位 (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"歐洲會計單位 (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"格瑞那達元"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"特殊提款權"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"歐洲貨幣單位 (XEU)"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"法國金法郎"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"法國法郎 (UIC)"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"法郎 (CFA–BCEAO)"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"帕拉狄昂"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"法郎 (CFP)"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"白金"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET 基金"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"蘇克雷貨幣"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"測試用貨幣代碼"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"亞洲開發銀行計價單位"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"（未知貨幣）"},"symbol":"XXX","narrow":"XXX"},"YDD":{"displayName":{"other":"葉門第納爾"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"葉門里亞爾"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"南斯拉夫第納爾硬幣"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"南斯拉夫挪威亞第納爾"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"南斯拉夫可轉換第納爾"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"南斯拉夫改革第納爾 (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"南非蘭特（金融）"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"南非蘭特"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"尚比亞克瓦查 (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"尚比亞克瓦查"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"薩伊新扎伊爾"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"薩伊扎伊爾"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"辛巴威元 (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"辛巴威元 (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"辛巴威元 (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"非數值","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0"},"10000":{"other":"0萬"},"100000":{"other":"00萬"},"1000000":{"other":"000萬"},"10000000":{"other":"0000萬"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}},"short":{"1000":{"other":"0"},"10000":{"other":"0萬"},"100000":{"other":"00萬"},"1000000":{"other":"000萬"},"10000000":{"other":"0000萬"},"100000000":{"other":"0億"},"1000000000":{"other":"00億"},"10000000000":{"other":"000億"},"100000000000":{"other":"0000億"},"1000000000000":{"other":"0兆"},"10000000000000":{"other":"00兆"},"100000000000000":{"other":"000兆"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0} {1}","short":{"1000":{"other":"0"},"10000":{"other":"¤0萬"},"100000":{"other":"¤00萬"},"1000000":{"other":"¤000萬"},"10000000":{"other":"¤0000萬"},"100000000":{"other":"¤0億"},"1000000000":{"other":"¤00億"},"10000000000":{"other":"¤000億"},"100000000000":{"other":"¤0000億"},"1000000000000":{"other":"¤0兆"},"10000000000000":{"other":"¤00兆"},"100000000000000":{"other":"¤000兆"}}}}},"nu":["latn"]}},"availableLocales":["zh-Hant"],"aliases":{"zh-CN":"zh-Hans-CN","zh-guoyu":"zh","zh-hakka":"hak","zh-HK":"zh-Hant-HK","zh-min-nan":"nan","zh-MO":"zh-Hant-MO","zh-SG":"zh-Hans-SG","zh-TW":"zh-Hant-TW","zh-xiang":"hsn","zh-min":"nan-x-zh-min"},"parentLocales":{"zh-Hant-MO":"zh-Hant-HK"}},
    {"data":{"zh-Hans":{"units":{"degree":{"displayName":"度","long":{"other":{"symbol":["度"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°"],"pattern":"{0}{1}"}}},"acre":{"displayName":"英亩","long":{"other":{"symbol":["英亩"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英亩"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ac"],"pattern":"{0}{1}"}}},"hectare":{"displayName":"公顷","long":{"other":{"symbol":["公顷"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["公顷"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["ha"],"pattern":"{0}{1}"}}},"percent":{"displayName":"%","long":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["%"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["%"],"pattern":"{0}{1}"}}},"bit":{"displayName":"比特","long":{"other":{"symbol":["比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["比特"],"pattern":"{0}{1}"}}},"byte":{"displayName":"字节","long":{"other":{"symbol":["字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["字节"],"pattern":"{0}{1}"}}},"gigabit":{"displayName":"吉比特","long":{"other":{"symbol":["吉比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["吉比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["吉比特"],"pattern":"{0}{1}"}}},"gigabyte":{"displayName":"吉字节","long":{"other":{"symbol":["吉字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["吉字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["吉字节"],"pattern":"{0}{1}"}}},"kilobit":{"displayName":"千比特","long":{"other":{"symbol":["千比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["千比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["千比特"],"pattern":"{0}{1}"}}},"kilobyte":{"displayName":"千字节","long":{"other":{"symbol":["千字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["千字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["千字节"],"pattern":"{0}{1}"}}},"megabit":{"displayName":"兆比特","long":{"other":{"symbol":["兆比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["兆比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["兆比特"],"pattern":"{0}{1}"}}},"megabyte":{"displayName":"兆字节","long":{"other":{"symbol":["兆字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["兆字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["兆字节"],"pattern":"{0}{1}"}}},"petabyte":{"displayName":"拍字节","long":{"other":{"symbol":["拍字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}},"narrow":{"other":{"symbol":["PB"],"pattern":"{0} {1}"}}},"terabit":{"displayName":"太比特","long":{"other":{"symbol":["太比特"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["太比特"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["太比特"],"pattern":"{0}{1}"}}},"terabyte":{"displayName":"太字节","long":{"other":{"symbol":["太字节"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["太字节"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["太字节"],"pattern":"{0}{1}"}}},"day":{"displayName":"天","long":{"other":{"symbol":["天"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["天"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["天"],"pattern":"{0}{1}"}}},"hour":{"displayName":"小时","long":{"other":{"symbol":["小时"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["小时"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["小时"],"pattern":"{0}{1}"}}},"millisecond":{"displayName":"毫秒","long":{"other":{"symbol":["毫秒"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["毫秒"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["毫秒"],"pattern":"{0}{1}"}}},"minute":{"displayName":"分钟","long":{"other":{"symbol":["分钟"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["分钟"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["分钟"],"pattern":"{0}{1}"}}},"month":{"displayName":"个月","long":{"other":{"symbol":["个月"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["个月"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["个月"],"pattern":"{0}{1}"}}},"second":{"displayName":"秒钟","long":{"other":{"symbol":["秒钟"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["秒"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["秒"],"pattern":"{0}{1}"}}},"week":{"displayName":"周","long":{"other":{"symbol":["周"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["周"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["周"],"pattern":"{0}{1}"}}},"year":{"displayName":"年","long":{"other":{"symbol":["年"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["年"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["年"],"pattern":"{0}{1}"}}},"centimeter":{"displayName":"厘米","long":{"other":{"symbol":["厘米"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["厘米"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["厘米"],"pattern":"{0}{1}"}}},"foot":{"displayName":"英尺","long":{"other":{"symbol":["英尺"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英尺"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["′"],"pattern":"{0}{1}"}}},"inch":{"displayName":"英寸","long":{"other":{"symbol":["英寸"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英寸"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["″"],"pattern":"{0}{1}"}}},"kilometer":{"displayName":"公里","long":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["公里"],"pattern":"{0}{1}"}}},"meter":{"displayName":"米","long":{"other":{"symbol":["米"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["米"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["米"],"pattern":"{0}{1}"}}},"mile-scandinavian":{"displayName":"斯堪的纳维亚英里","long":{"other":{"symbol":["斯堪的纳维亚英里"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["斯堪的纳维亚英里"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["smi"],"pattern":"{0}{1}"}}},"mile":{"displayName":"英里","long":{"other":{"symbol":["英里"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英里"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["mi"],"pattern":"{0}{1}"}}},"millimeter":{"displayName":"毫米","long":{"other":{"symbol":["毫米"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["毫米"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["毫米"],"pattern":"{0}{1}"}}},"yard":{"displayName":"码","long":{"other":{"symbol":["码"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["码"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["yd"],"pattern":"{0}{1}"}}},"gram":{"displayName":"克","long":{"other":{"symbol":["克"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["克"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["克"],"pattern":"{0}{1}"}}},"kilogram":{"displayName":"千克","long":{"other":{"symbol":["千克"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["千克"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["千克"],"pattern":"{0}{1}"}}},"ounce":{"displayName":"盎司","long":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["盎司"],"pattern":"{0}{1}"}}},"pound":{"displayName":"磅","long":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["磅"],"pattern":"{0}{1}"}}},"stone":{"displayName":"英石","long":{"other":{"symbol":["英石"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["英石"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["英石"],"pattern":"{0}{1}"}}},"celsius":{"displayName":"摄氏度","long":{"other":{"symbol":["摄氏度"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°C"],"pattern":"{0}{1}"}}},"fahrenheit":{"displayName":"华氏度","long":{"other":{"symbol":["华氏度"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["°F"],"pattern":"{0}{1}"}}},"fluid-ounce":{"displayName":"液盎司","long":{"other":{"symbol":["液盎司"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["液盎司"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["液盎司"],"pattern":"{0}{1}"}}},"gallon":{"displayName":"加仑","long":{"other":{"symbol":["加仑"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["加仑"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["加仑"],"pattern":"{0}{1}"}}},"liter":{"displayName":"升","long":{"other":{"symbol":["升"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["升"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["升"],"pattern":"{0}{1}"}}},"milliliter":{"displayName":"毫升","long":{"other":{"symbol":["毫升"],"pattern":"{0}{1}"}},"short":{"other":{"symbol":["毫升"],"pattern":"{0}{1}"}},"narrow":{"other":{"symbol":["毫升"],"pattern":"{0}{1}"}}}},"currencies":{"ADP":{"displayName":{"other":"安道尔比塞塔"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"阿联酋迪拉姆"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"阿富汗尼 (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"阿富汗尼"},"symbol":"AFN","narrow":"AFN"},"ALK":{"displayName":{"other":"阿尔巴尼亚列克(1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"阿尔巴尼亚列克"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"亚美尼亚德拉姆"},"symbol":"AMD","narrow":"AMD"},"ANG":{"displayName":{"other":"荷属安的列斯盾"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"安哥拉宽扎"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"安哥拉宽扎 (1977–1990)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"安哥拉新宽扎 (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"安哥拉重新调整宽扎 (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"阿根廷奥斯特拉尔"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"阿根廷法定比索 (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"阿根廷比索 (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"阿根廷比索 (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"阿根廷比索"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"奥地利先令"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"澳大利亚元"},"symbol":"AU$","narrow":"$"},"AWG":{"displayName":{"other":"阿鲁巴弗罗林"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"阿塞拜疆马纳特 (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"阿塞拜疆马纳特"},"symbol":"AZN","narrow":"AZN"},"BAD":{"displayName":{"other":"波士尼亚-赫塞哥维纳第纳尔 (1992–1994)"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"波斯尼亚-黑塞哥维那可兑换马克"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"波士尼亚-赫塞哥维纳新第纳尔 (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"巴巴多斯元"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"孟加拉塔卡"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"比利时法郎（可兑换）"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"比利时法郎"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"比利时法郎（金融）"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"保加利亚硬列弗"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"保加利亚社会党列弗"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"保加利亚新列弗"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"保加利亚列弗 (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"巴林第纳尔"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"布隆迪法郎"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"百慕大元"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"文莱元"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"玻利维亚诺"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"玻利维亚诺 (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"玻利维亚比索"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"玻利维亚 Mvdol（资金）"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"巴西新克鲁赛罗 (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"巴西克鲁扎多 (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"巴西克鲁塞罗 (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"巴西雷亚尔"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"巴西新克鲁扎多 (1989–1990)"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"巴西克鲁塞罗 (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"巴西克鲁塞罗 (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"巴哈马元"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"不丹努尔特鲁姆"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"缅元"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"博茨瓦纳普拉"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"白俄罗斯新卢布 (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"白俄罗斯卢布"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"白俄罗斯卢布 (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"伯利兹元"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"加拿大元"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"刚果法郎"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"欧元 (WIR)"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"瑞士法郎"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"法郎 (WIR)"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"智利埃斯库多"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"智利（资金）"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"智利比索"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"人民币（离岸）"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"中国人民银行元"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"人民币"},"symbol":"¥","narrow":"¥"},"COP":{"displayName":{"other":"哥伦比亚比索"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"哥伦比亚币"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"哥斯达黎加科朗"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"旧塞尔维亚第纳尔"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"捷克硬克朗"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"古巴可兑换比索"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"古巴比索"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"佛得角埃斯库多"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"塞浦路斯镑"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"捷克克朗"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"东德奥斯特马克"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"德国马克"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"吉布提法郎"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"丹麦克朗"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"多米尼加比索"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"阿尔及利亚第纳尔"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"厄瓜多尔苏克雷"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"厄瓜多尔 (UVC)"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"爱沙尼亚克朗"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"埃及镑"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"厄立特里亚纳克法"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"西班牙比塞塔（帐户 A）"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"西班牙比塞塔（兑换帐户）"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"西班牙比塞塔"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"埃塞俄比亚比尔"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"欧元"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"芬兰马克"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"斐济元"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"福克兰群岛镑"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"法国法郎"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"英镑"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"乔治亚库蓬拉瑞特"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"格鲁吉亚拉里"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"加纳塞第"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"加纳塞地"},"symbol":"GHS","narrow":"GHS"},"GIP":{"displayName":{"other":"直布罗陀镑"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"冈比亚达拉西"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"几内亚法郎"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"几内亚西里"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"赤道几内亚埃奎勒"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"希腊德拉克马"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"危地马拉格查尔"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"葡萄牙几内亚埃斯库多"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"几内亚比绍比索"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"圭亚那元"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"港元"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"洪都拉斯伦皮拉"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"克罗地亚第纳尔"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"克罗地亚库纳"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"海地古德"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"匈牙利福林"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"印度尼西亚盾"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"爱尔兰镑"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"以色列镑"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"以色列谢克尔(1980–1985)"},"symbol":"ILS","narrow":"ILS"},"ILS":{"displayName":{"other":"以色列新谢克尔"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"印度卢比"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"伊拉克第纳尔"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"伊朗里亚尔"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"冰岛克朗(1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"冰岛克朗"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"意大利里拉"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"牙买加元"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"约旦第纳尔"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"日元"},"symbol":"JP¥","narrow":"¥"},"KES":{"displayName":{"other":"肯尼亚先令"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"吉尔吉斯斯坦索姆"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"柬埔寨瑞尔"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"科摩罗法郎"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"朝鲜元"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"韩元 (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"韩元 (1945–1953)"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"韩元"},"symbol":"￦","narrow":"₩"},"KWD":{"displayName":{"other":"科威特第纳尔"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"开曼元"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"哈萨克斯坦坚戈"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"老挝基普"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"黎巴嫩镑"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"斯里兰卡卢比"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"利比里亚元"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"莱索托洛蒂"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"立陶宛立特"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"立陶宛塔咯呐司"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"卢森堡可兑换法郎"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"卢森堡法郎"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"卢森堡金融法郎"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"拉脱维亚拉特"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"拉脱维亚卢布"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"利比亚第纳尔"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"摩洛哥迪拉姆"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"摩洛哥法郎"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"摩纳哥法郎"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"摩尔多瓦库邦"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"摩尔多瓦列伊"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"马达加斯加阿里亚里"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"马达加斯加法郎"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"马其顿第纳尔"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"马其顿第纳尔 (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"马里法郎"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"缅甸元"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"蒙古图格里克"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"澳门元"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"毛里塔尼亚乌吉亚 (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"毛里塔尼亚乌吉亚"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"马耳他里拉"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"马耳他镑"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"毛里求斯卢比"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"马尔代夫卢比(1947–1981)"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"马尔代夫卢菲亚"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"马拉维克瓦查"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"墨西哥比索"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"墨西哥银比索 (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"墨西哥（资金）"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"马来西亚林吉特"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"莫桑比克埃斯库多"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"旧莫桑比克美提卡"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"莫桑比克美提卡"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"纳米比亚元"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"尼日利亚奈拉"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"尼加拉瓜科多巴 (1988–1991)"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"尼加拉瓜金科多巴"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"荷兰盾"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"挪威克朗"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"尼泊尔卢比"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"新西兰元"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"阿曼里亚尔"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"巴拿马巴波亚"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"秘鲁印第"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"秘鲁索尔"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"秘鲁索尔 (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"巴布亚新几内亚基那"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"菲律宾比索"},"symbol":"PHP","narrow":"₱"},"PKR":{"displayName":{"other":"巴基斯坦卢比"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"波兰兹罗提"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"波兰兹罗提 (1950–1995)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"葡萄牙埃斯库多"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"巴拉圭瓜拉尼"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"卡塔尔里亚尔"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"罗得西亚元"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"旧罗马尼亚列伊"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"罗马尼亚列伊"},"symbol":"RON","narrow":"lei"},"RSD":{"displayName":{"other":"塞尔维亚第纳尔"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"俄罗斯卢布"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"俄国卢布 (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"卢旺达法郎"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"沙特里亚尔"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"所罗门群岛元"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"塞舌尔卢比"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"苏丹第纳尔 (1992–2007)"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"苏丹镑"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"旧苏丹镑"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"瑞典克朗"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"新加坡元"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"圣赫勒拿群岛磅"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"斯洛文尼亚托拉尔"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"斯洛伐克克朗"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"塞拉利昂利昂"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"索马里先令"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"苏里南元"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"苏里南盾"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"南苏丹镑"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"圣多美和普林西比多布拉 (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"圣多美和普林西比多布拉"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"苏联卢布"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"萨尔瓦多科朗"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"叙利亚镑"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"斯威士兰里兰吉尼"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"泰铢"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"塔吉克斯坦卢布"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"塔吉克斯坦索莫尼"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"土库曼斯坦马纳特 (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"土库曼斯坦马纳特"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"突尼斯第纳尔"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"汤加潘加"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"帝汶埃斯库多"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"土耳其里拉 (1922–2005)"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"土耳其里拉"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"特立尼达和多巴哥元"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"新台币"},"symbol":"NT$","narrow":"NT$"},"TZS":{"displayName":{"other":"坦桑尼亚先令"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"乌克兰格里夫纳"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"乌克兰币"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"乌干达先令 (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"乌干达先令"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"美元"},"symbol":"US$","narrow":"$"},"USN":{"displayName":{"other":"美元（次日）"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"美元（当日）"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"乌拉圭比索（索引单位）"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"乌拉圭比索 (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"乌拉圭比索"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"乌拉圭票面工资指数单位"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"乌兹别克斯坦苏姆"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"委内瑞拉玻利瓦尔 (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"委内瑞拉玻利瓦尔 (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"委内瑞拉玻利瓦尔"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"越南盾"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"越南盾 (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"瓦努阿图瓦图"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"萨摩亚塔拉"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"中非法郎"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"银"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"黄金"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"欧洲复合单位"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"欧洲货币联盟"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"欧洲计算单位 (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"欧洲计算单位 (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"东加勒比元"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"特别提款权"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"欧洲货币单位"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"法国金法郎"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"法国法郎 (UIC)"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"西非法郎"},"symbol":"CFA","narrow":"CFA"},"XPD":{"displayName":{"other":"钯"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"太平洋法郎"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"铂"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET 基金"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"苏克雷"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"测试货币代码"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"非洲开发银行记账单位"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"（未知货币）"},"symbol":"XXX","narrow":"XXX"},"YDD":{"displayName":{"other":"也门第纳尔"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"也门里亚尔"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"南斯拉夫硬第纳尔 (1966–1990)"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"南斯拉夫新第纳尔 (1994–2002)"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"南斯拉夫可兑换第纳尔 (1990–1992)"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"南斯拉夫改良第纳尔 (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"南非兰特 (金融)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"南非兰特"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"赞比亚克瓦查 (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"赞比亚克瓦查"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"新扎伊尔 (1993–1998)"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"扎伊尔 (1971–1993)"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"津巴布韦元 (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"津巴布韦元 (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"津巴布韦元 (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"long":{"1000":{"other":"0"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0亿"},"1000000000":{"other":"00亿"},"10000000000":{"other":"000亿"},"100000000000":{"other":"0000亿"},"1000000000000":{"other":"0万亿"},"10000000000000":{"other":"00万亿"},"100000000000000":{"other":"000万亿"}},"short":{"1000":{"other":"0"},"10000":{"other":"0万"},"100000":{"other":"00万"},"1000000":{"other":"000万"},"10000000":{"other":"0000万"},"100000000":{"other":"0亿"},"1000000000":{"other":"00亿"},"10000000000":{"other":"000亿"},"100000000000":{"other":"0000亿"},"1000000000000":{"other":"0万亿"},"10000000000000":{"other":"00万亿"},"100000000000000":{"other":"000万亿"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0}{1}","short":{"1000":{"other":"0"},"10000":{"other":"¤0万"},"100000":{"other":"¤00万"},"1000000":{"other":"¤000万"},"10000000":{"other":"¤0000万"},"100000000":{"other":"¤0亿"},"1000000000":{"other":"¤00亿"},"10000000000":{"other":"¤000亿"},"100000000000":{"other":"¤0000亿"},"1000000000000":{"other":"¤0万亿"},"10000000000000":{"other":"¤00万亿"},"100000000000000":{"other":"¤000万亿"}}}}},"nu":["latn"]}},"availableLocales":["zh-Hans"],"aliases":{"zh-CN":"zh-Hans-CN","zh-guoyu":"zh","zh-hakka":"hak","zh-HK":"zh-Hant-HK","zh-min-nan":"nan","zh-MO":"zh-Hant-MO","zh-SG":"zh-Hans-SG","zh-TW":"zh-Hant-TW","zh-xiang":"hsn","zh-min":"nan-x-zh-min"},"parentLocales":{"zh-Hant-MO":"zh-Hant-HK"}});
    }

})));
//# sourceMappingURL=polyfill-with-locales.js.map
