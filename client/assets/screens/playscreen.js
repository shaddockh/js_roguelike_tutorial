var Game = require('../game');
var ROT = require('../rot');
var Singletons = require('../singletons');

var playScreen = require('./basescreen')('Play');

var world = null,
  centerX = 0,
  centerY = 0,
  player = null;

var Entity = require('../entity');

// Define our playing screen
playScreen.enter = function () {
  console.log("Entered play screen.");

  var WorldBuilder = require('../worldbuilder');

  //Build our level
  world = WorldBuilder.WorldBuilder.buildWorld({});
  // Create our player and set the position
  player = Singletons.Player;
  world.getActiveLevel().addEntityAtRandomPosition(player);
  world.getEngine().start();

  function tryanims() {

    // var nextChar = Tile.floorTile.getChar() === '.' ? '?' : '.';
    //Tile.floorTile.setChar(nextChar);
    //Game.refresh();
    //setTimeout(tryanims, 1000);
  }
  //tryanims();
  Game.refresh();

};

//  exit: function () {
//    console.log("Exited play screen.");
//  },
var vsprintf = require('sprintf-js').vsprintf;
playScreen.render = function (display) {

  var currentLevel = world.getActiveLevel();
  var screenWidth = Game.getScreenWidth();
  var screenHeight = Game.getScreenHeight();
  // Make sure the x-axis doesn't go to the left of the left bound
  var topLeftX = Math.max(0, player.getX() - (screenWidth / 2));
  // Make sure we still have enough space to fit an entire game screen
  topLeftX = Math.min(topLeftX, currentLevel.getWidth() - screenWidth);
  // Make sure the y-axis doesn't above the top bound
  var topLeftY = Math.max(0, player.getY() - (screenHeight / 2));
  // Make sure we still have enough space to fit an entire game screen
  topLeftY = Math.min(topLeftY, currentLevel.getHeight() - screenHeight);

  // Draw the current viewport
  currentLevel.drawViewPort(display, topLeftX, topLeftY, topLeftX + screenWidth, topLeftY + screenHeight);

  // Get the messages in the player's queue and render them
  var messageY = 0;
  var messages = player.getMessages();
  messages.forEach(function (message) {
    // Draw each message, adding the number of lines
    messageY += display.drawText(
      0,
      messageY,
      '%c{white}%b{black}' + message
    );
  });

  // Render player HP
  var stats = '%c{white}%b{black}';
  stats += vsprintf('HP: %d/%d ', [player.getHp(), player.getMaxHp()]);
  display.drawText(0, screenHeight, stats);
};

playScreen.gameEnded = false;

playScreen.move = function (dX, dY) {
  var newX = player.getX() + dX;
  var newY = player.getY() + dY;
  // Try to move to the new cell
  player.tryMove(newX, newY, world.getActiveLevel());
};

playScreen.userActivate = function (actionCode) {
  console.log('userActivate');
  player.playerActivate(player.getX(), player.getY(), world.getActiveLevel, actionCode);
};

playScreen.setGameEnded = function (value) {
  playScreen.gameEnded = value;
};

playScreen.handleInput = function (inputType, inputData) {
  // If the game is over, enter will bring the user to the losing screen.
  if (playScreen.gameEnded) {
    if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
      Game.switchScreen(require('./loseScreen'));
    }
    // Return to make sure the user can't still play
    return;
  }

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
    default:
      //not a valid key
      return;
    }
  } else if (inputType === 'keypress') {
    var keyChar = String.fromCharCode(inputData.charCode);
    if (keyChar === '>') {
      playScreen.userActivate('>');
    } else if (keyChar === '<') {
      playScreen.userActivate('<');
    } else {
      // Not a valid key
      return;
    }
  }
  // Unlock the engine
  world.getEngine().unlock();

};

module.exports = playScreen;
