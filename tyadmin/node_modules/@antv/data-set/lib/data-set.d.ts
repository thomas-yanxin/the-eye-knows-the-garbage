import EventEmitter from 'wolfy87-eventemitter';
import { View, ViewOptions } from './view';
export interface DataSetOptions {
    state: Record<string, any>;
}
/**
 * 数据集
 * @public
 */
export declare class DataSet extends EventEmitter {
    /**
     * 常量，譬如 DataSet.CONSTANTS.HIERARCHY 是树形结构的名称
     */
    static CONSTANTS: {
        HIERARCHY: string;
        GEO: string;
        HEX: string;
        GRAPH: string;
        TABLE: string;
        GEO_GRATICULE: string;
        STATISTICS_METHODS: string[];
    };
    /**
     * 注册的 Connector（key-value 对）
     */
    static connectors: Record<string, any>;
    /**
     * 已注册的 Transform（key-value 对）
     */
    static transforms: Record<string, any>;
    /**
     * 注册一个数据连接函数，注册后所有数据视图都可以使用 name 来引用这个数据连接函数，从而接入某种数据源。
     * @param name - 类型
     * @param connector - 解析逻辑
     */
    static registerConnector(name: string, connector: (data: any, options: any, view: View) => any): void;
    static getConnector(name: string): Function;
    /**
     * 注册一个数据处理函数，注册后所有数据视图都可以使用 name 来引用这个数据处理函数，从而进行某种数据处理
     * @param name - transform 类型
     * @param transform - transform逻辑
     */
    static registerTransform(name: string, transform: any): void;
    static getTransform(name?: string): Function;
    static DataSet: typeof DataSet;
    static DataView: typeof View;
    static View: typeof View;
    static version: string;
    /**
     * 否是 DataSet
     */
    isDataSet: boolean;
    private _onChangeTimer;
    /**
     * 所有挂在数据集上的数据视图（key-value 对）
     */
    views: Record<string, View>;
    /**
     * 存储数据集上的状态量（key-value 对）
     */
    state: Record<string, any>;
    /**
     * @param initialProps - 初始状态
     */
    constructor(initialProps?: DataSetOptions);
    private _getUniqueViewName;
    /**
     * 创建并返回一个数据视图实例
     * @param name - 数据视图名称
     * @param options - 视图配置
     */
    createView(name: ViewOptions): View;
    createView(name?: string, options?: ViewOptions): View;
    /**
     * 返回 name 对应的数据视图实例
     * @param name - name
     */
    getView(name: string): View;
    /**
     * 设置 name 对应的数据视图实例为 dv
     * @param name - 名称
     * @param view - data view
     */
    setView(name: string, view: View): void;
    /**
     * 设置状态量 name 的值为 value
     * @param name - 状态名
     * @param value - 值
     */
    setState(name: string, value: any): void;
}
