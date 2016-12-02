'use strict';
var configMap = require('../config/map');
var buildingScore = require('../score/building');
var floorScore = require('../score/floor');
var roomScore = require('../score/room');
var bedroom = require('../score/bedroom');

function find (configMap, number) {
  number = number + '';

  for (var key in configMap) {
    if (~key.split(',').indexOf(number)) {
      return configMap[key];
    }
  }
}

module.exports = function (buildingNo, floorNo, roomNo, communityID) {
  var floor, layout;
  var score = {};
  communityID = communityID || 'COMMON';
  // 楼号得分
  var buildingScoreMap = buildingScore[communityID];
  score.building = find(buildingScoreMap, buildingNo);

  var communityMap = configMap[communityID];
  floor = find(communityMap['floor'], buildingNo);
  layout = find(communityMap['layout'], buildingNo);
  // 楼层得分
  var floorScoreMap = floorScore[floor];
  score.floor = find(floorScoreMap, floorNo);
  // 户型得分
  var roomScoreMap = roomScore[layout];
  score.room = find(roomScoreMap, roomNo);
  // 卧室数量
  var bedroomMap = bedroom[layout];
  score.bedroom = find(bedroomMap, roomNo);

  return score;
};
