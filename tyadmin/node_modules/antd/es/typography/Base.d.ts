import * as React from 'react';
import { ConfigConsumerProps } from '../config-provider';
import TransButton from '../_util/transButton';
import { TypographyProps } from './Typography';
export declare type BaseType = 'secondary' | 'danger' | 'warning';
interface CopyConfig {
    text?: string;
    onCopy?: () => void;
    icon?: React.ReactNode;
    tooltips?: [React.ReactNode, React.ReactNode];
}
interface EditConfig {
    editing?: boolean;
    onStart?: () => void;
    onChange?: (value: string) => void;
}
interface EllipsisConfig {
    rows?: number;
    expandable?: boolean;
    suffix?: string;
    symbol?: React.ReactNode;
    onExpand?: React.MouseEventHandler<HTMLElement>;
    onEllipsis?: (ellipsis: boolean) => void;
}
export interface BlockProps extends TypographyProps {
    title?: string;
    editable?: boolean | EditConfig;
    copyable?: boolean | CopyConfig;
    type?: BaseType;
    disabled?: boolean;
    ellipsis?: boolean | EllipsisConfig;
    code?: boolean;
    mark?: boolean;
    underline?: boolean;
    delete?: boolean;
    strong?: boolean;
    keyboard?: boolean;
}
interface InternalBlockProps extends BlockProps {
    component: string;
}
interface BaseState {
    edit: boolean;
    copied: boolean;
    ellipsisText: string;
    ellipsisContent: React.ReactNode;
    isEllipsis: boolean;
    expanded: boolean;
    clientRendered: boolean;
}
declare class Base extends React.Component<InternalBlockProps, BaseState> {
    static contextType: React.Context<ConfigConsumerProps>;
    static defaultProps: {
        children: string;
    };
    static getDerivedStateFromProps(nextProps: BlockProps): {};
    context: ConfigConsumerProps;
    editIcon?: TransButton;
    contentRef: React.RefObject<HTMLElement>;
    copyId?: number;
    rafId?: number;
    expandStr?: string;
    copyStr?: string;
    copiedStr?: string;
    editStr?: string;
    state: BaseState;
    componentDidMount(): void;
    componentDidUpdate(prevProps: BlockProps): void;
    componentWillUnmount(): void;
    getPrefixCls: () => string;
    onExpandClick: React.MouseEventHandler<HTMLElement>;
    onEditClick: () => void;
    onEditChange: (value: string) => void;
    onEditCancel: () => void;
    onCopyClick: () => void;
    getEditable(props?: BlockProps): EditConfig;
    getEllipsis(props?: BlockProps): EllipsisConfig;
    setEditRef: (node: TransButton) => void;
    triggerEdit: (edit: boolean) => void;
    resizeOnNextFrame: () => void;
    canUseCSSEllipsis(): boolean;
    syncEllipsis(): void;
    renderExpand(forceRender?: boolean): JSX.Element | null;
    renderEdit(): JSX.Element | undefined;
    renderCopy(): JSX.Element | undefined;
    renderEditInput(): JSX.Element;
    renderOperations(forceRenderExpanded?: boolean): (JSX.Element | null | undefined)[];
    renderContent(): JSX.Element;
    render(): JSX.Element;
}
export default Base;
