interface Options {
    field?: string | string[];
    fields?: string | string[];
}
export declare function getField(options: Options, defaultField?: string): string;
export declare function getFields(options: Options, defaultFields?: string[]): string[];
export {};
