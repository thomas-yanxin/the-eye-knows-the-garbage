"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var INVALID_FIELD_ERR_MSG = 'Invalid field: it must be a string!';
var INVALID_FIELDS_ERR_MSG = 'Invalid fields: it must be an array!';
function getField(options, defaultField) {
    var field = options.field, fields = options.fields;
    if (util_1.isString(field)) {
        return field;
    }
    if (util_1.isArray(field)) {
        console.warn(INVALID_FIELD_ERR_MSG);
        return field[0];
    }
    console.warn(INVALID_FIELD_ERR_MSG + " will try to get fields instead.");
    if (util_1.isString(fields)) {
        return fields;
    }
    if (util_1.isArray(fields) && fields.length) {
        return fields[0];
    }
    if (defaultField) {
        return defaultField;
    }
    throw new TypeError(INVALID_FIELD_ERR_MSG);
}
exports.getField = getField;
function getFields(options, defaultFields) {
    var field = options.field, fields = options.fields;
    if (util_1.isArray(fields)) {
        return fields;
    }
    if (util_1.isString(fields)) {
        console.warn(INVALID_FIELDS_ERR_MSG);
        return [fields];
    }
    console.warn(INVALID_FIELDS_ERR_MSG + " will try to get field instead.");
    if (util_1.isString(field)) {
        console.warn(INVALID_FIELDS_ERR_MSG);
        return [field];
    }
    if (util_1.isArray(field) && field.length) {
        console.warn(INVALID_FIELDS_ERR_MSG);
        return field;
    }
    if (defaultFields) {
        return defaultFields;
    }
    throw new TypeError(INVALID_FIELDS_ERR_MSG);
}
exports.getFields = getFields;
