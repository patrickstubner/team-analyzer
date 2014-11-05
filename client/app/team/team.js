'use strict';

angular.module('teamAnalyzerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.team', {
        url: 'team/:teamId',
        templateUrl: 'app/team/team.html',
        controller: 'TeamCtrl as TeamCtrl'
      });
  });