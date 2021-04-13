import * as React from 'react';
import { Formatters, IntlConfig, MessageDescriptor } from '../types';
import { PrimitiveType } from 'intl-messageformat';
export declare const prepareIntlMessageFormatHtmlOutput: (chunks: (string | object)[]) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export declare function formatMessage({ locale, formats, messages, defaultLocale, defaultFormats, onError, }: Pick<IntlConfig, 'locale' | 'formats' | 'messages' | 'defaultLocale' | 'defaultFormats' | 'onError'>, state: Formatters, messageDescriptor?: MessageDescriptor, values?: Record<string, PrimitiveType>): string;
export declare function formatHTMLMessage(config: Pick<IntlConfig, 'locale' | 'formats' | 'messages' | 'defaultLocale' | 'defaultFormats' | 'onError'>, state: Formatters, messageDescriptor?: MessageDescriptor, rawValues?: Record<string, PrimitiveType>): React.ReactNode;
