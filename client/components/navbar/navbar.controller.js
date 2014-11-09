'use strict';

angular.module('teamAnalyzerApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $http, Auth, teamService, focusService) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.teams = {
      exist: false
    };
    $scope.selectedClub = undefined;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.selectClub = function($item) {
        $http.get('/api/clubs/'+$item.id+'?lk='+encodeURI($item.lk)).then(
          function(response) {
            $scope.club = response.data;
            teamService.teams($scope.club.teams);
            $scope.openLeftmenu();
            $scope.isCollapsed = true;
          }
        );
    };

    // Any function returning a promise object can be used to load values asynchronously
    $scope.getClubs = function(val) {
      return $http.get('/api/searchs/' + val).then(
        function(response) {
          return response.data;
      });
    };

    $scope.toggleHeadermenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
      if(!$scope.isCollapsed) {
        focusService('selectClub');
      }
    };

    $scope.$watch(
      function() {
        return teamService.teams();
      },
      function(newVal) {
        if(newVal && newVal.length > 0) {
          $scope.teams.exist = true;
        } else {
          $scope.teams.exist = false;
        }
      }
    );

    $scope.toggleLeftmenu = function() {
      $scope.leftMenuOpen = !$scope.leftMenuOpen;
      $rootScope.$broadcast('toggleLeftmenu');
    };

    $scope.openLeftmenu = function() {
      $rootScope.$broadcast('openLeftmenu');
    };

  });
