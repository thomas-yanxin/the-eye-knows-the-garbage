"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var data_set_1 = require("../data-set");
var tag_cloud_1 = tslib_1.__importDefault(require("../util/tag-cloud"));
var option_parser_1 = require("../util/option-parser");
var DEFAULT_OPTIONS = {
    fields: ['text', 'value'],
    font: function () { return 'serif'; },
    padding: 1,
    size: [500, 500],
    spiral: 'archimedean',
    // timeInterval: Infinity // max execute time
    timeInterval: 500,
};
function transform(dataView, options) {
    options = util_1.assign({}, DEFAULT_OPTIONS, options);
    var layout = tag_cloud_1.default();
    ['font', 'fontSize', 'padding', 'rotate', 'size', 'spiral', 'timeInterval'].forEach(function (key) {
        // @ts-ignore
        if (options[key]) {
            // @ts-ignore
            layout[key](options[key]);
        }
    });
    var fields = option_parser_1.getFields(options);
    var _a = tslib_1.__read(fields, 2), text = _a[0], value = _a[1];
    if (!util_1.isString(text) || !util_1.isString(value)) {
        throw new TypeError('Invalid fields: must be an array with 2 strings (e.g. [ "text", "value" ])!');
    }
    var words = dataView.rows.map(function (row) {
        row.text = row[text];
        row.value = row[value];
        return row;
    });
    layout.words(words);
    if (options.imageMask) {
        layout.createMask(options.imageMask);
    }
    var result = layout.start();
    var tags = result._tags;
    var bounds = result._bounds;
    tags.forEach(function (tag) {
        tag.x += options.size[0] / 2;
        tag.y += options.size[1] / 2;
    });
    var _b = tslib_1.__read(options.size, 2), w = _b[0], h = _b[1];
    var hasImage = result.hasImage;
    tags.push({
        text: '',
        value: 0,
        x: hasImage ? 0 : bounds[0].x,
        y: hasImage ? 0 : bounds[0].y,
        opacity: 0,
    });
    tags.push({
        text: '',
        value: 0,
        x: hasImage ? w : bounds[1].x,
        y: hasImage ? h : bounds[1].y,
        opacity: 0,
    });
    dataView.rows = tags;
    dataView._tagCloud = result;
}
data_set_1.DataSet.registerTransform('tag-cloud', transform);
data_set_1.DataSet.registerTransform('word-cloud', transform);
