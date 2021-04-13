import * as React from 'react';
import CollapsePanel from './CollapsePanel';
export declare type ExpandIconPosition = 'left' | 'right' | undefined;
export interface CollapseProps {
    activeKey?: Array<string | number> | string | number;
    defaultActiveKey?: Array<string | number> | string | number;
    /** 手风琴效果 */
    accordion?: boolean;
    destroyInactivePanel?: boolean;
    onChange?: (key: string | string[]) => void;
    style?: React.CSSProperties;
    className?: string;
    bordered?: boolean;
    prefixCls?: string;
    expandIcon?: (panelProps: PanelProps) => React.ReactNode;
    expandIconPosition?: ExpandIconPosition;
    ghost?: boolean;
}
interface PanelProps {
    isActive?: boolean;
    header?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    forceRender?: boolean;
    disabled?: boolean;
    extra?: React.ReactNode;
}
interface CollapseInterface extends React.FC<CollapseProps> {
    Panel: typeof CollapsePanel;
}
declare const Collapse: CollapseInterface;
export default Collapse;
