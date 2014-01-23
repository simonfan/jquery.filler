/**
 * Defines functionality for creating a filler for a single
 * element/element-attribute.
 *
 * @module jquery.filler
 * @submodule singleFiller
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	var h = require('./helpers'),
		attributeFiller = require('./attribute'),
		elementFiller = require('./element');

	/**
	 * Creates a filler function for a single $el/$el attribute.
	 *
	 * @method singleFiller
	 * @param $parent {jquery}
	 * @param selector {String}
	 */
	var singleFiller = module.exports = function singleFiller($parent, selector) {

		// normalize parameters
		if (arguments.length === 1 && _.isString($parent)) {
			selector = $parent;
			$parent = $(window);
		}

		if (_.isArray(selector)) {
			// if the selector is an array, return an aggregate function
			// that fills both selectors.

			// [1] retrieve the 'subfill' methods
			var subfills = _.map(selector, _.partial(singleFiller, $parent));

			// [2] build an aggregate fill and return it.
			return function fill(value) {
				_.each(subfills, function (f) { f(value); });
			};

		} else {
			// [1] parse selector
			selector = h.splitInto(selector, '->', 'element->attribute');

			// [2] retrieve $el
			var $el = selector.element ?
				$parent.find(selector.element) :
				$parent;

			return selector.attribute ?
				attributeFiller($el, selector.attribute) :
				elementFiller($el);
		}
	};
});
