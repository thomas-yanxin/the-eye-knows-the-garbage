import * as React from 'react';
declare type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';
export declare function getKeyThenIncreaseKey(): number;
export interface ConfigOptions {
    top?: number;
    duration?: number;
    prefixCls?: string;
    getContainer?: () => HTMLElement;
    transitionName?: string;
    maxCount?: number;
    rtl?: boolean;
}
export interface ThenableArgument {
    (val: any): void;
}
export interface MessageType {
    (): void;
    then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>;
    promise: Promise<void>;
}
export interface ArgsProps {
    content: React.ReactNode;
    duration: number | null;
    type: NoticeType;
    prefixCls?: string;
    onClose?: () => void;
    icon?: React.ReactNode;
    key?: string | number;
    style?: React.CSSProperties;
    className?: string;
}
declare type ConfigContent = React.ReactNode | string;
declare type ConfigDuration = number | (() => void);
declare type JointContent = ConfigContent | ArgsProps;
export declare type ConfigOnClose = () => void;
export declare function attachTypeApi(originalApi: any, type: string): void;
export interface MessageInstance {
    info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    open(args: ArgsProps): MessageType;
}
export interface MessageApi extends MessageInstance {
    warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
    config(options: ConfigOptions): void;
    destroy(): void;
    useMessage(): [MessageInstance, React.ReactElement];
}
declare const _default: MessageApi;
export default _default;
