export interface Options {
    as?: [string, string, string];
    fields: [string, string];
    method: 'cosine' | 'epanechnikov' | 'gaussian' | 'quartic' | 'triangular' | 'tricube' | 'triweight' | 'uniform' | 'boxcar';
    extent?: [[number, number], [number, number]];
    bandwidth?: [number, number];
}
declare const _default: {
    KERNEL_METHODS: any[];
};
export default _default;
