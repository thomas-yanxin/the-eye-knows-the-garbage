import * as React from 'react';
import { AccordionPropsTypes } from './PropsType';
export interface AccordionProps extends AccordionPropsTypes {
    className?: string;
    prefixCls?: string;
    openAnimation?: any;
    accordion?: boolean;
    style?: React.CSSProperties;
}
export default class Accordion extends React.Component<AccordionProps, any> {
    static Panel: any;
    static defaultProps: {
        prefixCls: string;
    };
    render(): JSX.Element;
}
