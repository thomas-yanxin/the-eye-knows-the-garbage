import { NumberFormatDigitInternalSlots, NumberFormatDigitOptions } from './number-types';
/**
 * https://tc39.es/ecma262/#sec-toobject
 * @param arg
 */
export declare function toObject<T>(arg: T): T extends null ? never : T extends undefined ? never : T;
/**
 * https://tc39.es/ecma262/#sec-tostring
 */
export declare function toString(o: unknown): string;
/**
 * https://tc39.es/ecma402/#sec-getoption
 * @param opts
 * @param prop
 * @param type
 * @param values
 * @param fallback
 */
export declare function getOption<T extends object, K extends keyof T, F>(opts: T, prop: K, type: 'string' | 'boolean', values: T[K][] | undefined, fallback: F): Exclude<T[K], undefined> | F;
/**
 * https://tc39.es/ecma402/#sec-defaultnumberoption
 * @param val
 * @param min
 * @param max
 * @param fallback
 */
export declare function defaultNumberOption(val: any, min: number, max: number, fallback: number): number;
/**
 * https://tc39.es/ecma402/#sec-getnumberoption
 * @param options
 * @param property
 * @param min
 * @param max
 * @param fallback
 */
export declare function getNumberOption<T extends object, K extends keyof T>(options: T, property: K, minimum: number, maximum: number, fallback: number): number;
export declare function getAliasesByLang(lang: string): Record<string, string>;
export declare function getParentLocalesByLang(lang: string): Record<string, string>;
export declare function setInternalSlot<Instance extends object, Internal extends object, Field extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, field: Field, value: NonNullable<Internal>[Field]): void;
export declare function setMultiInternalSlots<Instance extends object, Internal extends object, K extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, props: Pick<NonNullable<Internal>, K>): void;
export declare function getInternalSlot<Instance extends object, Internal extends object, Field extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, field: Field): Internal[Field];
export declare function getMultiInternalSlots<Instance extends object, Internal extends object, Field extends keyof Internal>(map: WeakMap<Instance, Internal>, pl: Instance, ...fields: Field[]): Pick<Internal, Field>;
export interface LiteralPart {
    type: 'literal';
    value: string;
}
export declare function isLiteralPart(patternPart: LiteralPart | {
    type: string;
    value?: string;
}): patternPart is LiteralPart;
export declare function partitionPattern(pattern: string): ({
    type: string;
    value: string;
} | {
    type: string;
    value: undefined;
})[];
/**
 * https://tc39.es/ecma402/#sec-setnfdigitoptions
 * https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_diff_out.html#sec-setnfdigitoptions
 * @param intlObj
 * @param opts
 * @param mnfdDefault
 * @param mxfdDefault
 */
export declare function setNumberFormatDigitOptions<TObject extends object, TInternalSlots extends NumberFormatDigitInternalSlots>(internalSlotMap: WeakMap<TObject, TInternalSlots>, intlObj: TObject, opts: NumberFormatDigitOptions, mnfdDefault: number, mxfdDefault: number): void;
export declare function objectIs(x: any, y: any): boolean;
/**
 * https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-iswellformedcurrencycode
 * @param currency
 */
export declare function isWellFormedCurrencyCode(currency: string): boolean;
//# sourceMappingURL=polyfill-utils.d.ts.map