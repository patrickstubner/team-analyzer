'use strict';

angular.module('teamAnalyzerApp')
  .factory('focusService', function ($rootScope, $timeout) {
    return function(name) {
      $timeout(function (){
        $rootScope.$broadcast('focusOn', name);
      });
    };
  });
