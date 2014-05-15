/**
 * @module jquery.filler
 * @submodule helpers
 */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	// sample: 'method: argument : anotherArgument'
	function parseMethod(str) {

		var split = str.split(/\s*:\s*/);

		return {
			name     : split.shift(),
			arguments: split
		};
	}


	var selectorMatcher = /^\s*(.*?)\s*(?:->\s*(.+?)\s*)?$/;
	// sample: '.some-class ->  method:argument'
	// sample: ' -> method:arg'
	exports.parseAction = function parseAction(str) {
		var match = str.match(selectorMatcher);

		// [0] matched string
		// [1] captured selector
		// [2] captured methodString

		var res = {};

		if (match) {

			// action-type
			if (match[1] && match[1] !== '') {
				// on sub elements
				res.subject  = 'sub-elements';
				res.selector = match[1];
			} else {
				// on self.
				res.subject = 'self';
			}

			// filler-type
			if (match[2]) {
				// method
				res.type   = 'method';
				res.method = parseMethod(match[2]);

			} else {
				// html
				res.type = 'html';
			}

		} else {
			throw new Error('Invalid jquery.filler selector: ' + str);
		}

		return res;
	};

});
