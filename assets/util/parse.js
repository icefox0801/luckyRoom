'use strict';
// 从字符串解析出楼号、楼层、房间号
module.exports = function (str) {
  var obj = {};
  var match = /^(\d{1,2})-(\d{1,2})0(\d)$/i.exec(str);

  if (match) {
    obj.buildingNo = match[1];
    obj.floorNo = match[2];
    obj.roomNo = match[3];
  }

  return obj;
};
