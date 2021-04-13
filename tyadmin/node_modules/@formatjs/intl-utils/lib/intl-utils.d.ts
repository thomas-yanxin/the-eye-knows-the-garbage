
export declare type CompactSignPattern = Record<DecimalFormatNum, SignPattern>;

export declare function createResolveLocale<K extends string, D extends {
    [k in K]: any;
}>(getDefaultLocale: () => string): (availableLocales: string[], requestedLocales: string[], options: {
    [k: string]: string;
    localeMatcher: string;
}, relevantExtensionKeys: K[], localeData: Record<string, D>) => ResolveLocaleResult;

declare type CurrencyCode = string;

export declare interface CurrencyData {
    displayName: LDMLPluralRuleMap<string>;
    symbol: string;
    narrow: string;
}

export declare interface CurrencyPattern {
    code: CurrencySignPattern;
    symbol: CurrencySignPattern;
    narrowSymbol: CurrencySignPattern;
    name: CurrencySignPattern;
}

export declare interface CurrencySignPattern {
    standard: SignDisplayPattern;
    accounting: SignDisplayPattern;
}

/**
 * We only care about insertBetween bc we assume
 * `currencyMatch` & `surroundingMatch` are all the same
 *
 * @export
 * @interface CurrencySpacingData
 */
export declare interface CurrencySpacingData {
    beforeInsertBetween: string;
    afterInsertBetween: string;
}

export declare type DecimalFormatNum = '1000' | '10000' | '100000' | '1000000' | '10000000' | '100000000' | '1000000000' | '10000000000' | '100000000000' | '1000000000000' | '10000000000000' | '100000000000000';

/**
 * https://tc39.es/ecma402/#sec-defaultnumberoption
 * @param val
 * @param min
 * @param max
 * @param fallback
 */
export declare function defaultNumberOption(val: any, min: number, max: number, fallback: number): number;

export declare interface DisplayNamesData {
    /**
     * Note that for style fields, `short` and `narrow` might not exist.
     * At runtime, the fallback order will be narrow -> short -> long.
     */
    types: {
        /**
         * Maps language subtag like `zh-CN` to their display names.
         */
        language: {
            narrow: Record<LanguageTag, string>;
            short: Record<LanguageTag, string>;
            long: Record<LanguageTag, string>;
        };
        region: {
            narrow: Record<RegionCode, string>;
            short: Record<RegionCode, string>;
            long: Record<RegionCode, string>;
        };
        script: {
            narrow: Record<ScriptCode, string>;
            short: Record<ScriptCode, string>;
            long: Record<ScriptCode, string>;
        };
        currency: {
            narrow: Record<CurrencyCode, string>;
            short: Record<CurrencyCode, string>;
            long: Record<CurrencyCode, string>;
        };
    };
    /**
     * Not in spec, but we need this to display both language and region in display name.
     * e.g. zh-Hans-SG + "{0}（{1}）" -> 简体中文（新加坡）
     * Here {0} is replaced by language display name and {1} is replaced by region display name.
     */
    patterns: {
        locale: string;
    };
}

export declare type DisplayNamesLocaleData = LocaleData<DisplayNamesData>;

export declare interface FieldData {
    '0'?: string;
    '1'?: string;
    '-1'?: string;
    '2'?: string;
    '-2'?: string;
    '3'?: string;
    '-3'?: string;
    future: RelativeTimeData;
    past: RelativeTimeData;
}

export declare function getAliasesByLang(lang: string): Record<string, string>;

/**
 * IE11-safe version of getCanonicalLocales since it's ES2016
 * @param locales locales
 */
export declare function getCanonicalLocales(locales?: string | string[]): string[];

export declare function getInternalSlot<Instance extends object, Internal extends object, Field extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, field: Field): Internal[Field];

export declare function getLocaleHierarchy(locale: string, aliases: Record<string, string>, parentLocales: Record<string, string>): string[];

export declare function getMultiInternalSlots<Instance extends object, Internal extends object, Field extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, ...fields: Field[]): Pick<Internal, Field>;

/**
 * https://tc39.es/ecma402/#sec-getnumberoption
 * @param options
 * @param property
 * @param min
 * @param max
 * @param fallback
 */
export declare function getNumberOption<T extends object, K extends keyof T>(options: T, property: K, minimum: number, maximum: number, fallback: number): number;

/**
 * https://tc39.es/ecma402/#sec-getoption
 * @param opts
 * @param prop
 * @param type
 * @param values
 * @param fallback
 */
export declare function getOption<T extends object, K extends keyof T, F>(opts: T, prop: K, type: 'string' | 'boolean', values: T[K][] | undefined, fallback: F): Exclude<T[K], undefined> | F;

export declare function getParentLocalesByLang(lang: string): Record<string, string>;

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

export declare function invariant(condition: boolean, message: string, Err?: any): void;

export declare function isLiteralPart(patternPart: LiteralPart | {
    type: string;
    value?: string;
}): patternPart is LiteralPart;

export declare function isMissingLocaleDataError(e: Error): e is MissingLocaleDataError;

/**
 * https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-iswellformedcurrencycode
 * @param currency
 */
export declare function isWellFormedCurrencyCode(currency: string): boolean;

declare type LanguageTag = string;

export declare type LDMLPluralRule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export declare type LDMLPluralRuleMap<T> = Omit<Partial<Record<LDMLPluralRule, T>>, 'other'> & {
    other: T;
};

export declare interface ListPattern {
    start: string;
    middle: string;
    end: string;
    pair: string;
}

export declare interface ListPatternData {
    long: ListPattern;
    short?: ListPattern;
    narrow?: ListPattern;
}

export declare interface ListPatternFieldsData {
    conjunction?: ListPatternData;
    disjunction?: ListPatternData;
    unit?: ListPatternData;
}

export declare type ListPatternLocaleData = LocaleData<ListPatternFieldsData>;

export declare interface LiteralPart {
    type: 'literal';
    value: string;
}

declare type Locale = string;

declare interface LocaleData<T> {
    data: Record<Locale, T>;
    aliases: Record<string, string>;
    availableLocales: string[];
    parentLocales: Record<string, string>;
}

export declare type LocaleFieldsData = {
    [f in RelativeTimeField]?: FieldData;
} & {
    nu?: Array<string | null>;
};

declare class MissingLocaleDataError extends Error {
    type: string;
}

export declare interface NotationPattern {
    standard: SignPattern;
    scientific: SignPattern;
    compactShort: CompactSignPattern;
    compactLong: CompactSignPattern;
}

export declare interface NumberFormatDigitInternalSlots {
    minimumIntegerDigits: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
    roundingType: NumberFormatRoundingType;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: NumberFormatNotation;
}

export declare interface NumberFormatDigitOptions {
    minimumIntegerDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
}

export declare type NumberFormatNotation = 'standard' | 'scientific' | 'engineering' | 'compact';

export declare type NumberFormatRoundingType = 'significantDigits' | 'fractionDigits' | 'compactRounding';

export declare interface NumberILD {
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

export declare type NumberingSystem = string;

export declare interface NumberInternalSlots {
    nu: string[];
    patterns: NumberLocalePatternData;
    ild: NumberILD;
}

export declare type NumberLocaleData = LocaleData<NumberInternalSlots>;

export declare interface NumberLocaleInternalData {
    units: Record<string, UnitData>;
    currencies: Record<string, CurrencyData>;
    numbers: RawNumberData;
    nu: string[];
}

export declare interface NumberLocalePatternData {
    decimal: SignDisplayPattern;
    percent: SignDisplayPattern;
    currency: Record<string, CurrencyPattern>;
    unit: Record<string, UnitPattern>;
}

export declare function objectIs(x: any, y: any): boolean;

export declare function partitionPattern(pattern: string): ({
    type: string;
    value: string;
} | {
    type: string;
    value: undefined;
})[];

export declare interface PluralRulesData {
    categories: {
        cardinal: string[];
        ordinal: string[];
    };
    fn: (val: number | string, ord?: boolean) => LDMLPluralRule;
}

export declare type PluralRulesLocaleData = LocaleData<PluralRulesData>;

export declare interface RawCurrencyData {
    currencySpacing: CurrencySpacingData;
    standard: string;
    accounting: string;
    short?: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
    unitPattern: string;
}

export declare interface RawNumberData {
    nu: string[];
    symbols: Record<NumberingSystem, SymbolsData>;
    decimal: Record<NumberingSystem, {
        long: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
        short: Record<DecimalFormatNum, LDMLPluralRuleMap<string>>;
    }>;
    percent: Record<NumberingSystem, string>;
    currency: Record<NumberingSystem, RawCurrencyData>;
}

export declare type RawNumberLocaleData = LocaleData<NumberLocaleInternalData>;

export declare interface RawUnitPattern {
    pattern: string;
    symbol: string[];
}

declare type RegionCode = string;

declare type RelativeTimeData = {
    [u in LDMLPluralRule]?: string;
};

export declare type RelativeTimeField = 'second' | 'second-short' | 'second-narrow' | 'minute' | 'minute-short' | 'minute-narrow' | 'hour' | 'hour-short' | 'hour-narrow' | 'day' | 'day-short' | 'day-narrow' | 'week' | 'week-short' | 'week-narrow' | 'month' | 'month-short' | 'month-narrow' | 'quarter' | 'quarter-short' | 'quarter-narrow' | 'year' | 'year-short' | 'year-narrow';

export declare type RelativeTimeLocaleData = LocaleData<LocaleFieldsData>;

export declare function removeUnitNamespace(unit: string): string;

declare interface ResolveLocaleResult {
    locale: string;
    dataLocale: string;
    [k: string]: any;
}

export declare const SANCTIONED_UNITS: string[];

declare type ScriptCode = string;

export declare function selectUnit(from: Date | number, to?: Date | number, thresholds?: Partial<Thresholds>): {
    value: number;
    unit: Unit;
};

export declare function setInternalSlot<Instance extends object, Internal extends object, Field extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, field: Field, value: NonNullable<Internal>[Field]): void;

export declare function setMultiInternalSlots<Instance extends object, Internal extends object, K extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, props: Pick<NonNullable<Internal>, K>): void;

/**
 * https://tc39.es/ecma402/#sec-setnfdigitoptions
 * https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_diff_out.html#sec-setnfdigitoptions
 * @param intlObj
 * @param opts
 * @param mnfdDefault
 * @param mxfdDefault
 */
export declare function setNumberFormatDigitOptions<TObject extends object, TInternalSlots extends NumberFormatDigitInternalSlots>(internalSlotMap: WeakMap<TObject, TInternalSlots>, intlObj: TObject, opts: NumberFormatDigitOptions, mnfdDefault: number, mxfdDefault: number): void;

export declare interface SignDisplayPattern {
    auto: NotationPattern;
    always: NotationPattern;
    never: NotationPattern;
    exceptZero: NotationPattern;
}

export declare interface SignPattern {
    positivePattern: string;
    zeroPattern: string;
    negativePattern: string;
}

export declare function supportedLocales(availableLocales: string[], requestedLocales: string[], options?: {
    localeMatcher?: 'best fit' | 'lookup';
}): string[];

export declare interface SymbolsData {
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

declare type Thresholds = Record<'second' | 'minute' | 'hour' | 'day', number>;

/**
 * https://tc39.es/ecma262/#sec-toobject
 * @param arg
 */
export declare function toObject<T>(arg: T): T extends null ? never : T extends undefined ? never : T;

/**
 * https://tc39.es/ecma262/#sec-tostring
 */
declare function toString_2(o: unknown): string;
export { toString_2 as toString }

export declare type UnifiedNumberFormatLocaleData = LocaleData<NumberInternalSlots>;

export declare type UnifiedNumberFormatOptionsCompactDisplay = 'short' | 'long';

export declare type UnifiedNumberFormatOptionsCurrencyDisplay = 'symbol' | 'code' | 'name' | 'narrowSymbol';

export declare type UnifiedNumberFormatOptionsCurrencySign = 'standard' | 'accounting';

export declare type UnifiedNumberFormatOptionsLocaleMatcher = 'lookup' | 'best fit';

export declare type UnifiedNumberFormatOptionsNotation = 'standard' | 'scientific' | 'engineering' | 'compact';

export declare type UnifiedNumberFormatOptionsSignDisplay = 'auto' | 'always' | 'never' | 'exceptZero';

export declare type UnifiedNumberFormatOptionsStyle = 'decimal' | 'percent' | 'currency' | 'unit';

export declare type UnifiedNumberFormatOptionsUnitDisplay = 'long' | 'short' | 'narrow';

declare type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export declare interface UnitData {
    displayName: string;
    long: LDMLPluralRuleMap<RawUnitPattern>;
    short: LDMLPluralRuleMap<RawUnitPattern>;
    narrow: LDMLPluralRuleMap<RawUnitPattern>;
}

export declare interface UnitPattern {
    narrow: SignDisplayPattern;
    short: SignDisplayPattern;
    long: SignDisplayPattern;
}

export declare function unpackData<T extends Record<string, any>>(locale: string, localeData: LocaleData<T>, 
/** By default shallow merge the dictionaries. */
reducer?: (all: T, d: T) => T): T;

export declare type UnpackedLocaleFieldsData = {
    [f in RelativeTimeField]?: FieldData;
} & {
    nu: Array<string | null>;
};

export { }
