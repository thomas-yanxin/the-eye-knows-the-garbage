import { IntlConfig, Formatters, IntlFormatters } from '../types';
export declare function formatPlural({ locale, onError }: Pick<IntlConfig, 'locale' | 'onError'>, getPluralRules: Formatters['getPluralRules'], value: Parameters<IntlFormatters['formatPlural']>[0], options?: Parameters<IntlFormatters['formatPlural']>[1]): string;
