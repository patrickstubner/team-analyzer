'use strict';

var _ = require('lodash');
var Search = require('./search.model');
var request = require('request');

// Get list of searchs
exports.index = function(req, res) {
  Search.find(function (err, searchs) {
    if(err) { return handleError(res, err); }
    return res.json(200, searchs);
  });
};

// Get a single search
exports.show = function(req, res) {
  if(!req.params.id || req.params.id.length < 2) {
    return res.json(200, []);
  }
  return request.get({uri:"http://www.football.ch/portaldata/1/nis/WebService/verein/VereinSearch.ashx?term="+req.params.id, header: {Accept: "application/json, text/plain, */*"}} )
    .pipe(res);
};

// Creates a new search in the DB.
exports.create = function(req, res) {
  Search.create(req.body, function(err, search) {
    if(err) { return handleError(res, err); }
    return res.json(201, search);
  });
};

// Updates an existing search in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Search.findById(req.params.id, function (err, search) {
    if (err) { return handleError(res, err); }
    if(!search) { return res.send(404); }
    var updated = _.merge(search, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, search);
    });
  });
};

// Deletes a search from the DB.
exports.destroy = function(req, res) {
  Search.findById(req.params.id, function (err, search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.send(404); }
    search.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}