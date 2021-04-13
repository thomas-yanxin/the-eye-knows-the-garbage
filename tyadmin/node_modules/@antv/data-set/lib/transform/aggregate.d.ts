export interface Options {
    as?: string[];
    fields?: string[];
    groupBy?: string | string[] | ((item: any) => string);
    operations?: Array<'count' | 'max' | 'min' | 'mean' | 'average' | 'median' | 'mode' | 'product' | 'standardDeviation' | 'sum' | 'sumSimple' | 'variance'>;
}
declare const _default: {
    VALID_AGGREGATES: any[];
};
export default _default;
