import './ThemeColor.less';
import React from 'react';
export interface TagProps {
    color: string;
    check: boolean;
    className?: string;
    onClick?: () => void;
}
export interface ThemeColorProps {
    colors?: {
        key: string;
        color: string;
    }[];
    value: string;
    onChange: (color: string) => void;
    formatMessage: (data: {
        id: any;
        defaultMessage?: string;
    }) => string;
}
declare const _default: React.ForwardRefExoticComponent<ThemeColorProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
