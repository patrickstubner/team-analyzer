'use strict';

angular.module('teamAnalyzerApp').controller('TeamCtrl',
    function ($scope, $rootScope, $stateParams, $http, $q, teamService, gameDataService) {
        var that = this;

        this.team = null;
        this.gameplan = null;
        this.teamranking = null;
        this.rankingSortBy = 'rank';
        this.search = {
            team1: null,
            team2: null
        };


        $q.when(teamService.team($stateParams.teamId)).then(
            function(res) {
                var gameplanPromise;
                if(res.data) {
                    that.team = res.data;
                } else {
                    that.team = res;
                }

                $rootScope.$broadcast('closeLeftmenu');

                gameplanPromise = $http.get('/api/gameplans?lk=' + encodeURI(that.team.href.replace(/a-rr\/?$/, 'a-sp')));
                gameplanPromise.then(function(res) {
                    that.gameplan = res.data;
                    that.teamranking = gameDataService.calculate(that.gameplan.games);
                });
            }
        );

        this.selectTeam1 = function(team) {
            if(that.search.team1 === team) {
                that.search.team1 = null;
            } else {
                that.search.team1 = team;
            }
            that.search.team2 = null;
        };

        this.selectTeam2 = function(team1, team2) {
            var teamName,
                team;
            
            if(!that.search.team1) {
                that.selectTeam1(_.find(that.teamranking, {name: team1}));
            }
            teamName = that.search.team1.name === team1 ? team2 : team1;
            team = _.find(that.teamranking, {name: teamName});
            if(that.search.team2 === team) {
                that.search.team2 = null;
            } else {
                that.search.team2 = team;
            }
        };

        this.isWin = function(game, team) {
            return that.search[team] ? game.homeTeam === that.search[team].name ? game.homeScore > game.awayScore : that.search[team] ? game.homeScore < game.awayScore : false : false;
        };

        this.isLoss = function(game, team) {
            return that.search[team] ? game.homeTeam === that.search[team].name ? game.homeScore < game.awayScore : that.search[team] ? game.homeScore > game.awayScore : false : false;
        };

        this.isDraw = function(game, team) {
            return isNaN(game.homeScore) || isNaN(game.awayScore) ? false : that.search[team] ? game.homeScore === game.awayScore : false;
        };

        this.isSelected = function(game) {
            return that.search.team1 && that.search.team2 ? (game.homeTeam === that.search.team1.name && game.awayTeam === that.search.team2.name) || (game.homeTeam === that.search.team2.name && game.awayTeam === that.search.team1.name) : false;
        };
    }
);
