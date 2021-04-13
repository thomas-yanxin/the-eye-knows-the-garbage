import EventEmitter from 'wolfy87-eventemitter';
import { DataSet } from './data-set';
import { StatisticsApi } from './api/statistics';
import { PartitionApi } from './api/partition';
import { HierarchyApi } from './api/hierarchy';
import { GeoApi } from './api/geo';
import { TransformsParams } from './transform-params';
import { ConnectorParams } from './connector-params';
export interface ViewOptions {
    watchingStates?: string[];
}
declare type TransformOptions<T extends keyof TransformsParams = any> = {
    type: T;
} & TransformsParams[T];
declare type ConnectorOptions<T extends keyof ConnectorParams = any> = {
    type: T;
} & ConnectorParams[T][1];
interface CustomSource {
    source: any;
    options: any;
}
/**
 * 数据视图
 * @public
 */
export declare class View extends EventEmitter {
    static DataSet: typeof DataSet;
    /**
     * 关联的数据集
     */
    dataSet: DataSet | null;
    /**
     * 是否关联了数据集
     */
    loose: boolean;
    /**
     * 是否是View
     */
    isView: boolean;
    /**
     * 是否是View
     */
    isDataView: boolean;
    /**
     *
     */
    private watchingStates;
    /**
     * 数据视图类型
     */
    dataType: string;
    /**
     * 已应用的 transform
     */
    transforms: TransformOptions[];
    /**
     * 原始数据
     */
    origin: any[];
    /**
     * 存储处理后的数据
     */
    rows: any[];
    _source: CustomSource;
    _tagCloud: any;
    graph: {
        nodes: any[];
        edges: any[];
    };
    nodes: any[];
    edges: any[];
    _projectedAs: string[];
    _gridRows: any;
    _HexJSON: any;
    _GridHexJSON: any;
    constructor(options?: ViewOptions);
    constructor(dataSet?: DataSet, options?: ViewOptions);
    private _parseStateExpression;
    private _preparseOptions;
    private _prepareSource;
    /**
     * 载入数据
     *
     * @remarks
     * data 是原始数据，可能是字符串，也可能是数组、对象，或者另一个数据视图实例。options 里指定了载入数据使用的 connector 和载入时使用的配置项。
     *
     * @param source - 数据
     * @param options- 数据解析配置
     */
    source(source: string): View;
    source(source: any[]): View;
    source(source: View): View;
    source<T extends keyof ConnectorParams>(source: ConnectorParams[T][0], options: ConnectorOptions<T>): View;
    /**
     *  执行数据处理数据。执行完这个函数后，transform 会被存储
     * @param options - 某种类型的transform
     */
    transform<T extends keyof TransformsParams>(options?: TransformOptions<T>): View;
    private _executeTransform;
    private _reExecuteTransforms;
    addRow(row: any): void;
    removeRow(index: number): void;
    updateRow(index: number, newRow: any): void;
    findRows(query: any): any[];
    findRow(query: any): any;
    getColumnNames(): string[];
    getColumnName(index: number): string;
    getColumnIndex(columnName: string): number;
    getColumn(columnName: string): any[];
    getColumnData(columnName: string): any[];
    getSubset(startRowIndex: number, endRowIndex: number, columnNames: string[]): any[];
    toString(prettyPrint?: boolean): string;
    private _reExecute;
}
export interface View extends StatisticsApi, PartitionApi, HierarchyApi, GeoApi {
}
export {};
