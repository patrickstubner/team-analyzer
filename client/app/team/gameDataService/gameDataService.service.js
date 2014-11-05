'use strict';

angular.module('teamAnalyzerApp')
  .factory('gameDataService', function ($filter) {
    var defaultOptions = {
          startDate: null,
          endDate: null,
          rounds: null,
          teams: []
        },
        calculate,
        calculatePointsPerGame,
        calculateRanking;

    calculate = function(games, options) {
      var gameData = [],
          homeTeamData, awayTeamData,
          teamData = {
            name: '',
            rank: 0,
            games: 0,
            homeGames: 0,
            awayGames: 0,
            gamesWin: 0,
            homeGamesWin: 0,
            awayGamesWin: 0,
            gamesDraw: 0,
            homeGamesDraw: 0,
            awayGamesDraw: 0,
            gamesLoss: 0,
            homeGamesLoss: 0,
            awayGamesLoss: 0,
            goalsWin: 0,
            homeGoalsWin: 0,
            awayGoalsWin: 0,
            goalsLoss: 0,
            homeGoalsLoss: 0,
            awayGoalsLoss: 0,
            goalsDiff: 0,
            homeGoalsDiff: 0,
            awayGoalsDiff: 0,
            pointsWin: 0,
            homePointsWin: 0,
            awayPointsWin: 0,
            pointsLoss: 0,
            homePointsLoss: 0,
            awayPointsLoss: 0,
            pointsPerGameWin: 0,
            homePointsPerGameWin: 0,
            awayPointsPerGameWin: 0,
            pointsPerGameLoss: 0,
            homePointsPerGameLoss: 0,
            awayPointsPerGameLoss: 0
          },
          calculateTeams = true;

      angular.extend(defaultOptions, options);
      if(games && games.length > 0) {
        _.forEach(games,
          function(game) {
            homeTeamData = _.find(gameData, {name: game.homeTeam});
            if(!homeTeamData) {
              homeTeamData = angular.copy(teamData);
              homeTeamData.name = game.homeTeam;
              gameData.push(homeTeamData);
            }
            awayTeamData = _.find(gameData, {name: game.awayTeam});
            if(!awayTeamData) {
              awayTeamData = angular.copy(teamData);
              awayTeamData.name = game.awayTeam;
              gameData.push(awayTeamData);
            }

            if(defaultOptions.teams && defaultOptions.teams.length > 1) {
              // this logic has never been tested, for now
              calculateTeams = _.find(defaultOptions.teams, game.homeTeam) && _.find(defaultOptions.teams, game.awayTeam);
            }

            if(game.homeScore !== undefined && game.awayScore !== undefined &&
                (!defaultOptions.startDate || defaultOptions.startDate <= game.date) &&
                (!defaultOptions.endDate || defaultOptions.endDate >= game.date) &&
                calculateTeams) {
              if(!defaultOptions.rounds || defaultOptions.rounds > homeTeamData.games) {
                homeTeamData.games += 1;
                homeTeamData.homeGames += 1;
                homeTeamData.goalsWin += game.homeScore;
                homeTeamData.homeGoalsWin += game.homeScore;
                homeTeamData.goalsDiff += game.homeScore - game.awayScore;
                homeTeamData.homeGoalsDiff += game.homeScore - game.awayScore;
                homeTeamData.goalsLoss += game.awayScore;
                homeTeamData.homeGoalsLoss += game.awayScore;
                if(game.homeScore > game.awayScore) {
                  homeTeamData.gamesWin += 1;
                  homeTeamData.homeGamesWin += 1;
                  homeTeamData.pointsWin += 3;
                  homeTeamData.homePointsWin += 3;
                } else if(game.homeScore < game.awayScore) {
                  homeTeamData.gamesLoss += 1;
                  homeTeamData.homeGamesLoss += 1;
                  homeTeamData.pointsLoss += 3;
                  homeTeamData.homePointsLoss += 3;
                } else {
                  homeTeamData.gamesDraw += 1;
                  homeTeamData.homeGamesDraw += 1;
                  homeTeamData.pointsWin += 1;
                  homeTeamData.homePointsWin += 1;
                  homeTeamData.pointsLoss += 2;
                  homeTeamData.homePointsLoss += 2;
                }
              }

              if(!defaultOptions.rounds || defaultOptions.rounds > awayTeamData.games) {
                awayTeamData.games += 1;
                awayTeamData.awayGames += 1;
                awayTeamData.goalsWin += game.awayScore;
                awayTeamData.awayGoalsWin += game.awayScore;
                awayTeamData.goalsDiff += game.awayScore - game.homeScore;
                awayTeamData.awayGoalsDiff += game.awayScore - game.homeScore;
                awayTeamData.goalsLoss += game.homeScore;
                awayTeamData.awayGoalsLoss += game.homeScore;
                if(game.homeScore > game.awayScore) {
                  awayTeamData.gamesLoss += 1;
                  awayTeamData.awayGamesLoss += 1;
                  awayTeamData.pointsLoss += 3;
                  awayTeamData.awayPointsLoss += 3;
                } else if(game.homeScore < game.awayScore) {
                  awayTeamData.gamesWin += 1;
                  awayTeamData.awayGamesWin += 1;
                  awayTeamData.pointsWin += 3;
                  awayTeamData.awayPointsWin += 3;
                } else {
                  awayTeamData.gamesDraw += 1;
                  awayTeamData.awayGamesDraw += 1;
                  awayTeamData.pointsWin += 1;
                  awayTeamData.awayPointsWin += 1;
                  awayTeamData.pointsLoss += 2;
                  awayTeamData.awayPointsLoss += 2;
                }
              }
            }
          }
        );
      }
      calculatePointsPerGame(gameData);
      return calculateRanking(gameData);
    };

    calculatePointsPerGame = function(gameData) {
      _.forEach(gameData, function(game) {
        game.pointsPerGameWin = game.games > 0 ? game.pointsWin / game.games : 0;
        game.homePointsPerGameWin = game.homeGames > 0 ? game.homePointsWin / game.homeGames : 0;
        game.awayPointsPerGameWin = game.awayGames > 0 ? game.awayPointsWin / game.awayGames : 0;
        game.pointsPerGameLoss = game.games > 0 ? game.pointsLoss / game.games : 0;
        game.homePointsPerGameLoss = game.homeGames > 0 ? game.homePointsLoss / game.homeGames : 0;
        game.awayPointsPerGameLoss = game.awayGames > 0 ? game.awayPointsLoss / game.awayGames : 0;
      });
      return gameData;
    };

    calculateRanking = function(gameData) {
      var index, len = gameData.length;
      gameData = $filter('orderBy')(gameData, ['-pointsWin', 'games', '-goalsDiff', '-goalsWin'], false);
      for(index = 0; index < len; index++) {
        gameData[index].rank = index+1;
      }
      return gameData;
    };


    // Public API here
    return {
      calculate: function (games, options) {
        return calculate(games, options);
      },
      calculateRanking: function (gameData) {
        return calculateRanking(gameData);
      }
    };
  });
