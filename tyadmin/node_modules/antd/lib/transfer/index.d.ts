import * as React from 'react';
import List, { TransferListProps } from './list';
import Search from './search';
import { RenderEmptyHandler } from '../config-provider';
import { TransferListBodyProps } from './ListBody';
import { PaginationType } from './interface';
export { TransferListProps } from './list';
export { TransferOperationProps } from './operation';
export { TransferSearchProps } from './search';
export declare type TransferDirection = 'left' | 'right';
export interface RenderResultObject {
    label: React.ReactElement;
    value: string;
}
export declare type RenderResult = React.ReactElement | RenderResultObject | string | null;
declare type TransferRender = (item: TransferItem) => RenderResult;
export interface TransferItem {
    key: string;
    title?: string;
    description?: string;
    disabled?: boolean;
    [name: string]: any;
}
export interface ListStyle {
    direction: TransferDirection;
}
export declare type SelectAllLabel = React.ReactNode | ((info: {
    selectedCount: number;
    totalCount: number;
}) => React.ReactNode);
export interface TransferProps {
    prefixCls?: string;
    className?: string;
    disabled?: boolean;
    dataSource: TransferItem[];
    targetKeys?: string[];
    selectedKeys?: string[];
    render?: TransferRender;
    onChange?: (targetKeys: string[], direction: string, moveKeys: string[]) => void;
    onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
    style?: React.CSSProperties;
    listStyle: ((style: ListStyle) => React.CSSProperties) | React.CSSProperties;
    operationStyle?: React.CSSProperties;
    titles?: string[];
    operations?: string[];
    showSearch?: boolean;
    filterOption?: (inputValue: string, item: TransferItem) => boolean;
    locale?: Partial<TransferLocale>;
    footer?: (props: TransferListProps) => React.ReactNode;
    rowKey?: (record: TransferItem) => string;
    onSearch?: (direction: TransferDirection, value: string) => void;
    onScroll?: (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => void;
    children?: (props: TransferListBodyProps) => React.ReactNode;
    showSelectAll?: boolean;
    selectAllLabels?: SelectAllLabel[];
    oneWay?: boolean;
    pagination?: PaginationType;
}
export interface TransferLocale {
    titles: string[];
    notFoundContent?: React.ReactNode;
    searchPlaceholder: string;
    itemUnit: string;
    itemsUnit: string;
    remove: string;
    selectAll: string;
    selectCurrent: string;
    selectInvert: string;
    removeAll: string;
    removeCurrent: string;
}
interface TransferState {
    sourceSelectedKeys: string[];
    targetSelectedKeys: string[];
}
declare class Transfer extends React.Component<TransferProps, TransferState> {
    static List: typeof List;
    static Operation: ({ disabled, moveToLeft, moveToRight, leftArrowText, rightArrowText, leftActive, rightActive, className, style, direction, oneWay, }: import("./operation").TransferOperationProps) => JSX.Element;
    static Search: typeof Search;
    static defaultProps: {
        dataSource: never[];
        locale: {};
        showSearch: boolean;
        listStyle: () => void;
    };
    static getDerivedStateFromProps({ selectedKeys, targetKeys, pagination, children, }: TransferProps): {
        sourceSelectedKeys: string[];
        targetSelectedKeys: string[];
    } | null;
    separatedDataSource: {
        leftDataSource: TransferItem[];
        rightDataSource: TransferItem[];
    } | null;
    constructor(props: TransferProps);
    setStateKeys: (direction: TransferDirection, keys: string[] | ((prevKeys: string[]) => string[])) => void;
    getTitles(transferLocale: TransferLocale): string[];
    getLocale: (transferLocale: TransferLocale, renderEmpty: RenderEmptyHandler) => {
        notFoundContent: React.ReactNode;
        titles: string[];
        searchPlaceholder: string;
        itemUnit: string;
        itemsUnit: string;
        remove: string;
        selectAll: string;
        selectCurrent: string;
        selectInvert: string;
        removeAll: string;
        removeCurrent: string;
    } | {
        titles: string[];
        notFoundContent: React.ReactNode;
        searchPlaceholder: string;
        itemUnit: string;
        itemsUnit: string;
        remove: string;
        selectAll: string;
        selectCurrent: string;
        selectInvert: string;
        removeAll: string;
        removeCurrent: string;
    };
    moveTo: (direction: TransferDirection) => void;
    moveToLeft: () => void;
    moveToRight: () => void;
    onItemSelectAll: (direction: TransferDirection, selectedKeys: string[], checkAll: boolean) => void;
    onLeftItemSelectAll: (selectedKeys: string[], checkAll: boolean) => void;
    onRightItemSelectAll: (selectedKeys: string[], checkAll: boolean) => void;
    handleFilter: (direction: TransferDirection, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLeftFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRightFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClear: (direction: TransferDirection) => void;
    handleLeftClear: () => void;
    handleRightClear: () => void;
    onItemSelect: (direction: TransferDirection, selectedKey: string, checked: boolean) => void;
    onLeftItemSelect: (selectedKey: string, checked: boolean) => void;
    onRightItemSelect: (selectedKey: string, checked: boolean) => void;
    onRightItemRemove: (selectedKeys: string[]) => void;
    handleScroll: (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => void;
    handleLeftScroll: (e: React.SyntheticEvent<HTMLUListElement>) => void;
    handleRightScroll: (e: React.SyntheticEvent<HTMLUListElement>) => void;
    handleSelectChange(direction: TransferDirection, holder: string[]): void;
    handleListStyle: (listStyle: React.CSSProperties | ((style: ListStyle) => React.CSSProperties), direction: TransferDirection) => React.CSSProperties;
    separateDataSource(): {
        leftDataSource: TransferItem[];
        rightDataSource: TransferItem[];
    };
    renderTransfer: (transferLocale: TransferLocale) => JSX.Element;
    render(): JSX.Element;
}
export default Transfer;
