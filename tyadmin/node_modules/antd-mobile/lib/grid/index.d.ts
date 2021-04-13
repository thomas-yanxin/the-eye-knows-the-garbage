import * as React from 'react';
import { GridPropsType } from './PropsType';
export interface GridProps extends GridPropsType {
    prefixCls?: string;
    className?: string;
    square?: boolean;
    activeClassName?: string;
    activeStyle?: boolean | React.CSSProperties;
    itemStyle?: React.CSSProperties;
}
export default class Grid extends React.Component<GridProps, any> {
    static defaultProps: {
        data: never[];
        hasLine: boolean;
        isCarousel: boolean;
        columnNum: number;
        carouselMaxRow: number;
        prefixCls: string;
        square: boolean;
        itemStyle: {};
    };
    state: {
        initialSlideWidth: number;
    };
    componentDidMount(): void;
    renderCarousel: (rowsArr: any[], pageCount: number, rowCount: number) => any[];
    renderItem: (dataItem: any, index: number, columnNum: number, renderItem: any) => JSX.Element;
    getRows: (rowCount: number, dataLength: number) => any[];
    render(): JSX.Element | null;
}
