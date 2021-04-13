import { LiteralPart } from '@formatjs/intl-utils';
import { RelativeTimeLocaleData } from '@formatjs/intl-utils';
import { UnpackedLocaleFieldsData } from '@formatjs/intl-utils';

export declare type FormattableUnit = Unit | Units;

export declare interface IntlRelativeTimeFormatOptions {
    /**
     * The locale matching algorithm to use.
     * Possible values are "lookup" and "best fit"; the default is "best fit".
     * For information about this option, see
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation.
     */
    localeMatcher?: 'best fit' | 'lookup';
    /**
     * The format of output message. Possible values are:
     * - "always" (default, e.g., 1 day ago),
     * - or "auto" (e.g., yesterday).
     * The "auto" value allows to not always have to
     * use numeric values in the output.
     */
    numeric?: 'always' | 'auto';
    /**
     * The length of the internationalized message. Possible values are:
     * - "long" (default, e.g., in 1 month)
     * - "short" (e.g., in 1 mo.),
     * - or "narrow" (e.g., in 1 mo.).
     * The narrow style could be similar to the short style for some locales.
     */
    style?: 'long' | 'short' | 'narrow';
}

export declare type Part = LiteralPart | RelativeTimeFormatNumberPart;

declare class RelativeTimeFormat {
    constructor(locales?: string | string[], options?: IntlRelativeTimeFormatOptions);
    format(value: number, unit: FormattableUnit): string;
    formatToParts(value: number, unit: FormattableUnit): Part[];
    resolvedOptions(): ResolvedIntlRelativeTimeFormatOptions;
    static supportedLocalesOf(locales: string | string[], options?: Pick<IntlRelativeTimeFormatOptions, 'localeMatcher'>): string[];
    static __addLocaleData(...data: RelativeTimeLocaleData[]): void;
    static localeData: Record<string, UnpackedLocaleFieldsData>;
    private static availableLocales;
    private static __defaultLocale;
    private static getDefaultLocale;
    private static relevantExtensionKeys;
    static polyfilled: boolean;
    private static readonly __INTERNAL_SLOT_MAP__;
}
export default RelativeTimeFormat;

export declare interface RelativeTimeFormatNumberPart extends Intl.NumberFormatPart {
    unit: Unit;
}

export declare interface ResolvedIntlRelativeTimeFormatOptions extends Pick<IntlRelativeTimeFormatOptions, 'style' | 'numeric'> {
    /**
     * The BCP 47 language tag for the locale actually used.
     * If any Unicode extension values were requested in the
     * input BCP 47 language tag that led to this locale,
     * the key-value pairs that were requested and are
     * supported for this locale are included in locale.
     */
    locale: string;
    /**
     * The value requested using the Unicode
     * extension key "nu" or filled in as a default.
     */
    numberingSystem: string;
}

export declare type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export declare type Units = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';

export { }
