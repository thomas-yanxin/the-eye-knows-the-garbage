// Copyright 2014-2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var blur = require('./filters/blur');
var grayScale = require('./filters/grayScale');
var lightness = require('./filters/lightness');
var luma = require('./filters/luma');
var luminosity = require('./filters/luminosity');
var sepia = require('./filters/sepia');


/**
 * Generates a filter function by doing common tasks to abstract this away from the actual filter functions
 *
 * @method generateFilter
 * @param {function} fn
 * @return {Function}
 * @private
 */
function generateFilter (fn) {

	/**
	 * Creates a destination image
	 *
	 * @method
	 * @param {PNGImage} image
	 * @param {object} options
	 * @param {object} [options.needsCopy=false]
	 * @return {PNGImage}
	 */
	return function (image, options) {

		if (options.needsCopy) {
			var newImage = image.constructor.createImage(image.getWidth(), image.getHeight());
			fn(image, newImage, options);
			return newImage;

		} else {
			fn(image, image, options);
			return image;
		}
	};
}

module.exports = {
	"blur": generateFilter(blur),
	"grayScale": generateFilter(grayScale),
	"lightness": generateFilter(lightness),
	"luma": generateFilter(luma),
	"luminosity": generateFilter(luminosity),
	"sepia": generateFilter(sepia)
};

