import * as React from 'react';
export interface SummaryCellProps {
    className?: string;
    children?: React.ReactNode;
    index: number;
    colSpan?: number;
    rowSpan?: number;
}
export default function SummaryCell({ className, index, children, colSpan, rowSpan, }: SummaryCellProps): JSX.Element;
