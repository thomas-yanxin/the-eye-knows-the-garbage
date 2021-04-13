import * as React from 'react';
export interface ScrollNumberProps {
    prefixCls?: string;
    className?: string;
    count?: string | number | null;
    displayComponent?: React.ReactElement<HTMLElement>;
    component?: string;
    onAnimated?: Function;
    style?: React.CSSProperties;
    title?: string | number | null;
}
export interface ScrollNumberState {
    animateStarted?: boolean;
    count?: string | number | null;
}
declare const ScrollNumber: React.FC<ScrollNumberProps>;
export default ScrollNumber;
