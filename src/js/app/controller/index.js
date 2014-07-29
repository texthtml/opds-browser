define(['app/ready', 'opds/opds'], function(ready, opds) {
	'use strict';

	return ['IndexController', ['$scope', 'opdsRepository', function($scope, opdsRepository) {
		$scope.loading = true;

		opdsRepository.all().then(function(feeds) {
			$scope.loading = false;
			$scope.feeds = feeds;

			$scope.$apply();

            feeds.forEach(function(feed) {
                opds.catalog(feed.uri).then(function(catalog) {
                    feed.catalog = {
                        subtitle: catalog.subtitle,
                        icon: catalog.icon,
                    };

                    $scope.$apply();
                });
            });
		});
	}]];
});
