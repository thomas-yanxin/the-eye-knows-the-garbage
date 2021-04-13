export interface RawNumberFormatResult {
    formattedString: string;
    roundedNumber: number;
    integerDigitsCount: number;
}
/**
 * Cannot do Math.log(x) / Math.log(10) bc if IEEE floating point issue
 * @param x number
 */
export declare function getMagnitude(x: number): number;
export declare function toRawFixed(x: number, minFraction: number, maxFraction: number): RawNumberFormatResult;
export declare function toRawPrecision(x: number, minPrecision: number, maxPrecision: number): RawNumberFormatResult;
export declare function repeat(s: string, times: number): string;
//# sourceMappingURL=utils.d.ts.map