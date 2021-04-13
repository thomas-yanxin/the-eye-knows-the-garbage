import * as React from 'react';
import { TransferItem } from '.';
declare type ListItemProps = {
    renderedText?: string | number;
    renderedEl: React.ReactNode;
    disabled?: boolean;
    checked?: boolean;
    prefixCls: string;
    onClick: (item: TransferItem) => void;
    onRemove?: (item: TransferItem) => void;
    item: TransferItem;
    showRemove?: boolean;
};
declare const _default: React.MemoExoticComponent<(props: ListItemProps) => JSX.Element>;
export default _default;
