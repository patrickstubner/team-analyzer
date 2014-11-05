'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClubSchema = new Schema({
		sfvId: Number,
		name: String,
		icon: String,
		href: String,
  		creationDate: Date,
  		mutationDate: Date
	});

module.exports = mongoose.model('Club', ClubSchema);