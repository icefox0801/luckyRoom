'use strict';
var randomWeight = require('./random/weight');
var topPrefer = require('./random/topPrefer');
var giveUp = require('./random/giveUp');

var Person = function (index) {
  this.index = index + 1;
  this.giveUp = giveUp();
  this.weight = randomWeight(); // 权重
  this.topPrefer = topPrefer(); // 顶层喜好程度
  this.rank = []; // 房源排序
};

Person.prototype = {
  // 排序
  sort: function (roomList) {
    var self = this;
    var selectList = roomList.filter(function (room) {
      return !room.selected;
    });

    selectList = selectList.sort(function (aRoom, bRoom) {
      var aTotalScore, bTotalScore;
      aTotalScore = aRoom.getTotalScore(self.weight) * (aRoom.isTop ? self.topPrefer : 1);
      bTotalScore = bRoom.getTotalScore(self.weight) * (bRoom.isTop ? self.topPrefer : 1);

      return bTotalScore - aTotalScore;
    });

    self.rank = selectList.slice(0, 10);
    return selectList;
  },
  // 选择
  select: function (roomList, callback) {
    var self = this;
    self.sort(roomList);
    var room = self.rank[0];
    room.selected = true;
    return room;
  }

};

module.exports = Person;
