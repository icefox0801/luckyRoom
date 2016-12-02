'use strict';
var template = require('lodash/template');
var $ = require('jquery');
require('bootstrap/dist/css/bootstrap.css');
window.jQuery = window.$ = $;
require('bootstrap');

var projectConfig = require('./config/project');
var roomList = require('./roomList');
var Person = require('./Person');

var app = {};
// 总人数
app.COUNT = 680;
// 放弃人数
app.giveUpCount = 0;
// 剩余两居室
app.remainDouble = 0;
// 选房人列表
app.personList = [];
// 房源列表
app.roomList = roomList;
// 主DOM
app.$main = null;
// 开始选房按钮个
app.$start = null;
// 程序入口
app.initialize = function () {
  app.$main = $('#main');
  app.$start = $('.start');
  app.renderTables();
  // 初始化所有选房人
  for (var i = 0; i < app.COUNT; i++) {
    app.personList.push(new Person(i));
  }
};
// 开始选房
app.start = function () {
  app.personList.forEach(function (person) {
    if (person.giveUp) {
      app.giveUpCount++;
      console.warn('第%d人放弃了选房', person.index);
      return true;
    }

    var selected = person.select(app.roomList);

    if (!selected) {
      console.info('第%d人未选到房源');
    } else {
      console.info('第%d人选择了：[%s]%s', person.index, selected.bedroom, selected.title);
      ;
    }
  });

  app.remainDouble = roomList.filter(function (room) {
    return room.bedroom === 2 && !room.selected;
  }).length;

  console.info('有%d人放弃选房，还有%d套两居室剩余', app.giveUpCount, app.remainDouble);
};
app.markSelected = function () {
  var selectedList = app.roomList.filter(function (room) {
    return room.selected;
  });
  var segment = 50;
  var renderSegment = function (start, end) {
    if (end >= selectedList.length - 1) return false;
    var listStr = selectedList.slice(start, end).map(function (room) {
      return '[data-id="' + room.id + '"]';
    }).join(',');
    // 标记选择的房源
    $(listStr).addClass('selected');
    setTimeout(function () {
      renderSegment(start + segment, end + segment);
    }, 0);
  };

  renderSegment(0, segment);
};
// 渲染所有列表
app.renderTables = function () {
  var templateList = [];
  var data = null;
  var commonTmpl = $('#commonTmpl').html();
  var remainTmpl = $('#remainTmpl').html();
  var layoutTmpl = $('#layoutTmpl').html();
  var renderCommonTmpl = template(commonTmpl);
  var renderRemainTmpl = template(remainTmpl);
  var renderLayoutTmpl = template(layoutTmpl);

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
// 开始倒计时
app.countDown = function ($cdElem, finish) {
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
  }, 1000);
  $cdElem.text(total);
  return timer;
};
// 选房或倒计时结束
app.finish = function (total, remain) {
  var $modal = $('#modal');
  var $message = $('#message');
  var $self = $('.self');
  app.$main.addClass('mask');

  if (!remain) {
    $message.text('很遗憾，您没有在规定时间内完成选房。有' + app.giveUpCount + '人放弃选房，还有' + app.remainDouble + '套两居室剩余');
  } else {
    $message.text('您选中了' + $self.data('title') + '，耗时' + (total - remain) + '秒。有' + app.giveUpCount + '人放弃选房，还有' + app.remainDouble + '套两居室剩余');
  }

  $modal.modal('show');
};

$(function () {
  app.initialize();
  var $footer = $('#footer');
  var $cdElem = $('.count-down');
  // 选择房源
  app.$main.on('click', '.result', function (e) {
    var $elem = $(this);

    if ($elem.hasClass('selected')) return false;

    $elem.addClass('selected self');
  });
  // 开始倒计时
  app.$start.on('click', function (e) {
    var $this = $(this);
    app.$main.removeClass('mask');
    $footer.remove();
    $this.attr('disabled', true);
    app.start();
    app.markSelected();
    app.countDown($cdElem, app.finish);
  });
});
