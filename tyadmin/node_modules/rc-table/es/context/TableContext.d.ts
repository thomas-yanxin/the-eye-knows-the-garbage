import * as React from 'react';
import { GetComponent } from '../interface';
import { FixedInfo } from '../utils/fixUtil';
export interface TableContextProps {
    prefixCls: string;
    getComponent: GetComponent;
    scrollbarSize: number;
    direction: 'ltr' | 'rtl';
    fixedInfoList: FixedInfo[];
}
declare const TableContext: React.Context<TableContextProps>;
export default TableContext;
