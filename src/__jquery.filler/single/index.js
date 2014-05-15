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

	var h = require('../helpers'),
		methodFiller = require('./method-filler'),
		htmlFiller = require('./html-filler');


	/**
	 * Creates a filler function for a single $el/$el method.
	 *
	 * @method singleFiller
	 * @param $parent {jquery}
	 * @param action {String}
	 */
	var singleFiller = module.exports = function singleFiller() {

		var $parent, action;

		// normalize parameters
		if (arguments.length === 1 && _.isString(arguments[0])) {
			$parent = $(window);
			action  = arguments[0];
		} else {
			$parent = arguments[0];
			action  = arguments[1];
		}


		if (_.isArray(action)) {
			// ARRAY ACTION = ['selector', 'selector -> method:argument'];

			// [1] retrieve the 'subfill' methods
			var subfills = _.map(action, _.partial(singleFiller, $parent));

			// [2] build an aggregate fill and return it.
			return function fill(value) {
				_.each(subfills, function (f) { f(value); });
			};

		} else {

			// STRING SELECTOR

			// [1] parse action
			action = h.parseAction(action);

			// [2] retrieve $el depending on the action subject (either 'self' or 'sub-elements')
			var $el = action.subject === 'sub-elements' ?
				$parent.find(action.selector) :
				$parent;

			// [3] build the filler based on action type (either 'method' or 'html')
			return action.type === 'method' ?
				methodFiller($el, action.method) :
				htmlFiller($el);
		}
	};
});
