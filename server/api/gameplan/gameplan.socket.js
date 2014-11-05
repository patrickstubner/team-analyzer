/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gameplan = require('./gameplan.model');

exports.register = function(socket) {
  Gameplan.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Gameplan.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('gameplan:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('gameplan:remove', doc);
}