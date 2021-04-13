"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var partition_1 = tslib_1.__importDefault(require("../util/partition"));
var view_1 = require("../view");
util_1.assign(view_1.View.prototype, {
    partition: function (group_by, order_by) {
        if (order_by === void 0) { order_by = []; }
        return partition_1.default(this.rows, group_by, order_by);
    },
    group: function (group_by, order_by) {
        if (order_by === void 0) { order_by = []; }
        var groups = this.partition(group_by, order_by);
        return util_1.values(groups);
    },
    groups: function (group_by, order_by) {
        if (order_by === void 0) { order_by = []; }
        return this.group(group_by, order_by);
    },
});
