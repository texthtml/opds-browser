define(['opds/opds'], function(opds) {
	'use strict';

	return ['CatalogController', ['$scope', 'opdsRepository', '$routeParams',
	function($scope, opdsRepository, $routeParams) {
		$scope.feed = {
			title: $routeParams.title,
			id: $routeParams.id,
		};
		$scope.loading = true;

		if($routeParams.uri === undefined) {
			opdsRepository.find($routeParams.id).then(function(feed) {
				$scope.loading = false;

				$scope.feed = feed;
				$scope.catalog = feed.catalog;

				$scope.$apply();
			});
		} else {
			opds.catalog($routeParams.uri).then(function(catalog) {
				$scope.loading = false;
				$scope.catalog = catalog;

				$scope.$apply();
			});
		}

		$scope.$watch('catalog', function(catalog) {
			if (catalog !== undefined) {
				$scope.entries = $scope.catalog.entries;
			}
		});

		$scope.nav = function(entry) {
			$scope.loading = true;
			entry.catalog().then(function(catalog) {
				$scope.loading = false;
				$scope.catalog = catalog;
				$scope.$apply();
			});
		};

		$scope.details = function(entry) {

		};
	}]];
});
