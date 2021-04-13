import * as React from 'react';
export interface CollapsePanelProps {
    key: string | number;
    header: React.ReactNode;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    prefixCls?: string;
    forceRender?: boolean;
    id?: string;
    extra?: React.ReactNode;
}
declare const CollapsePanel: React.FC<CollapsePanelProps>;
export default CollapsePanel;
