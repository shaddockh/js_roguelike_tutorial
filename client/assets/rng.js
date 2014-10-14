//Random number generator

var ROT = require('./rot');
var RNG = (function () {

  var api = {};
  api.random = function () {
    return ROT.RNG.getUniform();
  };

  api.randomIntInRange = function (min, max) {
    return Math.floor(api.random() * (max + 1 - min) + min);
  };

  api.setSeed = function (seed) {
    ROT.RNG.setSeed(seed);
  };

  api.getSeed = function () {
    return ROT.RNG.getSeed();
  };

  api.randomizeArray = function (array) {
    //TODO: need a better way - randomize is part of ROT
    return array.randomize();
  };

  api.randomArrayElement = function (array) {
    var el = array[api.randomIntInRange(0, array.length - 1)];
    console.log('Finding random array element: ' + el);
    return el;
  };

  return api;

})();

module.exports = RNG;
