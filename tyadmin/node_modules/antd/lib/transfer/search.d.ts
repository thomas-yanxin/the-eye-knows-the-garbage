import * as React from 'react';
export interface TransferSearchProps {
    prefixCls?: string;
    placeholder?: string;
    onChange?: (e: React.FormEvent<HTMLElement>) => void;
    handleClear?: (e: React.MouseEvent<HTMLElement>) => void;
    value?: string;
    disabled?: boolean;
}
export default class Search extends React.Component<TransferSearchProps, any> {
    static defaultProps: {
        placeholder: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClear: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    render(): JSX.Element;
}
