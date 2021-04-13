// Copyright 2014-2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * Sepia filter
 *
 * @method sepia filter
 * @param {PNGImage} source
 * @param {PNGImage} destination
 * @param {object} options
 * @private
 */
module.exports = function (source, destination, options) {

	var dim = source.getWidth() * source.getHeight(),
		idx,
		value;

	for (idx = 0; idx < dim; idx++) {
		value = source.getSepiaAtIndex(idx);
		value.alpha = source.getAlpha(idx);
		destination.setAtIndex(idx, value);
	}
};
