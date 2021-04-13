declare function uniform(u: number): 0.5 | 0;
declare const _default: {
    boxcar: typeof uniform;
    cosine(u: number): number;
    epanechnikov(u: number): number;
    gaussian(u: number): number;
    quartic(u: number): number;
    triangular(u: number): number;
    tricube(u: number): number;
    triweight(u: number): number;
    uniform: typeof uniform;
};
export default _default;
