// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class constants
 * @module PNG
 * @submodule PNGCore
 */

/**
 * Complete PNG signature
 *
 * @type {int[]}
 */
var signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];


/**
 * List of available color types
 *
 * @static
 * @type {object}
 */
var colorTypes = {
	GREY_SCALE: 0,
	TRUE_COLOR: 2,
	INDEXED_COLOR: 3,
	GREY_SCALE_ALPHA: 4,
	TRUE_COLOR_ALPHA:6
};

/**
 * List of physical unit types
 *
 * @type {object}
 */
var physicalUnits = {
	UNKNOWN: 0,
	METER: 1,
	RADIAN: 2
};

/**
 * List of offset unit types
 *
 * @type {object}
 */
var offsetUnits = {
	PIXEL: 0,
	MICROMETER: 1
};

/**
 * List of rendering intents
 *
 * @type {object}
 */
var intents = {
	PERCEPTUAL: 0,
	RELATIVE_COLORIMETRIC: 1,
	SATURATION: 2,
	ABSOLUTE_COLORIMETRIC: 3
};

/**
 * List of interlace methods
 *
 * @type {object}
 */
var interlace = {
	STANDARD: 0,
	ADAM7: 1
};

/**
 * List of stereo layouts
 *
 * @type {object}
 */
var stereoLayouts = {
	CROSS_FUSE: 0,
	DIVERGING_FUSE: 1
};

module.exports = {
	signature: signature,
	colorTypes: colorTypes,
	physicalUnits: physicalUnits,
	offsetUnits: offsetUnits,
	intents: intents,
	interlace: interlace,
	stereoLayouts: stereoLayouts
};
