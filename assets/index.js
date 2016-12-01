'use strict';
var _ = require('lodash');
var $ = require('jquery');
require('bootstrap/dist/css/bootstrap.css');
// 获取户型
var getLayout = function (bNum, fIndex, rIndex) {
  bNum = bNum + '';
  var layoutMap = {
    '1,4,5,25': [2, 1, 1, 2],
    '2,3': [2, 2, 2],
    '6,7,23,24': [2, 2, 2, 2]
  }
  for(var key in layoutMap) {
    if(~key.split(',').indexOf(bNum)) {
      return layoutMap[key][rIndex - 1];
    }
  }
  return 0;
}
// 获取户型得分
var getRScore = function (bNum, fIndex, rIndex) {
  bNum = bNum + '';
  var scoreMap = {
    '1,4,5,25': [3.5, 2.5, 2.5, 3.7],
    '2,3': [4.3, 4.5, 4.6],
    '6,7,23,24': [3.1, 3.2, 3.2, 3.4],
  }
  for(var key in scoreMap) {
    if(~key.split(',').indexOf(bNum)) {
      return scoreMap[key][rIndex - 1];
    }
  }
  return 0;
}
// 获取楼号得分
var getBScore = function (bNum) {
  bNum = bNum + '';
  var scoreMap = {
    '1,24,25': 4.5,
    '2,3,4,23': 4,
    '5': 3.9,
    '6': 3.7,
    '7': 3.8
  }
  for(var key in scoreMap) {
    if(~key.split(',').indexOf(bNum)) {
      return scoreMap[key];
    }
  }
  return 0;
}
// 获取楼层得分
var getFScore = function (bNum, fIndex) {
  bNum = bNum + '';
  fIndex = fIndex + '';
  var scoreMap = {
    '1,4,5,6,7,25': {
      '1': 4,
      '2': 3.8,
      '3,4,5': 4.3,
      '6,7': 4.4,
      '8,9,10,11': 4.2,
      '12,13,14': 4.3,
      '15,16,17': 4.5,
      '18': 3.6
    },
    '2,3': {
      '1': 4,
      '2': 3.8,
      '3,4,5': 4.3,
      '6,7': 4.4,
      '8.9.10': 4.5,
      '11': 3.1
    },
    '23,24': {
      '1': 4,
      '2': 3.8,
      '3,4,5': 4.1,
      '6,7,8,9,10': 4.4,
      '11,12,13,14': 4.2,
      '15,16,17,18,19,20,21,22': 4.3,
      '24,25': 4.0,
      '26': 3.5
    }
  }
  for(var key in scoreMap) {
    if(~key.split(',').indexOf(bNum)) {
      for(var subKey in scoreMap[key]) {
        if(~subKey.split(',').indexOf(fIndex)) {
          return scoreMap[key][subKey];
        }
      }
      return scoreMap[key][fIndex];
    }
  }
  return 0;
}


var candidates = [{
  bNum: 1,
  fNum: 18,
  rNum: 4,
  building: []
}, {
  bNum: 2,
  fNum: 11,
  rNum: 3,
}, {
  bNum: 3,
  fNum: 11,
  rNum: 3
}, {
  bNum: 4,
  fNum: 18,
  rNum: 4
}, {
  bNum: 5,
  fNum: 18,
  rNum: 4
}, {
  bNum: 6,
  fNum: 18,
  rNum: 4
}, {
  bNum: 7,
  fNum: 18,
  rNum: 4
}, {
  bNum: 23,
  fNum: 26,
  rNum: 4
}, {
  bNum: 24,
  fNum: 26,
  rNum: 4
}, {
  bNum: 25,
  fNum: 18,
  rNum: 4
}]

var config, floor, room;

for(var i = 0, len = candidates.length; i < len; i++) {
  config = candidates[i];
  config.building = [];

  for(var f = 1; f <= config.fNum; f++) {
    floor = [];

    for(var r = 1; r <= config.rNum; r++) {
      room = {};
      room.bScore = getBScore(config.bNum, f, r);
      room.fScore = getFScore(config.bNum, f, r);
      room.rScore = getRScore(config.bNum, f, r);
      room.layout = getLayout(config.bNum, f, r);
      floor.push(room);
    }

    config.building.push(floor);
  }

}

$(function () {
  var $main = $('#main');
  var commonTmpl = $('#commonTmpl').html();
  var layoutTmpl = $('#layoutTmpl').html();
  var templateList = [];
  var renderCommonTmpl = _.template(commonTmpl);
  var renderLayoutTmpl = _.template(layoutTmpl);

  for (var i = 0; i < candidates.length; i++) {
    templateList.push(renderCommonTmpl({ config: candidates[i] }));
  }

  console.log(candidates)
  $main.append(renderLayoutTmpl({ templateList: templateList }));

  $main.on('click', '.result', function (e) {
    var $elem = $(this);

    if ($elem.hasClass('selected')) return false;

    $elem.addClass('selected self');
  });
});