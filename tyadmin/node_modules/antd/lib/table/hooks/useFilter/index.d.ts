import { TransformColumns, ColumnsType, ColumnType, Key, TableLocale, GetPopupContainer } from '../../interface';
export interface FilterState<RecordType> {
    column: ColumnType<RecordType>;
    key: Key;
    filteredKeys?: Key[] | null;
    forceFiltered?: boolean;
}
export declare function getFilterData<RecordType>(data: RecordType[], filterStates: FilterState<RecordType>[]): RecordType[];
interface FilterConfig<RecordType> {
    prefixCls: string;
    dropdownPrefixCls: string;
    mergedColumns: ColumnsType<RecordType>;
    locale: TableLocale;
    onFilterChange: (filters: Record<string, Key[] | null>, filterStates: FilterState<RecordType>[]) => void;
    getPopupContainer?: GetPopupContainer;
}
declare function useFilter<RecordType>({ prefixCls, dropdownPrefixCls, mergedColumns, onFilterChange, getPopupContainer, locale: tableLocale, }: FilterConfig<RecordType>): [TransformColumns<RecordType>, FilterState<RecordType>[], () => Record<string, Key[] | null>];
export default useFilter;
