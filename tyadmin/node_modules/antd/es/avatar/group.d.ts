import * as React from 'react';
export interface GroupProps {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    prefixCls?: string;
    maxCount?: number;
    maxStyle?: React.CSSProperties;
    maxPopoverPlacement?: 'top' | 'bottom';
}
declare const Group: React.FC<GroupProps>;
export default Group;
