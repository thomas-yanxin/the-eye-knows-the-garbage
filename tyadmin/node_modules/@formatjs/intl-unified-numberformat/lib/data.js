var __extends = (this && this.__extends) || (function () {
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
import { InternalSlotToken, } from '@formatjs/intl-utils';
function invariant(condition, message, Err) {
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
export function extractILD(units, currencies, numbers, numberingSystem) {
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
                invariant(!!this._unit, 'unit must be supplied');
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
                invariant(!!this._currency, 'currency must be supplied');
                invariant(!!this.currencySign, 'currencySign must be supplied');
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
export { Patterns };
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
    invariant(!!patterns, 'Pattern should have existed');
    var _a = patterns.split(';'), positivePattern = _a[0], negativePattern = _a[1];
    invariant(!!negativePattern, "negativePattern should have existed but got \"" + patterns + "\"");
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
    __extends(DecimalPatterns, _super);
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
            invariant(!!this.signDisplay, 'Sign Display should have existed');
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
                invariant(!!this.signDisplay, 'Sign Display should have existed');
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
                invariant(!!this.signDisplay, 'Sign Display should have existed');
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
    __extends(PercentPatterns, _super);
    function PercentPatterns() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentPatterns.prototype.generateStandardOrScientificPattern = function (isScientific) {
        invariant(!!this.signDisplay, 'Sign Display should have existed');
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
    __extends(UnitPatterns, _super);
    function UnitPatterns(units, numbers, numberingSystem, unit) {
        var _this = _super.call(this) || this;
        _this.unit = unit;
        _this.units = units;
        _this.numbers = numbers;
        _this.numberingSystem = numberingSystem;
        return _this;
    }
    UnitPatterns.prototype.generateStandardOrScientificPattern = function (isScientific) {
        invariant(!!this.signDisplay, 'Sign Display should have existed');
        invariant(!!this.pattern, 'Pattern must exist');
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
            invariant(!!this.pattern, 'Pattern should exist');
            invariant(!!this.signDisplay, 'Sign Display should exist');
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
                invariant(!!this.currencySign, 'Currency Sign should have existed');
                invariant(!!this.currencySlotToken, 'Currency Slot Token should have existed');
                invariant(!!this.resolvedCurrency, 'Currency should have been resolved');
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
                invariant(!!this.currencySign, 'Currency Sign should have existed');
                invariant(!!this.currencySlotToken, 'Currency Display should have existed');
                invariant(!!this.resolvedCurrency, 'Currency should have been resolved');
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
    __extends(CurrencySignDisplayPatterns, _super);
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
                invariant(!!this.currencySign, 'Currency sign should exist');
                invariant(!!this.signDisplay, 'Sign display must exist');
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
                invariant(!!this.currencySign, 'Currency sign should exist');
                invariant(!!this.signDisplay, 'Sign display must exist');
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
            invariant(!!this.currencySign, 'Currency sign should exist');
            invariant(!!this.signDisplay, 'Sign display must exist');
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
//# sourceMappingURL=data.js.map