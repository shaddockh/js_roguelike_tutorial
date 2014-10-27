var Screen = require('./basescreen');
var loseScreen = new Screen('Lose');

// Define our winning screen
loseScreen.render = function (display) {
  // Render our prompt to the screen
  for (var i = 0; i < 22; i++) {
    display.drawText(2, i + 1, "%b{red}You lose! :(");
  }
};

module.exports = loseScreen;
