export declare type CacheValue = Intl.NumberFormat | Intl.DateTimeFormat | Intl.PluralRules | any;
export interface MemoizeFormatConstructorFn {
    <T extends {
        new (...args: any[]): any;
    }>(constructor: T, cache?: Record<string, CacheValue>): (...args: ConstructorParameters<T>) => any;
}
declare const memoizeFormatConstructor: MemoizeFormatConstructorFn;
export default memoizeFormatConstructor;
//# sourceMappingURL=index.d.ts.map