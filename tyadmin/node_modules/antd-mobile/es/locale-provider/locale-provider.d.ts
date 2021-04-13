import * as PropTypes from 'prop-types';
import * as React from 'react';
export interface LocaleProviderProps {
    locale: {
        Pagination?: object;
        DatePicker?: object;
        DatePickerView?: object;
        InputItem?: object;
    };
}
export default class LocaleProvider extends React.Component<LocaleProviderProps, any> {
    static propTypes: {
        locale: PropTypes.Requireable<object>;
    };
    static childContextTypes: {
        antLocale: PropTypes.Requireable<object>;
    };
    getChildContext(): {
        antLocale: {
            exist: boolean;
            Pagination?: object | undefined;
            DatePicker?: object | undefined;
            DatePickerView?: object | undefined;
            InputItem?: object | undefined;
        };
    };
    render(): string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactPortal | null | undefined;
}
