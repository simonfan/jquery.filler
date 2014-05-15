(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'../src/__jquery.filler/helpers.js',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(helpers, should) {
	'use strict';

	describe('jquery.filler helpers', function () {
		describe('splitInto', function () {

			it('splits a string into a format', function () {
				var sel = helpers.splitInto('v1 -> v2 -> v3', '->', 'first->second->third');

				sel.should.be.type('object');
				sel.should.eql({
					first: 'v1',
					second: 'v2',
					third: 'v3'
				});
			});

		});
	});
});
