'use strict';
var $ = require('jquery');
require('bootstrap/dist/css/bootstrap.css');
window.jQuery = window.$ = $;
require('bootstrap');

var projectConfig = require('./config/project');
var roomList = require('./roomList');

var renderCommonTmpl = require('./template/common.ejs');
var renderRemainTmpl = require('./template/remain.ejs');
var renderLayoutTmpl = require('./template/layout.ejs');

var factors = require('./random/factors');

var baseWeiget = factors.WEIGHT_MAP;

var app = {};
// 已选数量
app.selectCount = 0;
// 已选数量DOM
app.$selectCount = null;
// 剩余数量
app.remainCount = 0;
// 剩余两居室
app.remainDouble = 0;
// 剩余两居室DOM
app.$remainDouble = null;
// 剩余最佳
app.remainBest = '';
// 剩余最佳DOM
app.$remainBest = null;
// 更多最佳
app.$moreBest = null;
// 房源列表
app.roomList = roomList;
// 主DOM
app.$main = null;
// 程序入口
app.initialize = function () {
  app.$main = $('#main');
  app.$selectCount = $('#selectCount');
  app.$remainDouble = $('#remainDouble');
  app.$remainBest = $('#remainBest');
  app.$moreBest = $('#moreBest');
  app.renderTables();
  app.updatePrompt();
};
// 渲染所有列表
app.renderTables = function () {
  var templateList = [];
  var data = null;
  var selected = JSON.parse(localStorage.getItem('selectedRoom')) || [];

  app.roomList.forEach(function (room) {
    room.selected = !!~selected.indexOf(room.id);
    room.score = Math.round(room.getTotalScore(baseWeiget));
  });

  projectConfig.forEach(function (config) {
    if (config.remain) {
      data = roomList.filter(function(room) {
        return room.config.communityId === config.communityId;
      });
      templateList.push(renderRemainTmpl({
        title: config.communityName,
        list: data
      }));
    } else {
      data = roomList.filter(function(room) {
        return room.bNo === config.building;
      });
      templateList.push(renderCommonTmpl({
        title: config.building + '号楼',
        list: data,
        room: config.room
      }));
    }
  });

  app.$main.append(renderLayoutTmpl({ templateList: templateList }));
};
// 更新数量
app.updatePrompt = function () {
  app.selectCount = app.roomList.filter(function (room) {
    return room.selected;
  }).length;
  app.remainDouble = app.roomList.filter(function (room) {
    return room.bedroom === 2 && !room.selected;
  }).length;
  var unselected = app.roomList.filter(function (room) {
    return !room.selected;
  }).sort(function (aRoom, bRoom) {
    return bRoom.score - aRoom.score;
  });
  var moreBestHTML = unselected.slice(0, 10).map(function (room) {
    return '<li><a href="javascript:void(0);">' + room.title + '</a></li>';
  });
  app.remainBest = unselected[0].id;
  app.$selectCount.text(app.selectCount);
  app.$remainDouble.text(app.remainDouble);
  app.$remainBest.text(unselected[0].title);
  app.$moreBest.html(moreBestHTML);
};
// 选择房源
app.select = function (id) {
  var selected = JSON.parse(localStorage.getItem('selectedRoom')) || [];
  var index = selected.indexOf(id);

  if (!~index) {
    selected.push(id);
    localStorage.setItem('selectedRoom', JSON.stringify(selected));
  }

  app.roomList.forEach(function (room) {
    if (room.id === id) {
      room.selected = true;
      return false;
    }
  });

  app.updatePrompt();
};
// 取消选择
app.unselect = function (id) {
  var selected = JSON.parse(localStorage.getItem('selectedRoom')) || [];
  var index = selected.indexOf(id);

  if (~index) {
    selected.splice(index, 1);
    localStorage.setItem('selectedRoom', JSON.stringify(selected));
  }

  app.roomList.forEach(function (room) {
    if (room.id === id) {
      room.selected = false;
      return false;
    }
  });

  app.updatePrompt();
};
// 清空选择
app.clear = function () {
  localStorage.removeItem('selectedRoom');
  app.roomList.forEach(function (room) {
    room.selected = false;
  });
  app.updatePrompt();
};

$(function () {
  app.initialize();
  var $modal = $('#modal');
  var $message = $('#message');
  var $confirm = $('#confirm');
  var $clear = $('#clear');
  var $footer = $('#footer');
  // 选择房源
  app.$main.on('click', '.result', function (e) {
    var $elem = $(this);
    var id = $elem.data('id');

    if ($elem.hasClass('selected')) {
      $modal.modal();
      $message.text('确认要取消选择' + $elem.data('title') + '吗？');
      $confirm.data('id', id);
      return false;
    }

    app.select(id);
    $elem.addClass('selected');
  });
  // 确认取消选择
  $confirm.on('click', function (e) {
    var $elem = $(this);
    var id = $elem.data('id');
    app.unselect(id);
    $('[data-id="' + id + '"]').removeClass('selected');
    $modal.modal('hide');
  });
  // 清空选择
  $clear.on('click', function (e) {
    app.clear();
    $('.selected').removeClass('selected');
    $modal.modal('hide');
  });
});
