"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var wolfy87_eventemitter_1 = tslib_1.__importDefault(require("wolfy87-eventemitter"));
var view_1 = require("./view");
var constants_1 = tslib_1.__importDefault(require("./constants"));
/**
 * 数据集
 * @public
 */
var DataSet = /** @class */ (function (_super) {
    tslib_1.__extends(DataSet, _super);
    /**
     * @param initialProps - 初始状态
     */
    function DataSet(initialProps) {
        if (initialProps === void 0) { initialProps = { state: {} }; }
        var _this = _super.call(this) || this;
        /**
         * 否是 DataSet
         */
        _this.isDataSet = true;
        _this._onChangeTimer = null;
        /**
         * 所有挂在数据集上的数据视图（key-value 对）
         */
        _this.views = {};
        /**
         * 存储数据集上的状态量（key-value 对）
         */
        _this.state = {};
        // assign(me, initialProps);
        _this.state = initialProps.state;
        return _this;
    }
    /**
     * 注册一个数据连接函数，注册后所有数据视图都可以使用 name 来引用这个数据连接函数，从而接入某种数据源。
     * @param name - 类型
     * @param connector - 解析逻辑
     */
    DataSet.registerConnector = function (name, connector) {
        DataSet.connectors[name] = connector;
    };
    DataSet.getConnector = function (name) {
        return DataSet.connectors[name] || DataSet.connectors.default;
    };
    /**
     * 注册一个数据处理函数，注册后所有数据视图都可以使用 name 来引用这个数据处理函数，从而进行某种数据处理
     * @param name - transform 类型
     * @param transform - transform逻辑
     */
    DataSet.registerTransform = function (name, transform) {
        DataSet.transforms[name] = transform;
    };
    DataSet.getTransform = function (name) {
        return DataSet.transforms[name] || DataSet.transforms.default;
    };
    DataSet.prototype._getUniqueViewName = function () {
        var name = util_1.uniqueId('view_');
        while (this.views[name]) {
            name = util_1.uniqueId('view_');
        }
        return name;
    };
    DataSet.prototype.createView = function (name, options) {
        if (util_1.isNil(name)) {
            name = this._getUniqueViewName();
        }
        if (util_1.isObject(name)) {
            options = name;
            name = this._getUniqueViewName();
        }
        if (this.views[name]) {
            throw new Error("data view exists: " + name);
        }
        var view = new view_1.View(this, options);
        this.views[name] = view;
        return view;
    };
    /**
     * 返回 name 对应的数据视图实例
     * @param name - name
     */
    DataSet.prototype.getView = function (name) {
        return this.views[name];
    };
    /**
     * 设置 name 对应的数据视图实例为 dv
     * @param name - 名称
     * @param view - data view
     */
    DataSet.prototype.setView = function (name, view) {
        this.views[name] = view;
    };
    /**
     * 设置状态量 name 的值为 value
     * @param name - 状态名
     * @param value - 值
     */
    DataSet.prototype.setState = function (name, value) {
        var _this = this;
        this.state[name] = value;
        if (this._onChangeTimer) {
            window.clearTimeout(this._onChangeTimer);
            this._onChangeTimer = null;
        }
        this._onChangeTimer = window.setTimeout(function () {
            _this.emit('statechange', name, value);
        }, 16); // execute after one frame
    };
    /**
     * 常量，譬如 DataSet.CONSTANTS.HIERARCHY 是树形结构的名称
     */
    DataSet.CONSTANTS = constants_1.default;
    /**
     * 注册的 Connector（key-value 对）
     */
    DataSet.connectors = {};
    /**
     * 已注册的 Transform（key-value 对）
     */
    DataSet.transforms = {};
    DataSet.DataSet = DataSet;
    DataSet.DataView = view_1.View; // alias
    DataSet.View = view_1.View;
    DataSet.version = '____DATASET_VERSION____';
    return DataSet;
}(wolfy87_eventemitter_1.default));
exports.DataSet = DataSet;
// @ts-ignore
util_1.assign(DataSet, constants_1.default);
// @ts-ignore
util_1.assign(DataSet.prototype, {
    view: DataSet.prototype.createView,
});
view_1.View.DataSet = DataSet;
