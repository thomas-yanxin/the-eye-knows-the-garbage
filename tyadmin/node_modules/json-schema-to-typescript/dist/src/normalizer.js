"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_color_1 = require("cli-color");
var stringify = require("json-stringify-safe");
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
var rules = new Map();
function hasType(schema, type) {
    return schema.type === type || (Array.isArray(schema.type) && schema.type.includes(type));
}
function isObjectType(schema) {
    return schema.properties !== undefined || hasType(schema, 'object') || hasType(schema, 'any');
}
function isArrayType(schema) {
    return schema.items !== undefined || hasType(schema, 'array') || hasType(schema, 'any');
}
rules.set('Remove `type=["null"]` if `enum=[null]`', function (schema) {
    if (Array.isArray(schema.enum) &&
        schema.enum.some(function (e) { return e === null; }) &&
        Array.isArray(schema.type) &&
        schema.type.includes('null')) {
        schema.type = schema.type.filter(function (type) { return type !== 'null'; });
    }
});
rules.set('Destructure unary types', function (schema) {
    if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
        schema.type = schema.type[0];
    }
});
rules.set('Add empty `required` property if none is defined', function (schema) {
    if (!('required' in schema) && isObjectType(schema)) {
        schema.required = [];
    }
});
rules.set('Transform `required`=false to `required`=[]', function (schema) {
    if (schema.required === false) {
        schema.required = [];
    }
});
// TODO: default to empty schema (as per spec) instead
rules.set('Default additionalProperties to true', function (schema) {
    if (!('additionalProperties' in schema) && isObjectType(schema) && schema.patternProperties === undefined) {
        schema.additionalProperties = true;
    }
});
rules.set('Default top level `id`', function (schema, rootSchema, fileName) {
    if (!schema.id && stringify(schema) === stringify(rootSchema)) {
        schema.id = utils_1.toSafeString(utils_1.justName(fileName));
    }
});
rules.set('Escape closing JSDoc Comment', function (schema) {
    utils_1.escapeBlockComment(schema);
});
rules.set('Optionally remove maxItems and minItems', function (schema, _rootSchema, _fileName, options) {
    if (options.ignoreMinAndMaxItems) {
        if ('maxItems' in schema) {
            delete schema.maxItems;
        }
        if ('minItems' in schema) {
            delete schema.minItems;
        }
    }
});
rules.set('Normalise schema.minItems', function (schema, _rootSchema, _fileName, options) {
    if (options.ignoreMinAndMaxItems) {
        return;
    }
    // make sure we only add the props onto array types
    if (isArrayType(schema)) {
        var minItems = schema.minItems;
        schema.minItems = typeof minItems === 'number' ? minItems : 0;
    }
    // cannot normalise maxItems because maxItems = 0 has an actual meaning
});
rules.set('Normalize schema.items', function (schema, _rootSchema, _fileName, options) {
    if (options.ignoreMinAndMaxItems) {
        return;
    }
    var maxItems = schema.maxItems, minItems = schema.minItems;
    var hasMaxItems = typeof maxItems === 'number' && maxItems >= 0;
    var hasMinItems = typeof minItems === 'number' && minItems > 0;
    if (schema.items && !Array.isArray(schema.items) && (hasMaxItems || hasMinItems)) {
        var items = schema.items;
        // create a tuple of length N
        var newItems = Array(maxItems || minItems || 0).fill(items);
        if (!hasMaxItems) {
            // if there is no maximum, then add a spread item to collect the rest
            schema.additionalItems = items;
        }
        schema.items = newItems;
    }
    if (Array.isArray(schema.items) && hasMaxItems && maxItems < schema.items.length) {
        // it's perfectly valid to provide 5 item defs but require maxItems 1
        // obviously we shouldn't emit a type for items that aren't expected
        schema.items = schema.items.slice(0, maxItems);
    }
    return schema;
});
function normalize(schema, filename, options) {
    var _schema = lodash_1.cloneDeep(schema);
    rules.forEach(function (rule, key) {
        utils_1.traverse(_schema, function (schema) { return rule(schema, _schema, filename, options); });
        utils_1.log(cli_color_1.whiteBright.bgYellow('normalizer'), "Applied rule: \"" + key + "\"");
    });
    return _schema;
}
exports.normalize = normalize;
//# sourceMappingURL=normalizer.js.map