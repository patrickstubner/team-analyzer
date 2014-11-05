'use strict';

angular.module('teamAnalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.startup', {
        url: '',
        templateUrl: 'app/startup/startup.html',
        controller: 'StartupCtrl'
      });
  });