'use strict';
var _ = require('lodash');
var $ = require('jquery');
require('bootstrap/dist/css/bootstrap.css');
window.jQuery = window.$ = $;
var bootstrap = require('bootstrap');
// 获取ID
var getId = function (bNum, fIndex, rIndex) {
  return bNum + '-' + fIndex + '0' + rIndex;
}
// 获取标题
var getTitle = function (bNum, fIndex, rIndex, bTitle) {
  return (bTitle || '') + bNum + '号楼' + fIndex + '0' + rIndex;
}
// 获取户型
var getLayout = function (bNum, fIndex, rIndex, bId) {
  var big = [2, 2, 2];
  var middle = [2, 2, 2, 2];
  var mixed = [2, 1, 1, 2];
  var layoutMap = {
    '1,4,5,25': mixed,
    '2,3': big,
    '6,7,23,24': middle
  }
  var JINYILayoutMap = {
    '3,6,8,9,10,11,12,13,14,22,23,24,25,26,27,28': middle,
    '15,17,20,21': mixed
  }
  var JINYOULayoutMap = {
    '8,9,16,17,18,19,20,21,22,30,32': middle,
    '10,11,31,33,34,36': mixed
  }
  bNum = bNum + '';

  if (bId === 'JINYI') layoutMap = JINYILayoutMap;

  if (bId === 'JINYOU') layoutMap = JINYOULayoutMap;

  for(var key in layoutMap) {
    if(~key.split(',').indexOf(bNum)) {
      return layoutMap[key][rIndex - 1];
    }
  }
  return 0;
}
// 获取户型得分
var getRScore = function (bNum, fIndex, rIndex, bId) {
  var big = [4.3, 4.5, 4.6];
  var middle = [3.4, 3.2, 3.2, 3.6];
  var mixed = [3.5, 3.3, 3.3, 3.7];
  var scoreMap = {
    '1,4,5,25': mixed,
    '2,3': big,
    '6,7,23,24': middle
  }
  var JINYIScoreMap = {
    '3,6,8,9,10,11,12,13,14,22,23,24,25,26,27,28': middle,
    '15,17,20,21': mixed
  }
  var JINYOUScoreMap = {
    '8,9,16,17,18,19,20,21,22,30,32': middle,
    '10,11,31,33,34,36': mixed
  }
  bNum = bNum + '';

  if (bId === 'JINYI') scoreMap = JINYIScoreMap;

  if (bId === 'JINYOU') scoreMap = JINYOUScoreMap;

  for(var key in scoreMap) {
    if(~key.split(',').indexOf(bNum)) {
      return scoreMap[key][rIndex - 1];
    }
  }
  return 0;
}

// 获取楼号得分
var getBScore = function (bNum, fIndex, rIndex, bId) {
  var scoreMap = {
    '1,24,25': 4.2,
    '2,3,4,23': 4,
    '5': 3.9,
    '6': 3.7,
    '7': 3.8
  }
  var JINYIScoreMap = {
    '3': 4.2,
    '6,8,9,10': 4,
    '11,12,24,25,26,27,28': 3.9,
    '13,14,22,23': 3.8,
    '15': 3.7,
    '17': 4.3,
    '20,21': 4.1,
  }
  var JINYOUScoreMap = {
    '8,9,10,11': 3.6,
    '16,17,18': 4.3,
    '19,20,21,22': 3.9,
    '30': 4.1,
    '31,32,33,34': 4.2,
    '36': 3.8
  }
  bNum = bNum + '';

  if (bId === 'JINYI') scoreMap = JINYIScoreMap;

  if (bId === 'JINYOU') scoreMap = JINYOUScoreMap;

  for(var key in scoreMap) {
    if(~key.split(',').indexOf(bNum)) {
      return scoreMap[key];
    }
  }
  return 0;
}
// 获取楼层得分
var getFScore = function (bNum, fIndex, rIndex, bId) {
  fIndex = fIndex + '';
  var floor18 = {
    '1': 4,
    '2': 3.8,
    '3,4,5': 4.3,
    '6,7': 4.4,
    '8,9,10,11': 4.3,
    '12,13,14': 4.4,
    '15,16,17': 4.5,
    '18': 3.6
  };
  var floor11 = {
    '1': 4,
    '2': 3.8,
    '3,4,5': 4.4,
    '6,7': 4.4,
    '8,9,10': 4.5,
    '11': 3.5
  };
  var floor26 =  {
    '1': 4,
    '2': 3.8,
    '3,4,5': 4.2,
    '6,7,8,9,10': 4.4,
    '11,12,13,14': 4.2,
    '15,16,17,18,19,20': 4.3,
    '21,22,23,24,25': 4.2,
    '26': 3.5
  };
  var scoreMap = {
    '1,4,5,6,7,25': floor18,
    '2,3': floor11,
    '23,24': floor26
  }
  var JINYIScoreMap = {
    '3,6,8,9,10,15,17,20,21': floor18,
    '11,12,13,14,22,23,24,25,26,27,28': floor26
  }
  var JINYOUScoreMap = {
    '8,9,10,11,16,17,18,30,31,32,33,34,36': floor18,
    '19,20,21,22': floor26
  }
  bNum = bNum + '';

  if (bId === 'JINYI') scoreMap = JINYIScoreMap;

  if (bId === 'JINYOU') scoreMap = JINYOUScoreMap;

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
// 候选配置信息
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
}, {
  remain: true,
  bId: 'JINYI',
  bTitle: '金谊花园',
  list: [
    '3-1802',
    '6-1802',
    '8-1802',
    '8-1803',
    '9-1802',
    '9-1803',
    '10-1803',
    '11-2601',
    '11-2602',
    '11-2603',
    '12-2601',
    '12-2602',
    '12-2603',
    '13-2601',
    '13-2602',
    '13-2603',
    '14-2601',
    '14-2602',
    '14-2603',
    '15-1802',
    '15-1803',
    '17-1803',
    '20-1803',
    '21-1802',
    '21-1803',
    '22-2602',
    '22-2603',
    '23-2601',
    '23-2602',
    '23-2603',
    '24-2601',
    '24-2602',
    '24-2603',
    '25-2602',
    '25-2603',
    '26-2602',
    '26-2603',
    '27-2602',
    '27-2603',
    '28-2601',
    '28-2602',
    '28-2603'
  ]
}, {
  remain: true,
  bId: 'JINYOU',
  bTitle: '金友花园',
  list: [
    '8-1802',
    '9-1802',
    '9-1804',
    '10-202',
    '10-203',
    '10-1702',
    '10-1802',
    '10-1803',
    '11-202',
    '11-1002',
    '11-1802',
    '11-1803',
    '16-1802',
    '16-1803',
    '17-1802',
    '18-1802',
    '18-1803',
    '19-2602',
    '19-2603',
    '20-2601',
    '20-2602',
    '20-2603',
    '21-2602',
    '21-2603',
    '22-2602',
    '22-2603',
    '30-1802',
    '31-202',
    '31-203',
    '31-1003',
    '31-1203',
    '31-1602',
    '31-1702',
    '31-1802',
    '31-1803',
    '32-1801',
    '32-1802',
    '32-1803',
    '33-202',
    '33-402',
    '33-403',
    '33-703',
    '33-1002',
    '33-1402',
    '33-1403',
    '33-1602',
    '33-1702',
    '33-1802',
    '33-1803',
    '34-202',
    '34-503',
    '34-1402',
    '34-1702',
    '34-1703',
    '34-1802',
    '34-1803',
    '36-202',
    '36-203',
    '36-1503',
    '36-1703',
    '36-1802',
    '36-1803'
  ]
}]

var config, floor, room, match;

for(var i = 0, len = candidates.length; i < len; i++) {
  config = candidates[i];
  config.building = [];

  if (config.remain) {

    for(var j = 0; j < config.list.length; j++) {
      match = /^(\d{1,2})-(\d{1,2})0(\d)$/i.exec(config.list[j]);
      room = {};
      room.id = config.bId + config.list[j];
      room.index = i;
      room.bIndex = match[1];
      room.fIndex = match[2];
      room.rIndex = match[3];
      room.bScore = getBScore(room.bIndex, room.fIndex, room.rIndex, config.bId);
      room.fScore = getFScore(room.bIndex, room.fIndex, room.rIndex, config.bId);
      room.rScore = getRScore(room.bIndex, room.fIndex, room.rIndex, config.bId);
      room.layout = getLayout(room.bIndex, room.fIndex, room.rIndex, config.bId);
      room.title = getTitle(room.bIndex, room.fIndex, room.rIndex, config.bTitle);
      config.building.push(room);
    }

  } else {

    for(var f = 1; f <= config.fNum; f++) {
      floor = [];

      for(var r = 1; r <= config.rNum; r++) {
        room = {};
        room.id = getId(config.bNum, f, r);
        room.title = getTitle(config.bNum, f, r);
        room.index = i;
        room.bIndex = config.bNum;
        room.fIndex = f;
        room.rIndex = r;
        room.bScore = getBScore(config.bNum, f, r);
        room.fScore = getFScore(config.bNum, f, r);
        room.rScore = getRScore(config.bNum, f, r);
        room.layout = getLayout(config.bNum, f, r);
        floor.push(room);
      }

      config.building.push(floor);
    }

  }

}
// 开始倒计时
function countDown ($cdElem, finish) {
  var total = 60;
  var remain = total;
  var timer = setInterval(function() {
    var $chosen = $('.self');
    $cdElem.text(--remain);

    if ($chosen.length > 0) {
      clearInterval(timer);
      finish(total, remain);
    }

    if (remain === 0) {
      clearInterval(timer);
      finish();
    }

  }, 1000)
  $cdElem.text(total);
  return timer;
}
// 获取列表
function getRoomList () {
  var roomList = [];
  var config;
  var building, floor, room;

  for(var i = 0; i < candidates.length; i++) {
    config = candidates[i];
    building = candidates[i].building;

    if(config.remain) {

      for(var r = 0; r < building.length; r++) {
        room = building[r];
        roomList.push(room);
      }

    } else {

      for(var j = 0; j < building.length; j++) {

        floor = building[j];

        for(var k = 0; k < floor.length; k++) {
          room = floor[k];
          roomList.push(room);
        }

      }

    }

  }

  return roomList;
}
// 常量
var COUNT = 680; // 人数
var GIVE_UP_RATIO = 0.05; // 放弃概率
var WEIGHT_MAP = {
  layout: 10,
  rScore: 4,
  fScore: 4,
  bScore: 2
}

function randomWeightFactor () {
  var random = Math.random();
  var times = parseInt(4 + Math.random() * 8, 10);
  return 1 - Math.pow(1 - random, times);
}

function randomWeight (weightMap) {
  var randomWeightMap = {};
  var total = weightMap.layout + weightMap.rScore + weightMap.fScore + weightMap.bScore;
  var randomLayout = weightMap.layout * randomWeightFactor();
  var randomRScore = weightMap.rScore * randomWeightFactor();
  var randomFScore = weightMap.fScore * randomWeightFactor();
  var randomBScore = weightMap.bScore * randomWeightFactor();
  var randomTotal = randomLayout + randomRScore + randomFScore + randomBScore;
  var ratio = total / randomTotal;
  randomWeightMap.layout = randomLayout * ratio;
  randomWeightMap.rScore = randomRScore * ratio;
  randomWeightMap.fScore = randomFScore * ratio;
  randomWeightMap.bScore = randomBScore * ratio;
  randomWeightMap.layout = parseFloat(randomWeightMap.layout.toFixed(2));
  randomWeightMap.rScore = parseFloat(randomWeightMap.rScore.toFixed(2));
  randomWeightMap.fScore = parseFloat(randomWeightMap.fScore.toFixed(2));
  randomWeightMap.bScore = parseFloat(randomWeightMap.bScore.toFixed(2));
  return randomWeightMap;
}
// 获取总分
function getTotalScore (room, weightMap) {
  var layout = (room.layout === 2 ? 5 : 4) * weightMap.layout;
  var rScore = room.rScore * weightMap.rScore;
  var fScore = room.fScore * weightMap.fScore;
  var bScore = room.bScore * weightMap.bScore;
  var totalScore = layout + rScore + fScore + bScore;
  totalScore = parseInt(totalScore - Math.random() * 10, 10);
  return layout + rScore + fScore + bScore;
}

function giveUp () {
  return Math.random() < GIVE_UP_RATIO;
}

function topLoss () {
  return 1 - Math.pow((1 - Math.random()), 8);
}

function isTop (room) {
  var config = candidates[room.index];
  return room.fIndex === config.fNum;
}

$(function () {
  var timer;
  var giveUpCount = 0;
  var remainDouble = 0;
  var $main = $('#main');
  var $start = $('.start');
  var $footer = $('#footer');
  var $modal = $('#modal');
  var $message = $('#message');
  var $cdElem = $('.count-down');
  var commonTmpl = $('#commonTmpl').html();
  var remainTmpl = $('#remainTmpl').html();
  var layoutTmpl = $('#layoutTmpl').html();
  var templateList = [];
  var roomList = getRoomList();
  var renderCommonTmpl = _.template(commonTmpl);
  var renderRemainTmpl = _.template(remainTmpl);
  var renderLayoutTmpl = _.template(layoutTmpl);
  // 选房或者倒计时结束
  var finish = function (total, remain) {

    $main.addClass('mask');

    if (!remain) {
      $message.text('很遗憾，您没有在规定时间内完成选房。有' + giveUpCount + '人放弃选房，还有' + remainDouble + '套两居室剩余');
    } else {
      $message.text('您选中了' + $('.self').data('title') + '，耗时' + (total - remain) + '秒。有' + giveUpCount + '放弃选房，还有' + remainDouble + '套两居室剩余');
    }

    $modal.modal('show');
  }
  // 选房
  function selectRoom () {
    var selectedRoom;
    var weightMap = randomWeight(WEIGHT_MAP);
    var topLossRatio = topLoss();

    if (giveUp()) {
      giveUpCount++;
      return null;
    }

    var selectList = roomList.filter(function (room) {
      return !room.selected;
    });

    selectList = selectList.sort(function (aRoom, bRoom) {
      var aTotalScore, bTotalScore;
      aTotalScore = getTotalScore(aRoom, weightMap) * (isTop(aRoom) ? topLossRatio : 1);
      bTotalScore = getTotalScore(bRoom, weightMap) * (isTop(bRoom) ? topLossRatio : 1);
      return bTotalScore - aTotalScore;
    });

    selectedRoom = selectList[0];
    selectedRoom.selected = true;

    if (!selectedRoom) giveUpCount++;

    return selectedRoom ? selectedRoom : null;
  }
  // 生成所有表格
  for (var i = 0; i < candidates.length; i++) {

    if (candidates[i].remain) {
      templateList.push(renderRemainTmpl({ config: candidates[i] }));
    } else {
      templateList.push(renderCommonTmpl({ config: candidates[i] }));
    }

  }

  $main.append(renderLayoutTmpl({ templateList: templateList }));
  // 选房
  $main.on('click', '.result', function (e) {
    var $elem = $(this);

    if ($elem.hasClass('selected')) return false;

    $elem.addClass('selected self');
  });
  // 开始倒计时
  $start.on('click', function (e) {
    var selectedRoom;
    // 选房
    for (var p = 1; p <= COUNT; p++) {
      selectedRoom = selectRoom();

      if (selectedRoom) {
        console.log('第%d人选择了：[%s]%s', p, selectedRoom.layout, selectedRoom.title );
        $('[data-id="' + selectedRoom.id + '"]').addClass('selected');
      }

    }

    remainDouble = roomList.filter(function (room) {
      return room.layout === 2 && !room.selected;
    }).length;

    console.log('有%d人放弃选房，还有%d套两居室剩余！', giveUpCount, remainDouble);

    var $this = $(this);
    $main.removeClass('mask');
    $footer.remove();
    $this.attr('disabled', true);
    countDown($cdElem, finish);
  });
});
