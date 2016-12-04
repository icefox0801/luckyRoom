'use strict';
var factors = require('./factors');

function randomWeightFactor () {
  var random = Math.random();
  var times = parseInt(4 + Math.random() * factors.RANDOM_FACTOR, 10);
  return 1 - Math.pow(1 - random, times);
}

module.exports = function () {
  var weightMap = factors.WEIGHT_MAP;
  var randomWeightMap = {};
  var total = weightMap.rScore + weightMap.fScore + weightMap.bScore;
  // 将所有权重进行波动
  var randomRScore = weightMap.rScore * randomWeightFactor();
  var randomFScore = weightMap.fScore * randomWeightFactor();
  var randomBScore = weightMap.bScore * randomWeightFactor();
  var randomTotal = randomRScore + randomFScore + randomBScore;
  // 将所有权重之和回归20
  var scale = total / randomTotal;
  randomWeightMap.rScore = randomRScore * scale;
  randomWeightMap.fScore = randomFScore * scale;
  randomWeightMap.bScore = randomBScore * scale;
  // 保留两位小数
  randomWeightMap.rScore = parseFloat(randomWeightMap.rScore.toFixed(2));
  randomWeightMap.fScore = parseFloat(randomWeightMap.fScore.toFixed(2));
  randomWeightMap.bScore = parseFloat(randomWeightMap.bScore.toFixed(2));

  return randomWeightMap;
};
