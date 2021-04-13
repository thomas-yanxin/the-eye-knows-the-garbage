// Copyright 2014-2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

module.exports = {

	/**
	 * Base class
	 *
	 * @property Base
	 * @type {Base}
	 */
	Base: require('./lib/base'),

	/**
	 * Utils functions
	 *
	 * @property utils
	 * @type {object}
	 */
	utils: require('./lib/utils'),

	/**
	 * Logger
	 *
	 * @property log
	 * @type {object}
	 */
	log: require('./lib/log'),


	/**
	 * Version
	 *
	 * @property version
	 * @type {string}
	 */
	version: require('./package.json').version
};
