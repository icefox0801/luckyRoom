'use strict';

var projectConfig = require('./config/project');
var parse = require('./util/parse');
var Room = require('./Room');

var roomList = [];
var match;
var room;

projectConfig.forEach(function (config) {
  if (config.remain) {
    config.list.forEach(function (title) {
      match = parse(title);
      room = new Room(config, match.buildingNo, match.floorNo, match.roomNo);
      roomList.push(room);
      room.index = roomList.length;
    });
  } else {
    for (var floorNo = config.floor; floorNo >= 1; floorNo--) {
      for (var roomNo = 1; roomNo <= config.room; roomNo++) {
        room = new Room(config, config.building, floorNo, roomNo);
        roomList.push(room);
        room.index = roomList.length;
      }
    }
  }
});

module.exports = roomList;
