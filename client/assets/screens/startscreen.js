var Game = require('../game');
var ROT = require('rot');
var gameconfig = require('../gameconfig');
var Singletons = require('../singletons');
var Screen = require('./basescreen');
var startScreen = new Screen('Start');

//  enter: function () {
//    console.log("Entered start screen.");
//  },
//  exit: function () {
//    console.log("Exited start screen.");
//  },
startScreen.render = function (display) {
  // Render our prompt to the screen
  display.drawText(1, 1, "%c{yellow}Javascript Roguelike");
  display.drawText(1, 5, "Random Seed: " + Singletons.RNG.getSeed());
  display.drawText(1, 10, "While playing, press [?] for help.");
  display.drawText(1, 22, "Press [Enter] to start!");
};
startScreen.handleInput = function (inputType, inputData) {
  // When [Enter] is pressed, go to the play screen
  if (inputType === 'keydown') {
    if (inputData.keyCode === ROT.VK_RETURN) {
      Game.switchScreen('PlayScreen');
    }
  }
};

module.exports = startScreen;
