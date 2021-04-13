import { NumberFormatDigitInternalSlots } from '@formatjs/intl-utils';
import { NumberFormatDigitOptions } from '@formatjs/intl-utils';
import { NumberILD } from '@formatjs/intl-utils';
import { NumberLocaleInternalData } from '@formatjs/intl-utils';
import { NumberLocalePatternData } from '@formatjs/intl-utils';
import { RawNumberLocaleData } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsCompactDisplay } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsCurrencyDisplay } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsCurrencySign } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsLocaleMatcher } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsNotation } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsSignDisplay } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsStyle } from '@formatjs/intl-utils';
import { UnifiedNumberFormatOptionsUnitDisplay } from '@formatjs/intl-utils';

/**
 * Check if a formatting number with unit is supported
 * @public
 * @param unit unit to check
 */
export declare function isUnitSupported(unit: Unit): boolean;

export declare type ResolvedUnifiedNumberFormatOptions = Intl.ResolvedNumberFormatOptions & Pick<UnifiedNumberFormatInternal, 'currencySign' | 'unit' | 'unitDisplay' | 'notation' | 'compactDisplay' | 'signDisplay'>;

export declare interface UnifiedNumberFormat {
    resolvedOptions(): ResolvedUnifiedNumberFormatOptions;
    formatToParts(x: number): UnifiedNumberFormatPart[];
    format(x: number): string;
}

export declare const UnifiedNumberFormat: UnifiedNumberFormatConstructor;

export declare interface UnifiedNumberFormatConstructor {
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

declare interface UnifiedNumberFormatInternal extends NumberFormatDigitInternalSlots {
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

export declare interface UnifiedNumberFormatPart {
    type: UnifiedNumberFormatPartTypes;
    value: string;
}

export declare type UnifiedNumberFormatPartTypes = Intl.NumberFormatPartTypes | 'exponentSeparator' | 'exponentMinusSign' | 'exponentInteger' | 'compact' | 'unit' | 'literal';

export declare type Unit = 'degree' | 'acre' | 'hectare' | 'percent' | 'bit' | 'byte' | 'gigabit' | 'gigabyte' | 'kilobit' | 'kilobyte' | 'megabit' | 'megabyte' | 'petabyte' | 'terabit' | 'terabyte' | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'second' | 'week' | 'year' | 'centimeter' | 'foot' | 'inch' | 'kilometer' | 'meter' | 'mile-scandinavian' | 'mile' | 'millimeter' | 'yard' | 'gram' | 'kilogram' | 'ounce' | 'pound' | 'stone' | 'celsius' | 'fahrenheit' | 'fluid-ounce' | 'gallon' | 'liter' | 'milliliter';

export { }
