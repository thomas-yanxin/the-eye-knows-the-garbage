"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
data_set_1.DataSet.registerConnector('default', function (data, dataSet) {
    var view;
    if (util_1.isString(data)) {
        view = dataSet.getView(data);
    }
    else {
        view = data;
    }
    if (!view) {
        throw new TypeError('Invalid dataView');
    }
    return util_1.deepMix([], view.rows);
});
