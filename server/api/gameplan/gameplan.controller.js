'use strict';

var _ = require('lodash');
var Gameplan = require('./gameplan.model');
var request = require('request');
var cheerio = require('cheerio');

// Get list of gameplans
exports.index = function(req, res) {
  Gameplan.find(function (err, gameplans) {
    if(err) { return handleError(res, err); }
    return res.json(200, gameplans);
  });
};

// Get a single gameplan
exports.show = function(req, res) {
  var lsId = req.query.lk.match(/(?:\/ls-)(\d*)/)[1],
      sgId = req.query.lk.match(/(?:\/sg-)(\d*)/)[1],
      teamId = req.query.lk.match(/(?:\/t-)(\d*)/)[1];

  request.get(req.query.lk,
    function (error, response, body) {
      var $,
        gameplan; 

      if (!error && response.statusCode === 200) {
          $ = cheerio.load(body);
          gameplan = extractGameplan($);
          gameplan.sfvLsId = lsId;
          gameplan.sfvSgId = sgId;
          gameplan.href = req.query.lk;
          return res.json(gameplan);
      } else {
        Gameplan.findById(req.params.id, function (err, gameplan) {
          if(err) { return handleError(res, err); }
          if(!gameplan) { return res.send(404); }
          return res.json(gameplan);
        });
      }
    }
  );
};

function extractGameplan($) {
  var gameplan = {};
  // get the gameplan information out of the page
  gameplan.name = $(".nisTitel").children().text();

  gameplan.games = extractGames($);
  return gameplan;
}

function extractGames($) {
  var games = [],
      dateArray,
      game;

  // get the games information out of the page
  $('table.nisTab tr').each(
    function() {
      var $tr = $(this),
          $tdDate = $tr.find("td.tt"),
          timeArray,
          $gameTds,
          officialResult = false,
          gameNumber;

      if($tdDate.length) {
        dateArray = $tdDate.text().replace(/[^\d\.]*/g, '').split('.');
      } else if($tr.hasClass('nisCupSpiel')) {
        game = {};
        $gameTds = $tr.find('td');
        timeArray = $($gameTds[0]).text().split(':');
        game.date = new Date(Date.UTC(dateArray[2], dateArray[1]-1, dateArray[0], timeArray[0], timeArray[1]));
        game.homeTeam = $($gameTds[1]).text();
        game.awayTeam = $($gameTds[3]).text();
        if(!$($gameTds[4]).attr('colspan')) {
          game.homeScore = +$($gameTds[4]).text();
          game.awayScore = +$($gameTds[6]).text();
          officialResult = true;
        }
        game.officialResult = officialResult;
        games.push(game);
      } else if($tr.hasClass('nisCupInfo')) {
        gameNumber = $tr.find('td[colspan=7]').text();
        game.number = gameNumber;
      }
    }
  );
  return games;
}

// Creates a new gameplan in the DB.
exports.create = function(req, res) {
  Gameplan.create(req.body, function(err, gameplan) {
    if(err) { return handleError(res, err); }
    return res.json(201, gameplan);
  });
};

// Updates an existing gameplan in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Gameplan.findById(req.params.id, function (err, gameplan) {
    if (err) { return handleError(res, err); }
    if(!gameplan) { return res.send(404); }
    var updated = _.merge(gameplan, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, gameplan);
    });
  });
};

// Deletes a gameplan from the DB.
exports.destroy = function(req, res) {
  Gameplan.findById(req.params.id, function (err, gameplan) {
    if(err) { return handleError(res, err); }
    if(!gameplan) { return res.send(404); }
    gameplan.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
