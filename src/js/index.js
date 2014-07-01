console.log('bootstrap starting');

require(['require-config'], function () {
	require(['angular', 'app', 'app/start', 'polyfills'], function(angular, app, start) {
		start();
		angular.element().ready(function() {
			angular.bootstrap(document, [app.name]);
		});
	});
});
