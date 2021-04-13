export interface Options {
    field: string;
    method: keyof Imputations | ((row: any, values: any[], value: any, group: any[]) => any);
    value?: any;
    groupBy?: string | string[] | ((item: any) => string);
}
interface Imputations {
    mean(row: any, values: any[]): number;
    median(row: any, values: any[]): number;
    max(row: any, values: any[]): number;
    min(row: any, values: any[]): number;
    value(row: any, values: any[], value: any): any;
}
export {};
