requirejs.config({
	paths: {
		'localforage': '../vendor/localforage/dist/localforage',
		'angular': '../vendor/angular/angular',
		'angular-route': '../vendor/angular-route/angular-route',
		'angular-touch': '../vendor/angular-touch/angular-touch',
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		'angular-route': {
			exports: 'angular',
			deps: ['angular']
		},
		'angular-touch': {
			exports: 'angular',
			deps: ['angular']
		},
	}
});
