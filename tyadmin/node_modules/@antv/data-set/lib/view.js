"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var wolfy87_eventemitter_1 = tslib_1.__importDefault(require("wolfy87-eventemitter"));
var util_1 = require("@antv/util");
function cloneOptions(options) {
    var result = {};
    util_1.forIn(options, function (value, key) {
        if (util_1.isObject(value) && value.isView) {
            result[key] = value;
        }
        else if (util_1.isArray(value)) {
            result[key] = value.concat([]);
        }
        else if (util_1.isPlainObject(value)) {
            result[key] = util_1.clone(value);
        }
        else {
            result[key] = value;
        }
    });
    return result;
}
/**
 * 数据视图
 * @public
 */
var View = /** @class */ (function (_super) {
    tslib_1.__extends(View, _super);
    function View(dataSet, options) {
        var _this = _super.call(this) || this;
        /**
         * 是否是View
         */
        _this.isView = true;
        /**
         * 是否是View
         */
        _this.isDataView = true; // alias
        /**
         *
         */
        _this.watchingStates = null;
        /**
         * 数据视图类型
         */
        _this.dataType = 'table';
        /**
         * 已应用的 transform
         */
        _this.transforms = [];
        /**
         * 原始数据
         */
        _this.origin = [];
        /**
         * 存储处理后的数据
         */
        _this.rows = [];
        if (dataSet && dataSet.isDataSet) {
            _this.dataSet = dataSet;
        }
        else {
            _this.dataSet = null;
            options = dataSet;
        }
        _this.loose = !_this.dataSet;
        // TODO:
        // assign(me, options);
        if (options) {
            _this.watchingStates = options.watchingStates;
        }
        if (!_this.loose) {
            var watchingStates_1 = _this.watchingStates;
            dataSet.on('statechange', function (name) {
                if (util_1.isArray(watchingStates_1)) {
                    if (watchingStates_1.indexOf(name) > -1) {
                        _this._reExecute();
                    }
                }
                else {
                    _this._reExecute();
                }
            });
        }
        return _this;
    }
    View.prototype._parseStateExpression = function (expr) {
        var dataSet = this.dataSet;
        if (dataSet === null)
            return undefined;
        var matched = /^\$state\.(\w+)/.exec(expr);
        if (matched) {
            return dataSet.state[matched[1]];
        }
        return expr;
    };
    View.prototype._preparseOptions = function (options) {
        var _this = this;
        var optionsCloned = cloneOptions(options);
        if (this.loose) {
            return optionsCloned;
        }
        util_1.forIn(optionsCloned, function (value, key) {
            if (util_1.isString(value) && /^\$state\./.test(value)) {
                optionsCloned[key] = _this._parseStateExpression(value);
            }
        });
        return optionsCloned;
    };
    // connectors
    View.prototype._prepareSource = function (source, options) {
        // warning me.origin is protected
        this._source = { source: source, options: options };
        if (!options) {
            if (source instanceof View || util_1.isString(source)) {
                this.origin = View.DataSet.getConnector('default')(source, this.dataSet);
            }
            else if (util_1.isArray(source)) {
                // TODO branch: if source is like ['dataview1', 'dataview2']
                this.origin = source;
            }
            else if (util_1.isObject(source) && source.type) {
                var opts = this._preparseOptions(source); // connector without source
                this.origin = View.DataSet.getConnector(opts.type)(opts, this);
            }
            else {
                throw new TypeError('Invalid source');
            }
        }
        else {
            var opts = this._preparseOptions(options);
            this.origin = View.DataSet.getConnector(opts.type)(source, opts, this);
        }
        this.rows = util_1.deepMix([], this.origin);
        return this;
    };
    View.prototype.source = function (source, options) {
        this._prepareSource(source, options)._reExecuteTransforms();
        this.trigger('change', []);
        return this;
    };
    /**
     *  执行数据处理数据。执行完这个函数后，transform 会被存储
     * @param options - 某种类型的transform
     */
    View.prototype.transform = function (options) {
        if (options && options.type) {
            this.transforms.push(options);
            this._executeTransform(options);
        }
        return this;
    };
    View.prototype._executeTransform = function (options) {
        options = this._preparseOptions(options);
        var transform = View.DataSet.getTransform(options.type);
        transform(this, options);
    };
    View.prototype._reExecuteTransforms = function () {
        var _this = this;
        this.transforms.forEach(function (options) {
            _this._executeTransform(options);
        });
    };
    View.prototype.addRow = function (row) {
        this.rows.push(row);
    };
    View.prototype.removeRow = function (index) {
        this.rows.splice(index, 1);
    };
    View.prototype.updateRow = function (index, newRow) {
        util_1.assign(this.rows[index], newRow);
    };
    View.prototype.findRows = function (query) {
        return this.rows.filter(function (row) { return util_1.isMatch(row, query); });
    };
    View.prototype.findRow = function (query) {
        return util_1.find(this.rows, query);
    };
    // columns
    View.prototype.getColumnNames = function () {
        var firstRow = this.rows[0];
        if (firstRow) {
            return util_1.keys(firstRow);
        }
        return [];
    };
    View.prototype.getColumnName = function (index) {
        return this.getColumnNames()[index];
    };
    View.prototype.getColumnIndex = function (columnName) {
        var columnNames = this.getColumnNames();
        return columnNames.indexOf(columnName);
    };
    View.prototype.getColumn = function (columnName) {
        return this.rows.map(function (row) { return row[columnName]; });
    };
    View.prototype.getColumnData = function (columnName) {
        return this.getColumn(columnName);
    };
    // data process
    View.prototype.getSubset = function (startRowIndex, endRowIndex, columnNames) {
        var subset = [];
        for (var i = startRowIndex; i <= endRowIndex; i++) {
            subset.push(util_1.pick(this.rows[i], columnNames));
        }
        return subset;
    };
    View.prototype.toString = function (prettyPrint) {
        if (prettyPrint === void 0) { prettyPrint = false; }
        if (prettyPrint) {
            return JSON.stringify(this.rows, null, 2);
        }
        return JSON.stringify(this.rows);
    };
    View.prototype._reExecute = function () {
        var _a = this._source, source = _a.source, options = _a.options;
        this._prepareSource(source, options);
        this._reExecuteTransforms();
        this.trigger('change', []);
    };
    return View;
}(wolfy87_eventemitter_1.default));
exports.View = View;
