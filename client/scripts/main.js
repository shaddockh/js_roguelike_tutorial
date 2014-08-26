/*global $*/

module.exports.run = function () {
  var adder = require('./adder');
  $('#result').text(adder.add(2, 2));
};
