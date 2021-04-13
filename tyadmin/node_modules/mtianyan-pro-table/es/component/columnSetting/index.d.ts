/// <reference types="react" />
import { ProColumns } from '../../Table';
import './index.less';
interface ColumnSettingProps<T = any> {
    columns?: ProColumns<T>[];
}
declare const ColumnSetting: <T, U = {}>(props: ColumnSettingProps<T>) => JSX.Element;
export default ColumnSetting;
