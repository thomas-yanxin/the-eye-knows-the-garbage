import { LDMLPluralRule } from './plural-rules-types';
import { LocaleData } from './types';
export declare type NumberFormatNotation = 'standard' | 'scientific' | 'engineering' | 'compact';
export declare type NumberFormatRoundingType = 'significantDigits' | 'fractionDigits' | 'compactRounding';
export interface NumberFormatDigitOptions {
    minimumIntegerDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
}
export interface NumberFormatDigitInternalSlots {
    minimumIntegerDigits: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
    roundingType: NumberFormatRoundingType;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: NumberFormatNotation;
}
export declare enum InternalSlotToken {
    compactName = "compactName",
    compactSymbol = "compactSymbol",
    currencyCode = "currencyCode",
    currencyName = "currencyName",
    currencyNarrowSymbol = "currencyNarrowSymbol",
    currencySymbol = "currencySymbol",
    minusSign = "minusSign",
    number = "number",
    percentSign = "percentSign",
    plusSign = "plusSign",
    scientificExponent = "scientificExponent",
    scientificSeparator = "scientificSeparator",
    unitName = "unitName",
    unitNarrowSymbol = "unitNarrowSymbol",
    unitSymbol = "unitSymbol"
}
export interface SignPattern {
    positivePattern: string;
    zeroPattern: string;
    negativePattern: string;
}
export declare type CompactSignPattern = Record<DecimalFormatNum, SignPattern>;
export interface NotationPattern {
    standard: SignPattern;
    scientific: SignPattern;
    compactShort: CompactSignPattern;
    compactLong: CompactSignPattern;
}
export interface SignDisplayPattern {
    auto: NotationPattern;
    always: NotationPattern;
    never: NotationPattern;
    exceptZero: NotationPattern;
}
export interface CurrencySignPattern {
    standard: SignDisplayPattern;
    accounting: SignDisplayPattern;
}
export interface CurrencyPattern {
    code: CurrencySignPattern;
    symbol: CurrencySignPattern;
    narrowSymbol: CurrencySignPattern;
    name: CurrencySignPattern;
}
export interface UnitPattern {
    narrow: SignDisplayPattern;
    short: SignDisplayPattern;
    long: SignDisplayPattern;
}
export interface NumberILD {
    decimal: {
        compactShort?: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
        compactLong?: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
    };
    currency: {
        compactShort?: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
        compactLong?: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
    };
    symbols: {
        decimal: string;
        group: string;
        list: string;
        percentSign: string;
        plusSign: string;
        minusSign: string;
        exponential: string;
        superscriptingExponent: string;
        perMille: string;
        infinity: string;
        nan: string;
        timeSeparator: string;
    };
    currencySymbols: Record<string, {
        currencySymbol: string;
        currencyNarrowSymbol: string;
        currencyName: LDMLPluralRuleMap<string>;
    }>;
    unitSymbols: Record<string, {
        unitSymbol: LDMLPluralRuleMap<string[]>;
        unitNarrowSymbol: LDMLPluralRuleMap<string[]>;
        unitName: LDMLPluralRuleMap<string[]>;
    }>;
}
export interface NumberLocalePatternData {
    decimal: SignDisplayPattern;
    percent: SignDisplayPattern;
    currency: Record<string, CurrencyPattern>;
    unit: Record<string, UnitPattern>;
}
export interface NumberInternalSlots {
    nu: string[];
    patterns: NumberLocalePatternData;
    ild: NumberILD;
}
export declare type NumberLocaleData = LocaleData<NumberInternalSlots>;
export declare type RawNumberLocaleData = LocaleData<NumberLocaleInternalData>;
export interface NumberLocaleInternalData {
    units: Record<string, UnitData>;
    currencies: Record<string, CurrencyData>;
    numbers: RawNumberData;
    nu: string[];
}
export interface UnitData {
    displayName: string;
    long: LDMLPluralRuleMap<RawUnitPattern>;
    short: LDMLPluralRuleMap<RawUnitPattern>;
    narrow: LDMLPluralRuleMap<RawUnitPattern>;
}
export interface RawUnitPattern {
    pattern: string;
    symbol: string[];
}
export interface CurrencyData {
    displayName: LDMLPluralRuleMap<string>;
    symbol: string;
    narrow: string;
}
export declare type DecimalFormatNum = '1000' | '10000' | '100000' | '1000000' | '10000000' | '100000000' | '1000000000' | '10000000000' | '100000000000' | '1000000000000' | '10000000000000' | '100000000000000';
export declare type NumberingSystem = string;
/**
 * We only care about insertBetween bc we assume
 * `currencyMatch` & `surroundingMatch` are all the same
 *
 * @export
 * @interface CurrencySpacingData
 */
export interface CurrencySpacingData {
    beforeInsertBetween: string;
    afterInsertBetween: string;
}
export interface RawCurrencyData {
    currencySpacing: CurrencySpacingData;
    standard: string;
    accounting: string;
    short?: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
    unitPattern: string;
}
export interface SymbolsData {
    decimal: string;
    group: string;
    list: string;
    percentSign: string;
    plusSign: string;
    minusSign: string;
    exponential: string;
    superscriptingExponent: string;
    perMille: string;
    infinity: string;
    nan: string;
    timeSeparator: string;
}
export interface RawNumberData {
    nu: string[];
    symbols: Record<NumberingSystem, SymbolsData>;
    decimal: Record<NumberingSystem, {
        long: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
        short: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
    }>;
    percent: Record<NumberingSystem, string>;
    currency: Record<NumberingSystem, RawCurrencyData>;
}
export declare type LDMLPluralRuleMap<T> = Omit<Partial<Record<LDMLPluralRule, T>>, 'other'> & {
    other: T;
};
//# sourceMappingURL=number-types.d.ts.map