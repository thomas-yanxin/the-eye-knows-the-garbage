import { pegParse } from './parser';
import { normalizeHashtagInPlural } from './normalize';
export * from './types';
export * from './parser';
export * from './skeleton';
export function parse(input, opts) {
    var els = pegParse(input, opts);
    if (!opts || opts.normalizeHashtagInPlural !== false) {
        normalizeHashtagInPlural(els);
    }
    return els;
}
