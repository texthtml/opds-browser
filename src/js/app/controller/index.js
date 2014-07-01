define(['app/ready'], function(ready) {
	'use strict';

	return ['IndexController', ['$scope', 'opdsRepository', function($scope, opdsRepository) {
		$scope.loading = true;

		opdsRepository.all().then(function(feeds) {
			$scope.loading = false;
			$scope.feeds = feeds;
			$scope.$apply();
		});
	}]];
});
