import { IntlConfig, Formatters, IntlFormatters } from '../types';
export declare function formatDisplayName({ locale, onError }: Pick<IntlConfig, 'locale' | 'onError'>, getDisplayNames: Formatters['getDisplayNames'], value: Parameters<IntlFormatters['formatDisplayName']>[0], options?: Parameters<IntlFormatters['formatDisplayName']>[1]): string | undefined;
