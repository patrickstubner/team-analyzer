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
  return request.get("http://www.football.ch/portaldata/1/nis/WebService/verein/VereinSearch.ashx?term="+req.params.id)
    .pipe(res);
/*function(subres) {
  console.log("request OK", subres); 
      return subres.data;
    }).on('error',
    function(e) {
  console.log("request NOK", e.message);
      return {};
    }
  );
*//*  var search = [{"id" : "1470","label" : "FC Dübendorf","lVereinsnummer" : "11011","value" : "11","strKurzbezeichnung" : "FVRZ","lk" : "http://www.fvrz.ch/desktopdefault.aspx/tabid-1186/v-1470/"},{"id" : "876908","label" : "Dübendorfer Futsal Verein","lVereinsnummer" : "11094","value" : "11","strKurzbezeichnung" : "FVRZ","lk" : "http://www.fvrz.ch/desktopdefault.aspx/tabid-1186/v-876908/"},{"id" : "720","label" : "SC Düdingen","lVereinsnummer" : "5027","value" : "3","strKurzbezeichnung" : "EL","lk" : "http://www.el-pl.ch/de/desktopdefault.aspx/tabid-1212/v-720/"},{"id" : "1444","label" : "FC Dürrenast","lVereinsnummer" : "10507","value" : "4","strKurzbezeichnung" : "AL","lk" : "http://www.al-la.ch/de/desktopdefault.aspx/tabid-1221/v-1444/"},{"id" : "1047698","label" : "FC Glattal Dübendorf","lVereinsnummer" : "11086","value" : "11","strKurzbezeichnung" : "FVRZ","lk" : "http://www.fvrz.ch/desktopdefault.aspx/tabid-1186/v-1047698/"}];
  return res.json(search);
  Search.findById(req.params.id, function (err, search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.send(404); }
    return res.json(search);
  });
*/
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