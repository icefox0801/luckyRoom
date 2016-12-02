'use strict';
var constants = require('./constants');

module.exports = {
  COMMON: {
    layout: {
      '1,4,5,25': constants.MIXED4,
      '2,3': constants.BIG3,
      '6,7,23,24': constants.MIDDLE4
    },
    floor: {
      '2,3': constants.F11,
      '1,4,5,6,7,25': constants.F18,
      '23,24': constants.F26
    }
  },
  JINYI: {
    layout: {
      '3,6,8,9,10,11,12,13,14,22,23,24,25,26,27,28': constants.MIDDLE4,
      '15,17,20,21': constants.MIXED4
    },
    floor: {
      '3,6,8,9,10,15,17,20,21': constants.F18,
      '11,12,13,14,22,23,24,25,26,27,28': constants.F26
    }
  },
  JINYOU: {
    layout: {
      '8,9,16,17,18,19,20,21,22,30,32': constants.MIDDLE4,
      '10,11,31,33,34,36': constants.MIXED4
    },
    floor: {
      '8,9,10,11,16,17,18,30,31,32,33,34,36': constants.F18,
      '19,20,21,22': constants.F26
    }
  }
};
