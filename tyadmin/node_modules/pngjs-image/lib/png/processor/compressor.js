// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var zlib = require('zlib');

/**
 * @class Compressor
 * @module PNG
 * @submodule PNGCore
 * @param {object} [options] Options for the compressor
 * @constructor
 */
var Compressor = function (options) {
	this._options = options || {};
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Compressor.prototype.getOptions = function () {
	return this._options;
};


/**
 * Compresses data
 *
 * @method encode
 * @param {Buffer} data
 * @return {Buffer}
 */
Compressor.prototype.encode = function (data) {
	if (!zlib.deflateSync) {
		return new Buffer(require("pako").deflate(data, this.getOptions()));
	} else {
		return zlib.deflateSync(data, this.getOptions());
	}
};

/**
 * Decompresses data
 *
 * @method decode
 * @param {Buffer} data
 * @return {Buffer}
 */
Compressor.prototype.decode = function (data) {
	if (!zlib.inflateSync) {
		return new Buffer(require("pako").inflate(data, this.getOptions()));
	} else {
		return zlib.inflateSync(data, this.getOptions());
	}
};

module.exports = Compressor;
