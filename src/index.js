//     JqueryFiller
//     (c) simonfan
//     JqueryFiller is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module JqueryFiller
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	var singleFiller = require('./__jquery.filler/single');

	/**
	 * Generates a fill function.
	 *
	 * @method filler
	 * @param [$el] {jQuery wrapper} defaults to 'this'
	 * @param map {Object}
	 *     Hash of property names, keyed by sizzle selector.
	 *     { selector: propName }
	 */
	var filler = module.exports = function filler($parent, map) {

		if (arguments.length === 1) {
			/**
			 * If the function was invoked with only one argument,
			 * it means that it was invoked as a '$parent's method.
			 */
			map = $parent;
			$parent = this;
		}

		// [1] retrieve single fillers
		var fillers = {};
		_.each(map, function (selector, prop) {
			fillers[prop] = singleFiller($parent, selector);
		});

		/**
		 * Receives a data hash keyed by selector.
		 *
		 * @method fill
		 * @param data {Object}
		 *     Hash of values, keyed by the propNames defined before.
		 *     { propName: value }
		 */
		return function fill(data) {
			_.each(data, function (value, prop) {
				// fillers is stored in the closure.
				fillers[prop](value);
			});
		};
	};


	$.prototype.filler = filler;
});
