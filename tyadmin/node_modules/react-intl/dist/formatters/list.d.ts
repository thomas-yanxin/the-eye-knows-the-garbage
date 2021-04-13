import { IntlConfig, Formatters, IntlFormatters } from '../types';
export declare function formatList({ locale, onError }: Pick<IntlConfig, 'locale' | 'onError'>, getListFormat: Formatters['getListFormat'], values: Array<string>, options: Parameters<IntlFormatters['formatList']>[1]): string;
