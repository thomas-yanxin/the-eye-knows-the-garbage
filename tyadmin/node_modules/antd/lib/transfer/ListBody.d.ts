import * as React from 'react';
import { ElementOf, Omit } from '../_util/type';
import { TransferItem } from '.';
import { TransferListProps, RenderedItem } from './list';
export declare const OmitProps: ["handleFilter", "handleClear", "checkedKeys"];
export declare type OmitProp = ElementOf<typeof OmitProps>;
declare type PartialTransferListProps = Omit<TransferListProps, OmitProp>;
export interface TransferListBodyProps extends PartialTransferListProps {
    filteredItems: TransferItem[];
    filteredRenderItems: RenderedItem[];
    selectedKeys: string[];
}
interface TransferListBodyState {
    current: number;
}
declare class ListBody extends React.Component<TransferListBodyProps, TransferListBodyState> {
    state: {
        current: number;
    };
    static getDerivedStateFromProps({ filteredRenderItems, pagination }: TransferListBodyProps, { current }: TransferListBodyState): {
        current: number;
    } | null;
    onItemSelect: (item: TransferItem) => void;
    onItemRemove: (item: TransferItem) => void;
    onPageChange: (current: number) => void;
    getItems: () => RenderedItem[];
    render(): JSX.Element;
}
export default ListBody;
