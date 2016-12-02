'use strict';
var factors = require('./factors');

module.exports = function () {
  return Math.random() < factors.GIVE_UP_RATIO;
};
