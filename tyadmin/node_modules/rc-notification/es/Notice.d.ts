import React, { Component } from 'react';
interface DivProps extends React.HTMLProps<HTMLDivElement> {
    'data-testid'?: string;
}
export interface NoticeProps {
    prefixCls: string;
    style?: React.CSSProperties;
    className?: string;
    duration?: number | null;
    children?: React.ReactNode;
    update?: boolean;
    closeIcon?: React.ReactNode;
    closable?: boolean;
    props?: DivProps;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onClose?: () => void;
    /** @private Only for internal usage. We don't promise that we will refactor this */
    holder?: HTMLDivElement;
}
export default class Notice extends Component<NoticeProps> {
    static defaultProps: {
        onClose(): void;
        duration: number;
        style: {
            right: string;
        };
    };
    closeTimer: number | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: NoticeProps): void;
    componentWillUnmount(): void;
    close: (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    startCloseTimer: () => void;
    clearCloseTimer: () => void;
    restartCloseTimer(): void;
    render(): JSX.Element;
}
export {};
