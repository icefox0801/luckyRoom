'use strict';

var projectConfig = require('./config/project');
var parse = require('./util/parse');
var Room = require('./Room');

var roomList = [];
var match;

projectConfig.forEach(function (config) {
  if (config.remain) {
    config.list.forEach(function (title) {
      match = parse(title);
      roomList.push(new Room(config, match.buildingNo, match.floorNo, match.roomNo));
    });
  } else {
    for (var floorNo = 1; floorNo <= config.floor; floorNo++) {
      for (var roomNo = 1; roomNo <= config.room; roomNo++) {
        roomList.push(new Room(config, config.building, floorNo, roomNo));
      }
    }
  }
});

module.exports = roomList;
