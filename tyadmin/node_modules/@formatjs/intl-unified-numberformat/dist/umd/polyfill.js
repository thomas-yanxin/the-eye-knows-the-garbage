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
        var f = maxFraction;
        var n;
        {
            var exactSolve = x * Math.pow(10, f);
            var roundDown = Math.floor(exactSolve);
            var roundUp = Math.ceil(exactSolve);
            n = exactSolve - roundDown < roundUp - exactSolve ? roundDown : roundUp;
        }
        var xFinal = n / Math.pow(10, f);
        // n is a positive integer, but it is possible to be greater than 1e21.
        // In such case we will go the slow path.
        // See also: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
        var m;
        if (n < 1e21) {
            m = n.toString();
        }
        else {
            m = n.toString();
            var idx1 = m.indexOf('.');
            var idx2 = m.indexOf('e+');
            var exponent = parseInt(m.substring(idx2 + 2), 10);
            m =
                m.substring(0, idx1) +
                    m.substring(idx1 + 1, idx2) +
                    repeat('0', exponent - (idx2 - idx1 - 1));
        }
        var int;
        if (f !== 0) {
            var k = m.length;
            if (k <= f) {
                var z = repeat('0', f + 1 - k);
                m = z + m;
                k = f + 1;
            }
            var a = m.slice(0, k - f);
            var b = m.slice(k - f);
            m = a + "." + b;
            int = a.length;
        }
        else {
            int = m.length;
        }
        var cut = maxFraction - minFraction;
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
        var p = maxPrecision;
        var m;
        var e;
        var xFinal;
        if (x === 0) {
            m = repeat('0', p);
            e = 0;
            xFinal = 0;
        }
        else {
            e = getMagnitude(x);
            var n = void 0;
            {
                var magnitude = e - p + 1;
                var exactSolve = 
                // Preserve floating point precision as much as possible with multiplication.
                magnitude < 0 ? x * Math.pow(10, -magnitude) : x / Math.pow(10, magnitude);
                var roundDown = Math.floor(exactSolve);
                var roundUp = Math.ceil(exactSolve);
                n = exactSolve - roundDown < roundUp - exactSolve ? roundDown : roundUp;
            }
            // See: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
            // No need to worry about scientific notation because it only happens for values >= 1e21,
            // which has 22 significant digits. So it will at least be divided by 10 here to bring the
            // value back into non-scientific-notation range.
            m = n.toString();
            xFinal = n * Math.pow(10, (e - p + 1));
        }
        var int;
        if (e >= p - 1) {
            m = m + repeat('0', e - p + 1);
            int = e + 1;
        }
        else if (e >= 0) {
            m = m.slice(0, e + 1) + "." + m.slice(e + 1);
            int = e + 1;
        }
        else {
            m = "0." + repeat('0', -e - 1) + m;
            int = 1;
        }
        if (m.indexOf('.') >= 0 && maxPrecision > minPrecision) {
            var cut = maxPrecision - minPrecision;
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
        var arr = new Array(times);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = s;
        }
        return arr.join('');
    }

    var __extends$1 = (undefined && undefined.__extends) || (function () {
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
    function invariant$1(condition, message, Err) {
        if (Err === void 0) { Err = Error; }
        if (!condition) {
            throw new Err(message);
        }
    }
    // This is from: unicode-12.1.0/General_Category/Symbol/regex.js
    var S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B98-\u2BFF\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD6C\uDD70-\uDDAC\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED5\uDEE0-\uDEEC\uDEF0-\uDEFA\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD0D-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95]/;
    // g flag bc this appears twice in accounting pattern
    var CURRENCY_SYMBOL_REGEX = /¤/g;
    // Instead of doing just replace '{1}' we use global regex
    // since this can appear more than once (e.g {1} {number} {1})
    var UNIT_1_REGEX = /\{1\}/g;
    var UNIT_0_REGEX = /\{0\}/g;
    function extractDecimalFormatILD(data) {
        if (!data) {
            return;
        }
        return Object.keys(data).reduce(function (all, num) {
            var pattern = data[num];
            all[num] = Object.keys(pattern).reduce(function (all, p) {
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
        return Object.keys(m).reduce(function (all, rule) {
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
            currencySymbols: Object.keys(currencies).reduce(function (all, code) {
                all[code] = {
                    currencyName: currencies[code].displayName,
                    currencySymbol: currencies[code].symbol,
                    currencyNarrowSymbol: currencies[code].narrow || currencies[code].symbol,
                };
                return all;
            }, Object.create(null)),
            unitSymbols: Object.keys(units).reduce(function (all, unit) {
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
            return tokens.map(function (t) { return "{" + t + "}"; }).join('');
        return "{" + tokens + "}";
    }
    // Credit: https://github.com/andyearnshaw/Intl.js/blob/master/scripts/utils/reduce.js
    // Matches CLDR number patterns, e.g. #,##0.00, #,##,##0.00, #,##0.##, 0, etc.
    var NUMBER_PATTERN = /[#0](?:[\.,][#0]+)*/g;
    var SCIENTIFIC_POSITIVE_PATTERN = serializeSlotTokens([
        InternalSlotToken.number,
        InternalSlotToken.scientificSeparator,
        InternalSlotToken.scientificExponent,
    ]);
    var SCIENTIFIC_NEGATIVE_PATTERN = serializeSlotTokens([
        InternalSlotToken.minusSign,
        InternalSlotToken.number,
        InternalSlotToken.scientificSeparator,
        InternalSlotToken.scientificExponent,
    ]);
    var DUMMY_POSITIVE_PATTERN = serializeSlotTokens([InternalSlotToken.number]);
    var DUMMY_NEGATIVE_PATTERN = serializeSlotTokens([
        InternalSlotToken.minusSign,
        InternalSlotToken.number,
    ]);
    var DUMMY_PATTERN = DUMMY_POSITIVE_PATTERN + ';' + DUMMY_NEGATIVE_PATTERN;
    var SCIENTIFIC_PATTERN = SCIENTIFIC_POSITIVE_PATTERN + ';' + SCIENTIFIC_NEGATIVE_PATTERN;
    /**
     * Turn compact pattern like `0 trillion` to
     * `0 {compactSymbol};-0 {compactSymbol}`.
     * Negative pattern will not be inserted if there already
     * exist one.
     * TODO: Maybe preprocess this
     * @param pattern decimal long/short pattern
     */
    function processDecimalCompactSymbol(pattern, slotToken) {
        if (slotToken === void 0) { slotToken = InternalSlotToken.compactSymbol; }
        var compactUnit = pattern.replace(/0+/, '').trim();
        if (compactUnit) {
            pattern = pattern.replace(compactUnit, serializeSlotTokens(slotToken));
        }
        var negativePattern = pattern.indexOf('-') > -1 ? pattern : pattern.replace(/(0+)/, '-$1');
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
    function processCurrencyCompactSymbol(pattern, slotToken) {
        if (slotToken === void 0) { slotToken = InternalSlotToken.compactSymbol; }
        var compactUnit = pattern.replace(/[¤0]/g, '').trim();
        if (compactUnit) {
            pattern = pattern.replace(compactUnit, serializeSlotTokens(slotToken));
        }
        var negativePattern = pattern.indexOf('-') > -1 ? pattern : "-" + pattern;
        return (pattern.replace(/0+/, '{number}') +
            ';' +
            negativePattern.replace(/0+/, '{number}'));
    }
    var INSERT_BEFORE_PATTERN_REGEX = /[^\s;(-]¤/;
    var INSERT_AFTER_PATTERN_REGEX = /¤[^\s);]/;
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
            return pattern.replace(CURRENCY_SYMBOL_REGEX, "\u00A4" + insertBetweenChar);
        }
        // Check beforeCurrency
        if (shouldInsertBefore(currency, pattern)) {
            return pattern.replace(CURRENCY_SYMBOL_REGEX, insertBetweenChar + "\u00A4");
        }
        return pattern;
    }
    var Patterns = /** @class */ (function () {
        function Patterns(units, currencies, numbers, numberingSystem, unit, currency, currencySign) {
            this.units = units;
            this.currencies = currencies;
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
            this._unit = unit;
            this._currency = currency;
            this.currencySign = currencySign;
        }
        Object.defineProperty(Patterns.prototype, "decimal", {
            // Style
            get: function () {
                if (!this.decimalPatterns) {
                    this.decimalPatterns = new DecimalPatterns(this.numbers, this.numberingSystem);
                }
                return this.decimalPatterns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Patterns.prototype, "percent", {
            get: function () {
                if (!this.percentPatterns) {
                    this.percentPatterns = new PercentPatterns(this.numbers, this.numberingSystem);
                }
                return this.percentPatterns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Patterns.prototype, "unit", {
            get: function () {
                if (!this.unitPatterns) {
                    invariant$1(!!this._unit, 'unit must be supplied');
                    this.unitPatterns = Object.create(null);
                    this.unitPatterns[this._unit] = new UnitPatterns(this.units, this.numbers, this.numberingSystem, this._unit);
                }
                return this.unitPatterns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Patterns.prototype, "currency", {
            get: function () {
                if (!this.currencyPatterns) {
                    invariant$1(!!this._currency, 'currency must be supplied');
                    invariant$1(!!this.currencySign, 'currencySign must be supplied');
                    this.currencyPatterns = Object.create(null);
                    this.currencyPatterns[this._currency] = new CurrencyPatterns(this.currencies, this.numbers, this.numberingSystem, this._currency, this.currencySign);
                }
                return this.currencyPatterns;
            },
            enumerable: true,
            configurable: true
        });
        return Patterns;
    }());
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
        var _a = patterns.split(';'), positivePattern = _a[0], negativePattern = _a[1];
        invariant$1(!!negativePattern, "negativePattern should have existed but got \"" + patterns + "\"");
        var noSignPattern = positivePattern.replace('+', '');
        negativePattern = negativePattern.replace('-', serializeSlotTokens(InternalSlotToken.minusSign));
        var alwaysPositivePattern = positivePattern;
        if (negativePattern.indexOf(InternalSlotToken.minusSign) > -1) {
            alwaysPositivePattern = negativePattern.replace(InternalSlotToken.minusSign, InternalSlotToken.plusSign);
        }
        else if (positivePattern.indexOf('+') > -1) {
            alwaysPositivePattern = positivePattern = positivePattern.replace('+', serializeSlotTokens(InternalSlotToken.plusSign));
        }
        else {
            // In case {0} is in the middle of the pattern
            alwaysPositivePattern = "" + serializeSlotTokens(InternalSlotToken.plusSign) + noSignPattern;
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
                    negativePattern: negativePattern,
                };
            case 'auto':
                return {
                    positivePattern: positivePattern,
                    zeroPattern: positivePattern,
                    negativePattern: negativePattern,
                };
            case 'exceptZero':
                return {
                    positivePattern: alwaysPositivePattern,
                    zeroPattern: noSignPattern,
                    negativePattern: negativePattern,
                };
            case 'never':
                return {
                    positivePattern: noSignPattern,
                    zeroPattern: noSignPattern,
                    negativePattern: noSignPattern,
                };
        }
    }
    var NotationPatterns = /** @class */ (function () {
        function NotationPatterns() {
        }
        Object.defineProperty(NotationPatterns.prototype, "compactShort", {
            get: function () {
                this.notation = 'compactShort';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, "compactLong", {
            get: function () {
                this.notation = 'compactLong';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '1000', {
            // DecimalFormatNum
            get: function () {
                return this.produceCompactSignPattern('1000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '10000', {
            get: function () {
                return this.produceCompactSignPattern('10000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '100000', {
            get: function () {
                return this.produceCompactSignPattern('100000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '1000000', {
            get: function () {
                return this.produceCompactSignPattern('1000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '10000000', {
            get: function () {
                return this.produceCompactSignPattern('10000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '100000000', {
            get: function () {
                return this.produceCompactSignPattern('100000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '1000000000', {
            get: function () {
                return this.produceCompactSignPattern('1000000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '10000000000', {
            get: function () {
                return this.produceCompactSignPattern('10000000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '100000000000', {
            get: function () {
                return this.produceCompactSignPattern('100000000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '1000000000000', {
            get: function () {
                return this.produceCompactSignPattern('1000000000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '10000000000000', {
            get: function () {
                return this.produceCompactSignPattern('10000000000000');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NotationPatterns.prototype, '100000000000000', {
            get: function () {
                return this.produceCompactSignPattern('100000000000000');
            },
            enumerable: true,
            configurable: true
        });
        return NotationPatterns;
    }());
    var DecimalPatterns = /** @class */ (function (_super) {
        __extends$1(DecimalPatterns, _super);
        function DecimalPatterns(numbers, numberingSystem) {
            var _this = _super.call(this) || this;
            _this.numbers = numbers;
            _this.numberingSystem = numberingSystem;
            return _this;
        }
        DecimalPatterns.prototype.produceCompactSignPattern = function (decimalNum) {
            if (!this.compactSignPattern) {
                this.compactSignPattern = Object.create(null);
            }
            var signPattern = this.compactSignPattern;
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
        };
        Object.defineProperty(DecimalPatterns.prototype, "always", {
            // Sign Display
            get: function () {
                this.signDisplay = 'always';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecimalPatterns.prototype, "auto", {
            get: function () {
                this.signDisplay = 'auto';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecimalPatterns.prototype, "never", {
            get: function () {
                this.signDisplay = 'never';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecimalPatterns.prototype, "exceptZero", {
            get: function () {
                this.signDisplay = 'exceptZero';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecimalPatterns.prototype, "standard", {
            // Notation
            get: function () {
                if (!this.signPattern) {
                    invariant$1(!!this.signDisplay, 'Sign Display should have existed');
                    this.signPattern = produceSignPattern(DUMMY_PATTERN, this.signDisplay);
                }
                return this.signPattern;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecimalPatterns.prototype, "scientific", {
            get: function () {
                if (!this.signPattern) {
                    invariant$1(!!this.signDisplay, 'Sign Display should have existed');
                    this.signPattern = produceSignPattern(SCIENTIFIC_PATTERN, this.signDisplay);
                }
                return this.signPattern;
            },
            enumerable: true,
            configurable: true
        });
        return DecimalPatterns;
    }(NotationPatterns));
    var PercentPatterns = /** @class */ (function (_super) {
        __extends$1(PercentPatterns, _super);
        function PercentPatterns() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PercentPatterns.prototype.generateStandardOrScientificPattern = function (isScientific) {
            invariant$1(!!this.signDisplay, 'Sign Display should have existed');
            var pattern = this.numbers.percent[this.numberingSystem]
                .replace(/%/g, serializeSlotTokens(InternalSlotToken.percentSign))
                .replace(NUMBER_PATTERN, isScientific
                ? SCIENTIFIC_POSITIVE_PATTERN
                : serializeSlotTokens(InternalSlotToken.number));
            var negativePattern;
            if (pattern.indexOf(';') < 0) {
                negativePattern = "" + serializeSlotTokens(InternalSlotToken.minusSign) + pattern;
                pattern += ';' + negativePattern;
            }
            return produceSignPattern(pattern, this.signDisplay);
        };
        Object.defineProperty(PercentPatterns.prototype, "standard", {
            // Notation
            get: function () {
                if (!this.signPattern) {
                    this.signPattern = this.generateStandardOrScientificPattern();
                }
                return this.signPattern;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PercentPatterns.prototype, "scientific", {
            get: function () {
                if (!this.signPattern) {
                    this.signPattern = this.generateStandardOrScientificPattern(true);
                }
                return this.signPattern;
            },
            enumerable: true,
            configurable: true
        });
        return PercentPatterns;
    }(DecimalPatterns));
    var UnitPatterns = /** @class */ (function (_super) {
        __extends$1(UnitPatterns, _super);
        function UnitPatterns(units, numbers, numberingSystem, unit) {
            var _this = _super.call(this) || this;
            _this.unit = unit;
            _this.units = units;
            _this.numbers = numbers;
            _this.numberingSystem = numberingSystem;
            return _this;
        }
        UnitPatterns.prototype.generateStandardOrScientificPattern = function (isScientific) {
            invariant$1(!!this.signDisplay, 'Sign Display should have existed');
            invariant$1(!!this.pattern, 'Pattern must exist');
            var pattern = this.pattern;
            var negativePattern;
            if (pattern.indexOf(';') < 0) {
                negativePattern = pattern.replace('{0}', '-{0}');
                pattern += ';' + negativePattern;
            }
            pattern = pattern.replace(UNIT_0_REGEX, isScientific
                ? SCIENTIFIC_POSITIVE_PATTERN
                : serializeSlotTokens(InternalSlotToken.number));
            return produceSignPattern(pattern, this.signDisplay);
        };
        UnitPatterns.prototype.produceCompactSignPattern = function (decimalNum) {
            if (!this.compactSignPattern) {
                this.compactSignPattern = Object.create(null);
            }
            var compactSignPatterns = this.compactSignPattern;
            if (!compactSignPatterns[decimalNum]) {
                invariant$1(!!this.pattern, 'Pattern should exist');
                invariant$1(!!this.signDisplay, 'Sign Display should exist');
                var pattern = this.pattern;
                var compactPattern = void 0;
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
        };
        Object.defineProperty(UnitPatterns.prototype, "narrow", {
            // UnitDisplay
            get: function () {
                if (!this.pattern) {
                    this.pattern = this.units[this.unit].narrow.other.pattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.unitNarrowSymbol));
                }
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "short", {
            get: function () {
                if (!this.pattern) {
                    this.pattern = this.units[this.unit].short.other.pattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.unitSymbol));
                }
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "long", {
            get: function () {
                if (!this.pattern) {
                    this.pattern = this.units[this.unit].long.other.pattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.unitName));
                }
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "always", {
            // Sign Display
            get: function () {
                this.signDisplay = 'always';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "auto", {
            get: function () {
                this.signDisplay = 'auto';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "never", {
            get: function () {
                this.signDisplay = 'never';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "exceptZero", {
            get: function () {
                this.signDisplay = 'exceptZero';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "standard", {
            // Notation
            get: function () {
                if (!this.signPattern) {
                    this.signPattern = this.generateStandardOrScientificPattern();
                }
                return this.signPattern;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnitPatterns.prototype, "scientific", {
            get: function () {
                if (!this.signPattern) {
                    this.signPattern = this.generateStandardOrScientificPattern(true);
                }
                return this.signPattern;
            },
            enumerable: true,
            configurable: true
        });
        return UnitPatterns;
    }(NotationPatterns));
    function resolvePatternForCurrencyCode(resolvedCurrency, data, notation, currencySign, decimalNum) {
        var shortPattern = data.short;
        var longPattern = data.long || data.short;
        var pattern = '';
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
                    pattern += ';' + ("-" + pattern);
                }
                return pattern.replace(NUMBER_PATTERN, SCIENTIFIC_POSITIVE_PATTERN);
            case 'standard':
                pattern = currencySign === 'accounting' ? data.accounting : data.standard;
                pattern = insertBetween(resolvedCurrency, pattern, data.currencySpacing.beforeInsertBetween);
                if (pattern.indexOf(';') < 0) {
                    pattern += ';' + ("-" + pattern);
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
        var pattern = numbers.currency[numberingSystem].unitPattern.replace(UNIT_1_REGEX, serializeSlotTokens(InternalSlotToken.currencyName));
        var numberPattern;
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
    var CurrencyPatterns = /** @class */ (function () {
        function CurrencyPatterns(currencies, numbers, numberingSystem, currency, currencySign) {
            this.currency = currency;
            this.currencies = currencies;
            this.numbers = numbers;
            this.numberingSystem = numberingSystem;
            this.currencySign = currencySign;
        }
        Object.defineProperty(CurrencyPatterns.prototype, "code", {
            // CurrencyDisplay
            get: function () {
                this.currencySlotToken = InternalSlotToken.currencyCode;
                this.resolvedCurrency = this.currency;
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencyPatterns.prototype, "symbol", {
            get: function () {
                this.currencySlotToken = InternalSlotToken.currencySymbol;
                this.resolvedCurrency = this.currencies[this.currency].symbol;
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencyPatterns.prototype, "narrowSymbol", {
            get: function () {
                this.currencySlotToken = InternalSlotToken.currencyNarrowSymbol;
                this.resolvedCurrency = this.currencies[this.currency].narrow;
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencyPatterns.prototype, "name", {
            get: function () {
                this.currencySlotToken = InternalSlotToken.currencyName;
                this.resolvedCurrency = this.currencies[this.currency].displayName.other;
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencyPatterns.prototype, "accounting", {
            // CurrencySign
            get: function () {
                this.currencySign = 'accounting';
                if (!this.signDisplayPatterns) {
                    invariant$1(!!this.currencySign, 'Currency Sign should have existed');
                    invariant$1(!!this.currencySlotToken, 'Currency Slot Token should have existed');
                    invariant$1(!!this.resolvedCurrency, 'Currency should have been resolved');
                    this.signDisplayPatterns = new CurrencySignDisplayPatterns(this.resolvedCurrency, this.numbers, this.numberingSystem, this.currencySign, this.currencySlotToken);
                }
                return this.signDisplayPatterns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencyPatterns.prototype, "standard", {
            get: function () {
                this.currencySign = 'standard';
                if (!this.signDisplayPatterns) {
                    invariant$1(!!this.currencySign, 'Currency Sign should have existed');
                    invariant$1(!!this.currencySlotToken, 'Currency Display should have existed');
                    invariant$1(!!this.resolvedCurrency, 'Currency should have been resolved');
                    this.signDisplayPatterns = new CurrencySignDisplayPatterns(this.resolvedCurrency, this.numbers, this.numberingSystem, this.currencySign, this.currencySlotToken);
                }
                return this.signDisplayPatterns;
            },
            enumerable: true,
            configurable: true
        });
        return CurrencyPatterns;
    }());
    var CurrencySignDisplayPatterns = /** @class */ (function (_super) {
        __extends$1(CurrencySignDisplayPatterns, _super);
        function CurrencySignDisplayPatterns(resolvedCurrency, numbers, numberingSystem, currencySign, currencySlotToken) {
            var _this = _super.call(this) || this;
            _this.currency = resolvedCurrency;
            _this.numbers = numbers;
            _this.numberingSystem = numberingSystem;
            _this.currencySign = currencySign;
            _this.currencySlotToken = currencySlotToken;
            return _this;
        }
        Object.defineProperty(CurrencySignDisplayPatterns.prototype, "always", {
            // Sign Display
            get: function () {
                this.signDisplay = 'always';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencySignDisplayPatterns.prototype, "auto", {
            get: function () {
                this.signDisplay = 'auto';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencySignDisplayPatterns.prototype, "never", {
            get: function () {
                this.signDisplay = 'never';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencySignDisplayPatterns.prototype, "exceptZero", {
            get: function () {
                this.signDisplay = 'exceptZero';
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencySignDisplayPatterns.prototype, "standard", {
            // Notation
            // Standard currency sign
            get: function () {
                if (!this.signPattern) {
                    invariant$1(!!this.currencySign, 'Currency sign should exist');
                    invariant$1(!!this.signDisplay, 'Sign display must exist');
                    var pattern = '';
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrencySignDisplayPatterns.prototype, "scientific", {
            get: function () {
                if (!this.signPattern) {
                    invariant$1(!!this.currencySign, 'Currency sign should exist');
                    invariant$1(!!this.signDisplay, 'Sign display must exist');
                    var pattern = '';
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
            },
            enumerable: true,
            configurable: true
        });
        CurrencySignDisplayPatterns.prototype.produceCompactSignPattern = function (decimalNum) {
            if (!this.compactSignPattern) {
                this.compactSignPattern = Object.create(null);
            }
            var compactSignPatterns = this.compactSignPattern;
            if (!compactSignPatterns[decimalNum]) {
                invariant$1(!!this.currencySign, 'Currency sign should exist');
                invariant$1(!!this.signDisplay, 'Sign display must exist');
                var pattern = '';
                // name -> standard -> compact -> compactLong
                // name -> accounting -> compact -> compactShort
                if (this.currencySlotToken === InternalSlotToken.currencyName) {
                    pattern = resolvePatternForCurrencyName(this.numbers, this.numberingSystem, this.notation, decimalNum);
                }
                else {
                    pattern = resolvePatternForCurrencyCode(this.currency, this.numbers.currency[this.numberingSystem], this.notation, this.currencySign, decimalNum).replace(CURRENCY_SYMBOL_REGEX, serializeSlotTokens(this.currencySlotToken));
                }
                compactSignPatterns[decimalNum] = processSignPattern(produceSignPattern(pattern, this.signDisplay), function (pattern) { return pattern.replace(/0+/, '{number}'); });
            }
            return compactSignPatterns[decimalNum];
        };
        return CurrencySignDisplayPatterns;
    }(NotationPatterns));

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

    var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
    var VALID_NUMBERING_SYSTEM_NAMES = Object.create(null);
    for (var _i = 0, numberingSystemNames_1 = names; _i < numberingSystemNames_1.length; _i++) {
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
    function isUnitSupported(unit) {
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
    function currencyDigits$1(c) {
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
            var cDigits = currencyDigits$1(currency);
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
    var UnifiedNumberFormat = function NumberFormat(locales, options) {
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

    if (!isUnitSupported('bit')) {
        Intl.NumberFormat = UnifiedNumberFormat;
    }

})));
//# sourceMappingURL=polyfill.js.map
