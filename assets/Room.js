'use strict';
var getScore = require('./util/getScore');

// 获取ID
var getId = function (buildingNo, floorNo, roomNo, communityId) {
  return (communityId || 'COMMON') + '-' + buildingNo + '-' + floorNo + '0' + roomNo;
};
// 获取标题
var getTitle = function (buildingNo, floorNo, roomNo, communityName) {
  return (communityName || '') + buildingNo + '号楼' + floorNo + '0' + roomNo;
};

var Room = function (config, buildingNo, floorNo, roomNo) {
  this.bNo = buildingNo;
  this.fNo = floorNo;
  this.rNo = roomNo;
  this.id = getId(buildingNo, floorNo, roomNo, config.communityId);
  this.title = getTitle(buildingNo, floorNo, roomNo, config.communityName);
  this.config = config;
  // 基准得分
  var score = getScore(buildingNo, floorNo, roomNo, config.communityId);
  this.bScore = score.building;
  this.fScore = score.floor;
  this.rScore = score.room;
  this.bedroom = score.bedroom;
  this.isTop = floorNo === config.floor;
};

Room.prototype = {
  constructor: Room,
  // 获取总分
  getTotalScore (weightMap) {
    var self = this;
    var bedroom = (self.bedroom === 2 ? 5 : 4) * weightMap.bedroom;
    var rScore = self.rScore * weightMap.rScore;
    var fScore = self.fScore * weightMap.fScore;
    var bScore = self.bScore * weightMap.bScore;
    var totalScore = bedroom + rScore + fScore + bScore;
    return parseInt(totalScore, 10);
  }
};

module.exports = Room;
