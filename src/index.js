//     jquery.filler
//     (c) simonfan
//     jquery.filler is licensed under the MIT terms.

/**
 * @module jquery.filler
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	var mapFillers = require('./__jquery.filler/map-fillers');

	/**
	 * Generates a fill function.
	 *
	 * @method filler
	 * @param [$el] {jQuery wrapper} defaults to 'this'
	 * @param map {Object}
	 *     Hash of property names, keyed by sizzle selector.
	 *     { selector: propName }
	 */
	var filler = module.exports = function filler($parent, map, no_cache) {

		if (arguments.length === 1) {
			/**
			 * If the function was invoked with only one argument,
			 * it means that it was invoked as a '$parent's method.
			 */
			map = $parent;
			$parent = this;
		}


		// variable only accessible to internal methods.
		var _private_ = {};

		// [1] retrieve single fillers
		_private_.fillers = mapFillers($parent, map);


		/**
		 * Var that holds the last set data.
		 * These values will be verified before calling
		 * any filler, so that constant values are not "re-filled"
		 * in the dom.
		 *
		 * @prop currentData
		 * @private
		 */
		_private_.currentData = {};

		/**
		 * Receives a data hash keyed by selector.
		 *
		 * @method fill
		 * @param data {Object}
		 *     Hash of values, keyed by the propNames defined before.
		 *     { propName: value }
		 */
		var fill = function fill(data) {
				// if no_cache is set, update fillers all the time.
			var fillers = no_cache ? mapFillers($parent, map) : _private_.fillers,
				currentData = _private_.currentData;

			_.each(data, function (value, prop) {

				// only fill the DOM with the value if it is different
				// from the current value.
				if (currentData[prop] !== value) {
					// fillers is stored in the closure.
					fillers[prop](value);

					// set currentData
					currentData[prop] = value;
				}
			});
		};

		/**
		 * Reselects elements from the map. Rebuilds fillers.
		 *
		 * @method update
		 */
		fill.update = function update() {
			_private_.fillers = mapFillers($parent, map);
		};

		return fill;
	};


	$.prototype.filler = filler;
});
