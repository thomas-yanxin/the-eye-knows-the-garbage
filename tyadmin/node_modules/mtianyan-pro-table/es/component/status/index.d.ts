import React, { CSSProperties } from 'react';
import './index.less';
interface StatusProps {
    className?: string;
    style?: CSSProperties;
}
/**
 * 快捷操作，用于快速的展示一个状态
 */
declare const Status: {
    Success: React.FC<StatusProps>;
    Error: React.FC<StatusProps>;
    Processing: React.FC<StatusProps>;
    Default: React.FC<StatusProps>;
    Warning: React.FC<StatusProps>;
};
export declare type StatusType = keyof typeof Status;
export default Status;
