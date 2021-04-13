// Copyright 2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var log4js = require('log4js');
var path = require('path');
var _ = require('underscore');

var _level = 'INFO';

var _buffered = true;
var _buffer = [];

log4js.setGlobalLogLevel(_level);

/**
 * Arguments logger with custom functionality
 *
 * @method _argumentLogger
 * @param {Logger} logger
 * @return {Logger}
 * @private
 */
var _argumentLogger = function (logger) {

	if (!logger.argumented) {

		['trace', 'debug', 'info', 'warn', 'error'].forEach(function (item) {
			var oldFunction = logger[item];

			logger[item] = function () {
				var args = Array.prototype.slice.call(arguments);

				for (var i = 0; i < args.length; i++) {
					if (_.isObject(args[i])) {
						args[i] = JSON.stringify(args[i], null, 4);
					}
				}

				if (_buffered) {
					_buffer.push({
						logger: logger, level: item, args: args
					});
				} else {
					oldFunction.apply(logger, args);
				}
			};
		});

		logger.argumented = true;
	}

	return logger;
};

/**
 * Logger object
 *
 * @class log
 *
 * @property log
 * @property trace
 * @property debug
 * @property info
 * @property warn
 * @property error
 */

/**
 * Logger management object
 *
 * @class log
 * @type {object}
 */
var log = {

	/**
	 * Get logging level
	 *
	 * @method getLevel
	 * @return {string}
	 */
	getLevel: function () {
		return _level;
	},

	/**
	 * Set logging level
	 *
	 * @method setLevel
	 * @param {string} level
	 */
	setLevel: function (level) {
		_level = level;
		log4js.setGlobalLogLevel(_level);
	},

	/**
	 * Get internal logger
	 *
	 * @method getInternalLogger
	 * @private
	 * @return {*}
	 */
	_getInternalLogger: function () {
		return log4js;
	},

	/**
	 * Return logger for a specific file
	 *
	 * @method getLogger
	 * @param {string} identifier
	 * @return {Logger}
	 */
	getLogger: function (identifier) {
		return _argumentLogger(log4js.getLogger(identifier));
	},

	/**
	 * Flushes all buffered entries
	 *
	 * @method flush
	 */
	flush: function () {
		_buffered = false;

		// Trigger all the entries
		_buffer.forEach(function (entry) {
			entry.logger[entry.level].apply(entry.logger, entry.args);
		});
		_buffer = [];
	}
};

module.exports = log;
