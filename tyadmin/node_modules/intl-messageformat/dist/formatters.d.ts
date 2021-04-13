import { MessageFormatElement } from 'intl-messageformat-parser';
export interface Formats {
    number: Record<string, Intl.NumberFormatOptions>;
    date: Record<string, Intl.DateTimeFormatOptions>;
    time: Record<string, Intl.DateTimeFormatOptions>;
}
export interface FormatterCache {
    number: Record<string, Intl.NumberFormat>;
    dateTime: Record<string, Intl.DateTimeFormat>;
    pluralRules: Record<string, Intl.PluralRules>;
}
export interface Formatters {
    getNumberFormat(...args: ConstructorParameters<typeof Intl.NumberFormat>): Intl.NumberFormat;
    getDateTimeFormat(...args: ConstructorParameters<typeof Intl.DateTimeFormat>): Intl.DateTimeFormat;
    getPluralRules(...args: ConstructorParameters<typeof Intl.PluralRules>): Intl.PluralRules;
}
export declare const enum PART_TYPE {
    literal = 0,
    argument = 1
}
export interface LiteralPart {
    type: PART_TYPE.literal;
    value: string;
}
export interface ArgumentPart {
    type: PART_TYPE.argument;
    value: any;
}
export declare type MessageFormatPart = LiteralPart | ArgumentPart;
export declare type PrimitiveType = string | number | boolean | null | undefined | Date;
export declare function formatToParts(els: MessageFormatElement[], locales: string | string[], formatters: Formatters, formats: Formats, values?: Record<string, any>, currentPluralValue?: number, originalMessage?: string): MessageFormatPart[];
export declare function formatToString(els: MessageFormatElement[], locales: string | string[], formatters: Formatters, formats: Formats, values?: Record<string, PrimitiveType>, originalMessage?: string): string;
export declare type FormatXMLElementFn = (...args: any[]) => string | object;
export declare function formatHTMLMessage(els: MessageFormatElement[], locales: string | string[], formatters: Formatters, formats: Formats, values?: Record<string, PrimitiveType | object | FormatXMLElementFn>, originalMessage?: string): Array<string | object>;
