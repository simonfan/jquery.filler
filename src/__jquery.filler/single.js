/**
 * Defines functionality for creating a filler for a single
 * html/html-method.
 *
 * @module jquery.filler
 * @submodule singleFiller
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery'),
		_ = require('lodash');

	var h = require('./helpers'),
		methodFiller = require('./method'),
		htmlFiller = require('./html');

	/**
	 * Creates a filler function for a single $el/$el method.
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
			selector = h.splitInto(selector, '->', 'element->method');

			// [2] retrieve $el
			var $el = selector.element ?
				$parent.find(selector.element) :
				$parent;

			return selector.method ?
				methodFiller($el, selector.method) :
				htmlFiller($el);
		}
	};
});
