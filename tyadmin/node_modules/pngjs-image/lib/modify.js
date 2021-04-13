// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * Image manipulation functions
 *
 * @class PNGImage
 * @submodule Core
 * @type {object}
 */
module.exports = {

	/**
	 * Rotates the current image 90 degree counter-clockwise
	 *
	 * @method rotateCCW
	 * @return {PNGImage} Rotated image
	 */
	rotateCCW: function () {
		var Class = this.constructor,
			x, y,
			width = this.getWidth(),
			height = this.getHeight(),
			image = Class.createImage(height, width);

		for (x = 0; x < width; x++) {
			for (y = 0; y < height; y++) {
				image.setPixel(y, width - x - 1, this.getPixel(x, y));
			}
		}

		return image;
	},

	/**
	 * Rotates the current image 90 degree clockwise
	 *
	 * @method rotateCW
	 * @return {PNGImage} Rotated image
	 */
	rotateCW: function () {
		var Class = this.constructor,
			x, y,
			width = this.getWidth(),
			height = this.getHeight(),
			image = Class.createImage(height, width);

		for (x = 0; x < width; x++) {
			for (y = 0; y < height; y++) {
				image.setPixel(height - y - 1, x, this.getPixel(x, y));
			}
		}

		return image;
	}
};
