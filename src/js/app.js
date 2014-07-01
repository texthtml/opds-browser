define(['angular', 'app/info', 'app/controllers', 'app/services', 'angular-route', 'angular-touch'],
	function(angular, info, controllers, services) {
		'use strict';

		var app = angular.module(info.name, ['ngRoute', 'ngTouch']);

		app.config(['$routeProvider', '$locationProvider', '$compileProvider',
			function($routeProvider, $locationProvider, $compileProvider) {
				$routeProvider.when('/feed/:id/catalog/:title', {
					templateUrl: 'catalog.html',
					controller: 'CatalogController'
				}).when('/feed/:id/catalog/:title/:uri*', {
					templateUrl: 'catalog.html',
					controller: 'CatalogController'
				}).otherwise({
					templateUrl: 'feeds.html',
					controller: 'IndexController'
				});

				$locationProvider.html5Mode(true);

				$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|app|opds):/);
			}
		]);

		app.controller('DefaultController', function($scope, $route, $location, $routeParams) {
			$scope.$route = $route;
			$scope.$location = $location;
			$scope.$routeParams = $routeParams;
		});

		controllers.forEach(function(controller) {
			app.controller.apply(app, controller);
		});

		services.forEach(function(service) {
			app.factory.apply(app, service);
		});

		return app;
	}
);
