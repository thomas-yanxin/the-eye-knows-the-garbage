import { DisplayNamesLocaleData, DisplayNamesData } from '@formatjs/intl-utils';
export interface DisplayNamesOptions {
    localeMatcher?: 'lookup' | 'best fit';
    style?: 'narrow' | 'short' | 'long';
    type?: 'language' | 'region' | 'script' | 'currency';
    fallback?: 'code' | 'none';
}
export interface DisplayNamesResolvedOptions {
    locale: string;
    style: NonNullable<DisplayNamesOptions['style']>;
    type: NonNullable<DisplayNamesOptions['type']>;
    fallback: NonNullable<DisplayNamesOptions['fallback']>;
}
export declare class DisplayNames {
    constructor(locales?: string | string[], options?: DisplayNamesOptions);
    static supportedLocalesOf(locales?: string | string[], options?: Pick<DisplayNamesOptions, 'localeMatcher'>): string[];
    static __addLocaleData(...data: DisplayNamesLocaleData[]): void;
    of(code: string | number | object): string | undefined;
    resolvedOptions(): DisplayNamesResolvedOptions;
    static localeData: Record<string, DisplayNamesData>;
    private static availableLocales;
    private static __defaultLocale;
    private static getDefaultLocale;
    static readonly polyfilled = true;
}
//# sourceMappingURL=index.d.ts.map