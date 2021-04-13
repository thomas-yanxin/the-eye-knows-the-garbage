export interface Options {
    as?: string[];
    method?: 'linear' | 'exponential' | 'logarithmic' | 'power' | 'polynomial';
    fields: string[];
    bandwidth?: number;
    extent?: [number, number];
    order?: number;
    precision?: number;
}
declare const _default: {
    REGRESSION_METHODS: string[];
};
export default _default;
