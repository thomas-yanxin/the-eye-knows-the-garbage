import { filterProps, createError } from '../utils';
const PLURAL_FORMAT_OPTIONS = [
    'localeMatcher',
    'type',
];
export function formatPlural({ locale, onError }, getPluralRules, value, options = {}) {
    if (!Intl.PluralRules) {
        onError(createError(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`));
    }
    const filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);
    try {
        return getPluralRules(locale, filteredOptions).select(value);
    }
    catch (e) {
        onError(createError('Error formatting plural.', e));
    }
    return 'other';
}
