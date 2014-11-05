'use strict';

angular.module('teamAnalyzerApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $http, Auth, teamService) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
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

    $scope.selectedClub = undefined;

    $scope.selectClub = function($item) {
        $http.get('/api/clubs/'+$item.id+'?lk='+encodeURI($item.lk)).then(
          function(response) {
            $scope.club = response.data;
            teamService.teams($scope.club.teams);
            $scope.openLeftmenu();
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

    $scope.toggleLeftmenu = function() {
      $rootScope.$broadcast('toggleLeftmenu');
    };

    $scope.openLeftmenu = function() {
      $rootScope.$broadcast('openLeftmenu');
    };

  });