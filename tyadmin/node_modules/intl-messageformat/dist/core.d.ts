import { parse, MessageFormatElement } from 'intl-messageformat-parser';
import { FormatterCache, Formatters, Formats, FormatXMLElementFn, PrimitiveType, MessageFormatPart } from './formatters';
export interface Options {
    formatters?: Formatters;
}
export declare function createDefaultFormatters(cache?: FormatterCache): Formatters;
export declare class IntlMessageFormat {
    private readonly ast;
    private readonly locales;
    private readonly formatters;
    private readonly formats;
    private readonly message;
    private readonly formatterCache;
    constructor(message: string | MessageFormatElement[], locales?: string | string[], overrideFormats?: Partial<Formats>, opts?: Options);
    format: (values?: Record<string, PrimitiveType> | undefined) => string;
    formatToParts: (values?: Record<string, any> | undefined) => MessageFormatPart[];
    formatHTMLMessage: (values?: Record<string, string | number | boolean | object | Date | FormatXMLElementFn | null | undefined> | undefined) => (string | object)[];
    resolvedOptions: () => {
        locale: string;
    };
    getAst: () => MessageFormatElement[];
    static defaultLocale: string;
    static __parse: typeof parse | undefined;
    static formats: {
        number: {
            currency: {
                style: string;
            };
            percent: {
                style: string;
            };
        };
        date: {
            short: {
                month: string;
                day: string;
                year: string;
            };
            medium: {
                month: string;
                day: string;
                year: string;
            };
            long: {
                month: string;
                day: string;
                year: string;
            };
            full: {
                weekday: string;
                month: string;
                day: string;
                year: string;
            };
        };
        time: {
            short: {
                hour: string;
                minute: string;
            };
            medium: {
                hour: string;
                minute: string;
                second: string;
            };
            long: {
                hour: string;
                minute: string;
                second: string;
                timeZoneName: string;
            };
            full: {
                hour: string;
                minute: string;
                second: string;
                timeZoneName: string;
            };
        };
    };
}
export default IntlMessageFormat;
