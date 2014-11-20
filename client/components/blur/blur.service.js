'use strict';

angular.module('teamAnalyzerApp')
  .factory('blurService', function ($rootScope, $timeout) {
    return function(name) {
      $timeout(function (){
        $rootScope.$broadcast('blurOn', name);
      });
    };
  });
