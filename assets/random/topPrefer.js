'use strict';
var factors = require('./factors');

module.exports = function () {
  return 1 - Math.pow((1 - Math.random()), factors.RANDOM_FACTOR);
};
