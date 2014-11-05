'use strict';

var _ = require('lodash');
var Club = require('./club.model');
var Team = require('../team/team.model');
var request = require('request');
var cheerio = require('cheerio');

var createOrUpdateTeam;
// Get list of clubs
exports.index = function(req, res) {
  Club.find(function (err, clubs) {
    if(err) { return handleError(res, err); }
    return res.json(200, clubs);
  });
};

// Get a single club
exports.show = function(req, res) {
  request.get(req.query.lk,
    function (error, response, body) {
      var $,
        club; // will be Club in future

      if (!error && response.statusCode === 200) {
          $ = cheerio.load(body);
          club = extractClub($);
          club.sfvId = req.params.id;
          club.href = req.query.lk;
          return res.json(200, club);
      } else {
        Club.findById(req.params.id, function (err, club) {
          if(err) { return handleError(res, err); }
          if(!club) { return res.send(404); }
          return res.json(club);
        });
      }
    }
  );
};

function extractClub($) {
  var club = {};
  // get the club information out of the page
  club.name = $($("[href=#tabsVereinAdresse-1]")[0]).text();

  club.teams = extractTeams($);
  return club;
}

function extractTeams($) {
  var teams = [];
  // get the teams information out of the page
  $('#tabsVereinSB-2 ul li').each(
    function(i) {
      var $ta = $(this).children('a'),
          team = {};
      team.href = $ta.attr('href');
      team.sfvId = team.href.match(/(?:^.*\/t-)(\d*)/)[1];
      team.sfvClubId = team.href.match(/(?:^.*\/v-)(\d*)/)[1];
      team.name = $ta.children('nobr').text();
      team.level = $ta.text().replace(team.name, "").trim();
      team.name = team.name.replace(/\*$/, "").trim();
      if(createOrUpdateTeam(team)) {
        teams[i] = team;
      }
    }
  );
  return teams;
}

// Create Or Updates an existing club in the DB.
createOrUpdateTeam = function(team) {
  if(team._id) { delete team._id; }
  return Team.findOneAndUpdate({sfvId: team.sfvId}, team, {upsert:true}, function (err, t) {
    if (err) { return false; }
    if(!t.creationDate) {
      t.creationDate = new Date();
    } else {
      t.mutationDate = new Date();
    }
    t.save();
    return t;
  });
};

// Creates a new club in the DB.
exports.create = function(req, res) {
  Club.create(req.body, function(err, club) {
    if(err) { return handleError(res, err); }
    return res.json(201, club);
  });
};

// Updates an existing club in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Club.findById(req.params.id, function (err, club) {
    if (err) { return handleError(res, err); }
    if(!club) { return res.send(404); }
    var updated = _.merge(club, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, club);
    });
  });
};

// Deletes a club from the DB.
exports.destroy = function(req, res) {
  Club.findById(req.params.id, function (err, club) {
    if(err) { return handleError(res, err); }
    if(!club) { return res.send(404); }
    club.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}