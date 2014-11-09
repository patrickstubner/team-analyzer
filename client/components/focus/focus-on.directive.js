'use strict';

angular.module('teamAnalyzerApp')
  .directive('focusOn', function() {
     return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
          if(name === attr.focusOn) {
            elem[0].focus();
          }
        });
     };
  });

angular.module('teamAnalyzerApp')
  .directive('tooltip', function() {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
      attrs.tooltipTrigger = attrs.tooltipTrigger;
      attrs.tooltipPlacement = attrs.tooltipPlacement || 'top';
    }
  }
});
