var Game = require('../game');
var ROT = require('rot-js').ROT;

// Define our playing screen
module.exports = {
  enter: function () {
    console.log("Entered play screen.");
  },
  exit: function () {
    console.log("Exited play screen.");
  },
  render: function (display) {
    display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!");
    display.drawText(4, 6, "Press [Enter] to win, or [Esc] to lose!");
  },
  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      // If enter is pressed, go to the win screen
      // If escape is pressed, go to lose screen
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(require('./winScreen'));
      } else if (inputData.keyCode === ROT.VK_ESCAPE) {
        Game.switchScreen(require('./loseScreen'));
      }
    }
  }
};
