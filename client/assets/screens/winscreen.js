var ROT = require('rot');

var Screen = require('./basescreen');
var winScreen = new Screen('Win');

// Define our winning screen
//  enter: function () {
//    console.log("Entered win screen.");
//  },
//  exit: function () {
//    console.log("Exited win screen.");
//  },
winScreen.render = function (display) {
  // Render our prompt to the screen
  for (var i = 0; i < 22; i++) {
    // Generate random background colors
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var background = ROT.Color.toRGB([r, g, b]);
    display.drawText(2, i + 1, "%b{" + background + "}You win!");
  }
};
winScreen.handleInput = function (inputType, inputData) {
  // Nothing to do here
};

module.exports = winScreen;
