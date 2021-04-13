declare const reduce: <T, G>(arr: G[], fn: (result: T, data: G, idx: number) => T, init: T) => T;
export default reduce;
