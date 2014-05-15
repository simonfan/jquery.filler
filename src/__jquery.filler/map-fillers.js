/**
 * Builds filler functions given an $el and a map object.
 *
 * @module jquery.filler
 * @submodule mapFillers
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	var singleFiller = require('./single/index');

	/**
	 *
	 *
	 * @method mapFillers
	 * @param $el {jq Object}
	 * @param map {Object}
	 */
	var mapFillers = module.exports = function mapFillers($el, map) {

		// retrieve single fillers
		var fillers = {};
		_.each(map, function (selector, prop) {
			fillers[prop] = singleFiller($el, selector);
		});

		return fillers;
	};
});
