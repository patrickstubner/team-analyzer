'use strict';

angular.module('teamAnalyzerApp')
  .controller('LeftmenuCtrl', function ($scope, teamService) {

    $scope.isLeftmenuOpen = false;

    $scope.teams = function() {
      return teamService.teams();
    };

    $scope.$on('toggleLeftmenu',
      function() {
      	$scope.isLeftmenuOpen = !$scope.isLeftmenuOpen;
      }	
    );

    $scope.$on('openLeftmenu',
      function() {
      	$scope.isLeftmenuOpen = true;
      }	
    );

    $scope.$on('closeLeftmenu',
      function() {
      	$scope.isLeftmenuOpen = false;
      }	
    );
  });
