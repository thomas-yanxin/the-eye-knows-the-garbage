import { filterProps, createError } from '../utils';
const DISPLAY_NAMES_OPTONS = [
    'localeMatcher',
    'style',
    'type',
    'fallback',
];
export function formatDisplayName({ locale, onError }, getDisplayNames, value, options = {}) {
    const DisplayNames = Intl.DisplayNames;
    if (!DisplayNames) {
        onError(createError(`Intl.DisplayNames is not available in this environment.
Try polyfilling it using "@formatjs/intl-displaynames"
`));
    }
    const filteredOptions = filterProps(options, DISPLAY_NAMES_OPTONS);
    try {
        return getDisplayNames(locale, filteredOptions).of(value);
    }
    catch (e) {
        onError(createError('Error formatting display name.', e));
    }
}
