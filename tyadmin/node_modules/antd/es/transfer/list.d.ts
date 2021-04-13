import * as React from 'react';
import { TransferItem, TransferDirection, RenderResult, SelectAllLabel, TransferLocale } from './index';
import DefaultListBody, { TransferListBodyProps } from './ListBody';
import { PaginationType } from './interface';
export interface RenderedItem {
    renderedText: string;
    renderedEl: React.ReactNode;
    item: TransferItem;
}
declare type RenderListFunction = (props: TransferListBodyProps) => React.ReactNode;
export interface TransferListProps extends TransferLocale {
    prefixCls: string;
    titleText: string;
    dataSource: TransferItem[];
    filterOption?: (filterText: string, item: TransferItem) => boolean;
    style?: React.CSSProperties;
    checkedKeys: string[];
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onItemSelect: (key: string, check: boolean) => void;
    onItemSelectAll: (dataSource: string[], checkAll: boolean) => void;
    onItemRemove?: (keys: string[]) => void;
    handleClear: () => void;
    /** render item */
    render?: (item: TransferItem) => RenderResult;
    showSearch?: boolean;
    searchPlaceholder: string;
    itemUnit: string;
    itemsUnit: string;
    renderList?: RenderListFunction;
    footer?: (props: TransferListProps) => React.ReactNode;
    onScroll: (e: React.UIEvent<HTMLUListElement>) => void;
    disabled?: boolean;
    direction: TransferDirection;
    showSelectAll?: boolean;
    selectAllLabel?: SelectAllLabel;
    showRemove?: boolean;
    pagination?: PaginationType;
}
interface TransferListState {
    /** Filter input value */
    filterValue: string;
}
export default class TransferList extends React.PureComponent<TransferListProps, TransferListState> {
    static defaultProps: {
        dataSource: never[];
        titleText: string;
        showSearch: boolean;
    };
    timer: number;
    triggerScrollTimer: number;
    defaultListBodyRef: React.RefObject<DefaultListBody>;
    constructor(props: TransferListProps);
    componentWillUnmount(): void;
    getCheckStatus(filteredItems: TransferItem[]): "none" | "all" | "part";
    getFilteredItems(dataSource: TransferItem[], filterValue: string): {
        filteredItems: TransferItem[];
        filteredRenderItems: RenderedItem[];
    };
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClear: () => void;
    matchFilter: (text: string, item: TransferItem) => boolean;
    getCurrentPageItems: () => void;
    renderListBody: (renderList: RenderListFunction | undefined, props: TransferListBodyProps) => {
        customize: boolean;
        bodyContent: {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | null | undefined;
    };
    getListBody(prefixCls: string, searchPlaceholder: string, filterValue: string, filteredItems: TransferItem[], notFoundContent: React.ReactNode, filteredRenderItems: RenderedItem[], checkedKeys: string[], renderList?: RenderListFunction, showSearch?: boolean, disabled?: boolean): React.ReactNode;
    getCheckBox(filteredItems: TransferItem[], onItemSelectAll: (dataSource: string[], checkAll: boolean) => void, showSelectAll?: boolean, disabled?: boolean): false | JSX.Element;
    renderItem: (item: TransferItem) => RenderedItem;
    getSelectAllLabel: (selectedCount: number, totalCount: number) => React.ReactNode;
    render(): JSX.Element;
}
export {};
