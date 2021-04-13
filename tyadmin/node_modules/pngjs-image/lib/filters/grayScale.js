// Copyright 2014-2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * Gray-scale filter
 *
 * @method gray-scale filter
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
		value = source.getGrayScaleAtIndex(idx);

		destination.setRed(idx, value);
		destination.setGreen(idx, value);
		destination.setBlue(idx, value);
		destination.setAlpha(idx, source.getAlpha(idx));
	}
};
