import React, { ReactNode } from 'react';
export interface PercentPropInt {
    prefix?: ReactNode;
    suffix?: ReactNode;
    value?: number | string;
    precision?: number;
    showColor?: boolean;
    showSymbol?: boolean;
}
declare const Percent: React.SFC<PercentPropInt>;
export default Percent;
