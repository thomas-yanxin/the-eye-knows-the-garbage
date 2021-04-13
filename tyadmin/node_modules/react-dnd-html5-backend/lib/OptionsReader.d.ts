import { HTML5BackendContext } from './types';
export declare class OptionsReader {
    private globalContext;
    constructor(globalContext: HTML5BackendContext);
    get window(): Window | undefined;
    get document(): Document | undefined;
}
