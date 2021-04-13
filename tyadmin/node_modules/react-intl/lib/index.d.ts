import * as React from 'react';
export * from './types';
export { defineMessages } from '@formatjs/macro';
import { CustomFormatConfig } from './types';
import { UnifiedNumberFormatOptions } from '@formatjs/intl-unified-numberformat';
import { IntlListFormatOptions } from '@formatjs/intl-listformat';
import { DisplayNamesOptions } from '@formatjs/intl-displaynames/lib';
export { default as injectIntl, Provider as RawIntlProvider, Context as IntlContext, WithIntlProps, WrappedComponentProps, } from './components/injectIntl';
export { default as useIntl } from './components/useIntl';
export { default as IntlProvider, createIntl } from './components/provider';
export declare const FormattedDate: React.FC<Intl.DateTimeFormatOptions & CustomFormatConfig & {
    value: string | number | Date | undefined;
}>;
export declare const FormattedTime: React.FC<Intl.DateTimeFormatOptions & CustomFormatConfig & {
    value: string | number | Date | undefined;
}>;
export declare const FormattedNumber: React.FC<UnifiedNumberFormatOptions & CustomFormatConfig & {
    value: number;
}>;
export declare const FormattedList: React.FC<IntlListFormatOptions & {
    value: React.ReactNode[];
}>;
export declare const FormattedDisplayName: React.FC<DisplayNamesOptions & {
    value: string | number | object;
}>;
export declare const FormattedDateParts: React.FC<Intl.DateTimeFormatOptions & CustomFormatConfig & {
    value: string | number | Date | undefined;
    children(val: Intl.DateTimeFormatPart[]): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | null;
}>;
export declare const FormattedTimeParts: React.FC<Intl.DateTimeFormatOptions & CustomFormatConfig & {
    value: string | number | Date | undefined;
    children(val: Intl.DateTimeFormatPart[]): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | null;
}>;
export { FormattedNumberParts } from './components/createFormattedComponent';
export { default as FormattedRelativeTime } from './components/relative';
export { default as FormattedPlural } from './components/plural';
export { default as FormattedMessage } from './components/message';
export { default as FormattedHTMLMessage } from './components/html-message';
export { createIntlCache } from './utils';
