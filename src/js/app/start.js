define(['app/ready'], function(ready) {
	'use strict';

	return function() {
		ready().then(function() {
			console.log('app started');
		});
	};
});
