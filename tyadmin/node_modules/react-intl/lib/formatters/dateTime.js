/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
import { createError, filterProps, getNamedFormat } from '../utils';
const DATE_TIME_FORMAT_OPTIONS = [
    'localeMatcher',
    'formatMatcher',
    'timeZone',
    'hour12',
    'weekday',
    'era',
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'timeZoneName',
];
export function getFormatter({ locale, formats, onError, timeZone, }, type, getDateTimeFormat, options = {}) {
    const { format } = options;
    const defaults = Object.assign(Object.assign({}, (timeZone && { timeZone })), (format && getNamedFormat(formats, type, format, onError)));
    let filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults);
    if (type === 'time' &&
        !filteredOptions.hour &&
        !filteredOptions.minute &&
        !filteredOptions.second) {
        // Add default formatting options if hour, minute, or second isn't defined.
        filteredOptions = Object.assign(Object.assign({}, filteredOptions), { hour: 'numeric', minute: 'numeric' });
    }
    return getDateTimeFormat(locale, filteredOptions);
}
export function formatDate(config, getDateTimeFormat, value, options = {}) {
    const date = typeof value === 'string' ? new Date(value || 0) : value;
    try {
        return getFormatter(config, 'date', getDateTimeFormat, options).format(date);
    }
    catch (e) {
        config.onError(createError('Error formatting date.', e));
    }
    return String(date);
}
export function formatTime(config, getDateTimeFormat, value, options = {}) {
    const date = typeof value === 'string' ? new Date(value || 0) : value;
    try {
        return getFormatter(config, 'time', getDateTimeFormat, options).format(date);
    }
    catch (e) {
        config.onError(createError('Error formatting time.', e));
    }
    return String(date);
}
export function formatDateToParts(config, getDateTimeFormat, value, options = {}) {
    const date = typeof value === 'string' ? new Date(value || 0) : value;
    try {
        return getFormatter(config, 'date', getDateTimeFormat, options).formatToParts(date);
    }
    catch (e) {
        config.onError(createError('Error formatting date.', e));
    }
    return [];
}
export function formatTimeToParts(config, getDateTimeFormat, value, options = {}) {
    const date = typeof value === 'string' ? new Date(value || 0) : value;
    try {
        return getFormatter(config, 'time', getDateTimeFormat, options).formatToParts(date);
    }
    catch (e) {
        config.onError(createError('Error formatting time.', e));
    }
    return [];
}
