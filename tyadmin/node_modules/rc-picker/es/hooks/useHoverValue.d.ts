import { ValueTextConfig } from './useValueTexts';
export default function useHoverValue<DateType>(valueText: string, { formatList, generateConfig, locale }: ValueTextConfig<DateType>): [string, (date: DateType) => void, (date: DateType) => void];
