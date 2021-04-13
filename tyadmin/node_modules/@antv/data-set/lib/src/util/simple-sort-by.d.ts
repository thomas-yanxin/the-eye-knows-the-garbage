export declare type SortTarget = string | string[] | ((a: any, b: any) => number);
export default function sortBy(arr: any[], keys?: SortTarget): any[];
