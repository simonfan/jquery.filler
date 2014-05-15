
/**
 * @module jquery.filler
 * @submodule helpers
 */

define('__jquery.filler/helpers',['require','exports','module','lodash'],function (require, exports, module) {
	

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

/**
 * @module jquery.filler
 * @submodule attribute
 */

define('__jquery.filler/single/method-filler',['require','exports','module','jquery','lodash'],function (require, exports, module) {
	

	var $ = require('jquery'),
		_ = require('lodash');
	/**
	 * Generates a filler function for an attribute.
	 *
	 * @method methodFiller
	 * @param $el {jQuery} The element on which perform task
	 * @param methodData {String}
	 */
	var methodFiller = module.exports = function methodFiller($el, methodData) {

		var methodName = methodData.name,
			methodArgs = methodData.arguments;

		/**
		 * @method fillAttribute
		 * @param value {*}
		 */
		return function fillElementAttribute(value) {
			// add value to methodArgs
			// BE CAREFUL: we must clone the original methodArgs object.
			var fillArgs = _.clone(methodArgs);
			fillArgs.push(value);

			return $el[methodName].apply($el, fillArgs);
		};
	};
});

/**
 * @module jquery.filler
 * @submodule element
 */

define('__jquery.filler/single/html-filler',['require','exports','module','jquery','lodash'],function (require, exports, module) {
	

	var $ = require('jquery'),
		_ = require('lodash');

	/**
	 * Holds the html tag elFillers.
	 *
	 * @class elFillers
	 * @static
	 */
	var elFillers = {
		default: function ($el, value) {
			return $el.html(value);
		},
		INPUT: function ($el, value) {
			/**
			 * intercept only filling for checkboxes and radios
			 * as the default jquery .val() method sets the checkboxes and radio input
			 * values instead of checking them (if the value is not passed in as an array)
			 */
			var type = $el.prop('type');

			if (type === 'checkbox' || type === 'radio') {
				value = _.isArray(value) ? value : [value];
			}

			return $el.val(value);
		},
		SELECT: function ($el, value) {
			return $el.val(value);
		},
		IMG: function ($el, value) {
			// trigger a change event when changing the image src
			return $el.prop('src', value).trigger('change', value);
		},

		TEXTAREA: function ($el, value) {
			return $el.val(value);
		},
	};


	/**
	 * Generates a filler function.
	 *
	 * @method htmlFiller
	 * @param $selection {jQuery} The element on which perform task
	 */
	var htmlFiller = module.exports = function htmlFiller($selection) {

		// [1] create a var to hold $elements grouped by their tagNames
		var byTag = {};

		// [2] loop through the $selection
		_.each($selection, function (el) {

			var $el = $(el);

			// [2.1] get $el tagName
			var tagName = $el.prop('tagName');

			// [2.2] check if there is a group for that tagName
			if (byTag[tagName]) {
				byTag[tagName] = byTag[tagName].add(el);
			} else {
				byTag[tagName] = $el;
			}
		});

		/**
		 * Fills the element with a given value,
		 * using different 'filling-strategies' for each html tag.
		 *
		 * @method fillElement
		 * @param value
		 */
		return function fillElement(value) {
			// loop through the elements grouped by tagname and fill
			_.each(byTag, function ($el, tag) {

				var fill = elFillers[tag] || elFillers['default'];
				fill($el, value);
			});
		};
	};
});

/**
 * Defines functionality for creating a filler for a single
 * html/html-method.
 *
 * @module jquery.filler
 * @submodule singleFiller
 */

define('__jquery.filler/single/index',['require','exports','module','jquery','lodash','../helpers','./method-filler','./html-filler'],function (require, exports, module) {
	

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

			console.log(action);

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

/**
 * Builds filler functions given an $el and a map object.
 *
 * @module jquery.filler
 * @submodule mapFillers
 */

define('__jquery.filler/map-fillers',['require','exports','module','jquery','lodash','./single/index'],function (require, exports, module) {
	

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

//     jquery.filler
//     (c) simonfan
//     jquery.filler is licensed under the MIT terms.

/**
 * @module jquery.filler
 */

define('jquery.filler',['require','exports','module','jquery','lodash','./__jquery.filler/map-fillers'],function (require, exports, module) {
	

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
					var filler = fillers[prop];

					// do NOTHING if no filler was defined
					// BUG ISSUE: #1 - Undefined fillers
					if (filler) {
						filler(value);

						// set currentData
						currentData[prop] = value;
					}
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
