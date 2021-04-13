// Copyright 2014-2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var _ = require('underscore');
var nodeUtil = require('util');
var EventEmitter = require('events').EventEmitter;

var utils = require('./utils');

/**
 * Base object class
 *
 * @constructor
 * @class Base
 * @property {string} _uniqueId Unique ID of instance
 */
function Base () {
	this._uniqueId = _.uniqueId('instance');
}
nodeUtil.inherits(Base, EventEmitter);

/**
 * Used as method for parent-method calls
 *
 * @method __super
 */
Base.prototype.__super = null;

/**
 * Name of instance for debugging purposes
 *
 * @property NAME
 * @type {string}
 */
Base.prototype.NAME = 'unnamed';

/**
 * Converts instance to string
 *
 * @method toString
 * @return {string}
 */
Base.prototype.toString = function () {
	return "[" + this.constructor.TYPE + "::" + this.NAME + "(" + this._uniqueId + ")" + "]";
};

Base.prototype.constructor = Base;

/**
 * Type of class
 *
 * @property TYPE
 * @static
 * @type {string}
 */
Base.TYPE = 'Base';

/**
 * Extends the class with another class; implementing inheritance
 *
 * @method extend
 * @static
 * @param {function} [constructorFn]
 * @param {object} prototypeProperties
 * @param {object} [staticProperties]
 * @return {function}
 */
Base.extend = function (constructorFn, prototypeProperties, staticProperties) {

	var parent = this, child, F;

	if (!_.isFunction(constructorFn)) {
		staticProperties = prototypeProperties;
		prototypeProperties = constructorFn;
		constructorFn = undefined;
	}

	if (!constructorFn) {
		constructorFn = function () {
			return this.__super.apply(this, arguments);
		};
	}

	child = utils.superWrapper(constructorFn, parent);

	// Copies the parent methods without wrapping them again
	utils.extendApply(child, [parent]);

	// Wrap all new functions with the superWrapper
	utils.extendApply(child, [staticProperties], utils.superWrapper);

	F = function () {
		this.constructor = child;
	};
	F.prototype = parent.prototype;
	child.prototype = new F();

	// Wrap all new prototype methods in the superWrapper
	utils.extendApply(child.prototype, [prototypeProperties], utils.superWrapper);

	child.__parent = parent.prototype;

	return child;
};

/**
 * Static class conversion to string
 *
 * @method toString
 * @static
 * @return {string}
 */
Base.toString = function () {
	return "[" + this.TYPE + "]";
};

module.exports = Base;
