// Copyright 2014-2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var _ = require('underscore');

/**
 * @class utils
 */

/**
 * An extend function that applies the result of a callback to each item
 *
 * @method extendApply
 * @param {object} obj Destination object to merge into
 * @param {object[]} objects Objects that should get merged into the destination object
 * @param {function} [fn] Apply function for each item, returning the final result
 * @return {object} Destination object
 */
var extendApply = function (obj, objects, fn) {
	fn = fn || function (item /* , previousItem, obj, objectIndex, valueIndex */) {
		return item;
	};
	objects.forEach(function (currentObject, objectIndex) {
		if (currentObject) {
			_.keys(currentObject).forEach(function (key, valueIndex) {
				obj[key] = fn(currentObject[key], obj[key], {
					key: key, currentObject: currentObject, objectIndex: objectIndex, valueIndex: valueIndex
				});
			});
		}
	});
	return obj;
};

/**
 * Deep-extend of an object
 *
 * @method deepExtend
 * @param {object} obj
 * @param {object[]} objects
 * @param {object} [options]
 * @param {boolean} [options.replace=false]
 * @return {object}
 */
var deepExtend = function (obj, objects, options) {
	options = options || {};
	objects.forEach(function (currentObject) {
		if (currentObject) {
			_.keys(currentObject).forEach(function (key) {
				var i, len;
				if ((_.isArray(obj[key]) || !obj[key]) && _.isArray(currentObject[key])) {
					if (options.replace) {
						obj[key] = deepExtend(obj[key] || [], [currentObject[key]]);
					} else {
						obj[key] = (obj[key] || []);
						for (i = 0, len = currentObject[key].length; i < len; i++) {
							if (_.isArray(currentObject[key][i])) {
								obj[key].push(deepExtend([], [currentObject[key][i]]));
							} else if (_.isObject(currentObject[key][i])) {
								obj[key].push(deepExtend({}, [currentObject[key][i]]));
							} else {
								obj[key].push(currentObject[key][i]);
							}
						}
					}
				} else if (_.isFunction(currentObject[key])) {
					obj[key] = currentObject[key];
				} else if ((_.isObject(obj[key]) || !obj[key]) && _.isObject(currentObject[key])) {
					obj[key] = deepExtend(obj[key] || {}, [currentObject[key]]);
				} else {
					obj[key] = currentObject[key];
				}
			});
		}
	});
	return obj;
};

/**
 * Wraps a function into another function that sets another function as the __super() function
 * This is used to wrap every single function of an object so that one can call
 *
 * this.__super();
 *
 * to call its parent function that was overwritten.
 *
 * @method superWrapper
 * @param {*} currentItem
 * @param {*} previousItem
 * @return {*}
 */
var superWrapper = function (currentItem, previousItem) {

	if (_.isFunction(currentItem) && (!previousItem || _.isFunction(previousItem))) {

		previousItem = previousItem || function () {
		};

		return function () {
			var result, self = this, oldSuper = self.__super;

			self.__super = function () {
				return previousItem.apply(self, arguments);
			};
			result = currentItem.apply(self, arguments);
			self.__super = oldSuper;

			return result;
		};

	} else {
		return currentItem;
	}
};

/**
 * Combines multiple strings into one, making sure that the glue-string doesn't get applied when not required
 *
 * @method combine
 * @param {string} glue
 * @param {string} str1
 * @return {string}
 */
var combine = function (glue, str1 /*, ... */) {
	var args = Array.prototype.slice.call(arguments, 2), result = str1;

	args.forEach(function (arg) {
		if ((result.substr(-1) === glue) && (arg.substr(0, 1) === glue)) {
			result += arg.substr(1);
		} else if ((result.substr(-1) === glue) || (arg.substr(0, 1) === glue)) {
			result += arg;
		} else {
			result += glue + arg;
		}
	});

	return result;
};

/**
 * Turns a string into a filesystem safe filename
 *
 * @method fileNameSafe
 * @param {string} str
 * @return {string}
 */
var fileNameSafe = function (str) {
	return str.replace(/[^a-zA-Z\d]/g, '-');
};

/**
 * Safely requires a module
 *
 * @method require
 * @param {string} module Module name or path
 * @param {*} [defaultValue] Default value if the module cannot be found
 * @return {*}
 */
var requir = function (module, defaultValue) {
	try {
		return require(module);
	} catch (err) {
		if (defaultValue === undefined) {
			throw new Error("Cannot find module: " + module);
		}
		return defaultValue;
	}
};

module.exports = {
	superWrapper: superWrapper,
	extendApply: extendApply,
	deepExtend: deepExtend,
	combine: combine,
	fileNameSafe: fileNameSafe,
	require: requir
};
