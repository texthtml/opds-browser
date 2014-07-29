define(['opds/opds'], function(opds) {
	'use strict';

	return ['CatalogController', ['$scope', 'opdsRepository', '$routeParams',
	function($scope, opdsRepository, $routeParams) {
		$scope.feed = {
			title: $routeParams.title,
			id: $routeParams.id,
		};
		$scope.loading = true;

		var showCatalog = function(catalog) {
			$scope.loading = false;
			$scope.catalog = catalog;
			$scope.$apply();
		};

		if($routeParams.uri === undefined) {
			opdsRepository.find($routeParams.id).then(function(feed) {
				return opds.catalog(feed.uri);
			}).then(showCatalog);
		} else {
			opds.catalog($routeParams.uri).then(showCatalog);
		}

		$scope.$watch('catalog', function(catalog) {
			if (catalog !== undefined) {
				$scope.entries = $scope.catalog.entries;
			}
		});

		$scope.nav = function(entry) {
			$scope.loading = true;
			entry.catalog().then(showCatalog);
		};

		$scope.details = function(entry) {

		};
	}]];
});
