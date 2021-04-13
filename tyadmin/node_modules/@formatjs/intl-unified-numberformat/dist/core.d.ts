import { Unit } from './units-constants';
import { RawNumberLocaleData, NumberFormatDigitOptions, NumberFormatDigitInternalSlots, NumberILD, NumberLocalePatternData, NumberLocaleInternalData, UnifiedNumberFormatOptionsLocaleMatcher, UnifiedNumberFormatOptionsStyle, UnifiedNumberFormatOptionsCompactDisplay, UnifiedNumberFormatOptionsCurrencyDisplay, UnifiedNumberFormatOptionsCurrencySign, UnifiedNumberFormatOptionsNotation, UnifiedNumberFormatOptionsSignDisplay, UnifiedNumberFormatOptionsUnitDisplay } from '@formatjs/intl-utils';
/**
 * Check if a formatting number with unit is supported
 * @public
 * @param unit unit to check
 */
export declare function isUnitSupported(unit: Unit): boolean;
export declare type UnifiedNumberFormatOptions = Intl.NumberFormatOptions & NumberFormatDigitOptions & {
    localeMatcher?: UnifiedNumberFormatOptionsLocaleMatcher;
    style?: UnifiedNumberFormatOptionsStyle;
    compactDisplay?: UnifiedNumberFormatOptionsCompactDisplay;
    currencyDisplay?: UnifiedNumberFormatOptionsCurrencyDisplay;
    currencySign?: UnifiedNumberFormatOptionsCurrencySign;
    notation?: UnifiedNumberFormatOptionsNotation;
    signDisplay?: UnifiedNumberFormatOptionsSignDisplay;
    unit?: Unit;
    unitDisplay?: UnifiedNumberFormatOptionsUnitDisplay;
    numberingSystem?: string;
};
export declare type ResolvedUnifiedNumberFormatOptions = Intl.ResolvedNumberFormatOptions & Pick<UnifiedNumberFormatInternal, 'currencySign' | 'unit' | 'unitDisplay' | 'notation' | 'compactDisplay' | 'signDisplay'>;
export declare type UnifiedNumberFormatPartTypes = Intl.NumberFormatPartTypes | 'exponentSeparator' | 'exponentMinusSign' | 'exponentInteger' | 'compact' | 'unit' | 'literal';
export interface UnifiedNumberFormatPart {
    type: UnifiedNumberFormatPartTypes;
    value: string;
}
interface UnifiedNumberFormatInternal extends NumberFormatDigitInternalSlots {
    locale: string;
    dataLocale: string;
    style: NonNullable<UnifiedNumberFormatOptions['style']>;
    currency?: string;
    currencyDisplay: NonNullable<UnifiedNumberFormatOptions['currencyDisplay']>;
    unit?: string;
    unitDisplay: NonNullable<UnifiedNumberFormatOptions['unitDisplay']>;
    currencySign: NonNullable<UnifiedNumberFormatOptions['currencySign']>;
    notation: NonNullable<UnifiedNumberFormatOptions['notation']>;
    compactDisplay: NonNullable<UnifiedNumberFormatOptions['compactDisplay']>;
    signDisplay: NonNullable<UnifiedNumberFormatOptions['signDisplay']>;
    useGrouping: boolean;
    patterns: NumberLocalePatternData;
    pl: Intl.PluralRules;
    boundFormat?: Intl.NumberFormat['format'];
    ild: NumberILD;
    numberingSystem: string;
}
export interface UnifiedNumberFormat {
    resolvedOptions(): ResolvedUnifiedNumberFormatOptions;
    formatToParts(x: number): UnifiedNumberFormatPart[];
    format(x: number): string;
}
export interface UnifiedNumberFormatConstructor {
    new (locales?: string | string[], options?: UnifiedNumberFormatOptions): UnifiedNumberFormat;
    (locales?: string | string[], options?: UnifiedNumberFormatOptions): UnifiedNumberFormat;
    __addLocaleData(...data: RawNumberLocaleData[]): void;
    supportedLocalesOf(locales: string | string[], options?: Pick<UnifiedNumberFormatOptions, 'localeMatcher'>): string[];
    getDefaultLocale(): string;
    __defaultLocale: string;
    localeData: Record<string, NumberLocaleInternalData>;
    availableLocales: string[];
    polyfilled: boolean;
}
export declare const UnifiedNumberFormat: UnifiedNumberFormatConstructor;
export {};
//# sourceMappingURL=core.d.ts.map