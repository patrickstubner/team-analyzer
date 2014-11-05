'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
		  sfvId: Number,
		  clubId: Number,
		  sfvClubId: Number,
  		name: String,
  		level: String,
  		href: String,
  		creationDate: Date,
  		mutationDate: Date
	});

module.exports = mongoose.model('Team', TeamSchema);