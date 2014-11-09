'use strict';

angular.module('teamAnalyzerApp')
  .factory('teamService', function ($http) {
    // Service logic
    // ...

    var teamsCache = [];

    // Public API here
    return {
      teams: function (teams) {
        if(teams) {
          teamsCache = teams;
        }
        return teamsCache;
      },
      team: function(team) {
        var sfvId;
        if(_.isObject(team)) {
          teamsCache.push(team);
        } else {
          sfvId = team;
          team = _.find(teamsCache, {sfvId: sfvId});
          if(!team) {
            team = $http.get('/api/teams/' + sfvId);
            team.then(function(res) {
              if(res.data) {
                teamsCache.push(res.data);
              }
            });
          }
        }
        return team;
      },
      teamsCache: teamsCache
    };
  });
