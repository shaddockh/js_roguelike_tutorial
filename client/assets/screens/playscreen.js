var Game = require('../game');
var ROT = require('rot-js').ROT;

var playScreen = require('./basescreen')('Play');

var world = null,
  centerX = 0,
  centerY = 0;

// Define our playing screen
playScreen.enter = function () {
  console.log("Entered play screen.");

  var WorldBuilder = require('../worldbuilder');

  var levelWidth = 500,
    levelHeight = 500;

  var builder = WorldBuilder.CellularAutomata(levelWidth, levelHeight)
    .smooth(3)
    .randomizeTiles();

  // Create our map from the tiles
  world = builder.build();
};
//  exit: function () {
//    console.log("Exited play screen.");
//  },
playScreen.render = function (display) {

  var screenWidth = Game.getScreenWidth();
  var screenHeight = Game.getScreenHeight();
  // Make sure the x-axis doesn't go to the left of the left bound
  var topLeftX = Math.max(0, centerX - (screenWidth / 2));
  // Make sure we still have enough space to fit an entire game screen
  topLeftX = Math.min(topLeftX, world.getWidth() - screenWidth);
  // Make sure the y-axis doesn't above the top bound
  var topLeftY = Math.max(0, centerY - (screenHeight / 2));
  // Make sure we still have enough space to fit an entire game screen
  topLeftY = Math.min(topLeftY, world.getHeight() - screenHeight);
  for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
    for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
      // Fetch the glyph for the tile and render it to the screen
      // at the offset position.
      var glyph = world.getTile(x, y).getGlyph();
      display.draw(
        x - topLeftX,
        y - topLeftY,
        glyph.getChar(),
        glyph.getForeground(),
        glyph.getBackground());
    }
  }
  // Render the cursor
  display.draw(
    centerX - topLeftX,
    centerY - topLeftY,
    '@',
    'white',
    'black');
};

playScreen.move = function (dX, dY) {

  // Positive dX means movement right
  // negative means movement left
  // 0 means none
  centerX = Math.max(0,
    Math.min(world.getWidth() - 1, centerX + dX));
  // Positive dY means movement down
  // negative means movement up
  // 0 means none
  centerY = Math.max(0,
    Math.min(world.getHeight() - 1, centerY + dY));
};

playScreen.handleInput = function (inputType, inputData) {
  if (inputType === 'keydown') {

    switch (inputData.keyCode) {
      // If enter is pressed, go to the win screen
    case ROT.VK_RETURN:
      Game.switchScreen(require('./winScreen'));
      break;
      // If escape is pressed, go to lose screen
    case ROT.VK_ESCAPE:
      Game.switchScreen(require('./loseScreen'));
      break;
      // Movement
    case ROT.VK_LEFT:
    case ROT.VK_H:
      playScreen.move(-1, 0);
      break;
    case ROT.VK_RIGHT:
    case ROT.VK_L:
      playScreen.move(1, 0);
      break;
    case ROT.VK_UP:
    case ROT.VK_K:
      playScreen.move(0, -1);
      break;
    case ROT.VK_DOWN:
    case ROT.VK_J:
      playScreen.move(0, 1);
      break;
    }
  }

};

module.exports = playScreen;
