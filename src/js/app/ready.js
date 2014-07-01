define(['localforage', 'app/init'], function(localforage, init) {
	'use strict';

	var ready;

	return function() {
		if (ready === undefined) {
			ready = init();
		}

		return ready;
	};
});
