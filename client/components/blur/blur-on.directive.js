'use strict';

angular.module('teamAnalyzerApp')
  .directive('blurOn', function() {
     return function(scope, elem, attr) {
        scope.$on('blurOn', function(e, name) {
          if(name === attr.blurOn) {
            elem[0].blur();
          }
        });
     };
  });
