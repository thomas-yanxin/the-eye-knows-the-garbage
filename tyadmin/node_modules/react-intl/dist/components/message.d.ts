import * as React from 'react';
import { PrimitiveType, FormatXMLElementFn } from 'intl-messageformat';
import { MessageDescriptor } from '../types';
export interface Props<V extends Record<string, any> = Record<string, React.ReactNode>> extends MessageDescriptor {
    values?: V;
    tagName?: React.ElementType<any>;
    children?(...nodes: React.ReactNodeArray): React.ReactNode;
}
declare class FormattedMessage<V extends Record<string, any> = Record<string, PrimitiveType | React.ReactElement | FormatXMLElementFn>> extends React.Component<Props<V>> {
    static displayName: string;
    static defaultProps: {
        values: {};
    };
    shouldComponentUpdate(nextProps: Props<V>): boolean;
    render(): JSX.Element;
}
export default FormattedMessage;
