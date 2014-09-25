var Game = require('../game');
var ROT = require('../rot');

var playScreen = require('./basescreen')('Play');

var world = null,
  centerX = 0,
  centerY = 0,
  player = null;

var BlueprintCatalog = require('../entities').BlueprintCatalog;
var Entity = require('../entity');

// Define our playing screen
playScreen.enter = function () {
  console.log("Entered play screen.");

  var WorldBuilder = require('../worldbuilder');

  var builder = WorldBuilder.FungusLevel();

  // Create our map from the tiles
  world = builder.build();

  // Create our player and set the position
  player = new Entity(BlueprintCatalog.getBlueprint('PlayerTemplate'));
  world.addEntityAtRandomPosition(player);

  world.getEngine().start();
};

//  exit: function () {
//    console.log("Exited play screen.");
//  },
playScreen.render = function (display) {

  var screenWidth = Game.getScreenWidth();
  var screenHeight = Game.getScreenHeight();
  // Make sure the x-axis doesn't go to the left of the left bound
  var topLeftX = Math.max(0, player.getX() - (screenWidth / 2));
  // Make sure we still have enough space to fit an entire game screen
  topLeftX = Math.min(topLeftX, world.getWidth() - screenWidth);
  // Make sure the y-axis doesn't above the top bound
  var topLeftY = Math.max(0, player.getY() - (screenHeight / 2));
  // Make sure we still have enough space to fit an entire game screen
  topLeftY = Math.min(topLeftY, world.getHeight() - screenHeight);

  // Iterate through all visible map cells
  for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
    for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
      // Fetch the glyph for the tile and render it to the screen
      // at the offset position.
      var tile = world.getTile(x, y);
      tile.draw(display, x - topLeftX, y - topLeftY);
    }
  }

  // Render the entities
  var entities = world.getEntities();
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    // Only render the entitiy if they would show up on the screen
    if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
      entity.getX() < topLeftX + screenWidth &&
      entity.getY() < topLeftY + screenHeight) {
      entity.draw(display, entity.getX() - topLeftX, entity.getY() - topLeftY);
    }
  }

  // Render the player
  //player.draw(
  //display,
  //player.getX() - topLeftX,
  //player.getY() - topLeftY
  //);

};

playScreen.move = function (dX, dY) {
  var newX = player.getX() + dX;
  var newY = player.getY() + dY;
  // Try to move to the new cell
  player.tryMove(newX, newY, world);
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
    // Unlock the engine
    world.getEngine().unlock();
  }

};

module.exports = playScreen;
