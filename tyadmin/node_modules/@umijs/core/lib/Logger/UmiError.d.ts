export declare const ERROR_CODE_MAP: any;
interface IOpts {
    message: string;
    code: string;
    context?: object;
}
export default class UmiError extends Error {
    code: string;
    context: object;
    constructor(opts: IOpts, ...params: any);
    test(): void;
}
export {};
