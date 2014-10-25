/*global $*/

//NOTE: This is a singleton

var ROT = require('rot');
var Singletons = require('./singletons');

var _display = null,
  _currentScreen = null;

var Game = {};
Game.config = require('./gameconfig');

function bindEventToScreen(event) {
  window.addEventListener(event, function (e) {
    // When an event is received, send it to the
    // screen if there is one
    if (_currentScreen !== null) {
      // Send the event type and data to the screen
      _currentScreen.handleInput(event, e);
    }
  });
}

Game.init = function ($container) {
  _display = new ROT.Display({
    width: Game.config.screenWidth,
    height: Game.config.screenHeight + 1
  });
  // Bind keyboard input events
  bindEventToScreen('keydown');
  bindEventToScreen('keypress');
  Singletons.initialize();

  // Add the container to our HTML page
  $container.append(Game.getDisplay().getContainer());
  // Load the start screen
  Game.switchScreen(Singletons.ScreenCatalog.getScreen('StartScreen'));
};

Game.refresh = function () {
  _display.clear();
  _currentScreen.render(_display);
};

Game.getDisplay = function () {
  return _display;
};

Game.getScreenWidth = function () {
  return Game.config.screenWidth;
};

Game.getScreenHeight = function () {
  return Game.config.screenHeight;
};

Game.canRun = function () {
  // Check if rot.js can work on this browser
  if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
    return false;
  }
  return true;
};

Game.switchScreen = function (screen) {
  if (typeof (screen) === 'string') {
    screen = Singletons.ScreenCatalog.getScreen(screen);
  }

  // If we had a screen before, notify it that we exited
  if (_currentScreen !== null) {
    _currentScreen.exit();
  }
  // Clear the display
  Game.getDisplay().clear();
  // Update our current screen, notify it we entered
  // and then render it
  _currentScreen = screen;
  if (_currentScreen !== null) {
    _currentScreen.enter();
    Game.refresh();
  }

};

var vsprintf = require('sprintf-js').vsprintf;
Game.sendMessage = function (recipient, message, args) {
  // Make sure the recipient can receive the message
  // before doing any work.
  if (recipient.hasMixin('MessageRecipient')) {
    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
      message = vsprintf(message, args);
    }
    recipient.receiveMessage(message);
  }
};

Game.sendMessageNearby = function (map, centerX, centerY, radius, message, args) {
  // If args were passed, then we format the message, else
  // no formatting is necessary
  if (args) {
    message = vsprintf(message, args);
  }
  // Get the nearby entities
  var entities = map.getEntitiesWithinRadius(centerX, centerY, radius);
  // Iterate through nearby entities, sending the message if
  // they can receive it.
  entities.forEach(function (entity) {
    Game.sendMessage(entity, message);
  });
};

Game.getNeighborPositions = function (x, y) {
  var tiles = [];
  // Generate all possible offsets
  for (var dX = -1; dX < 2; dX++) {
    for (var dY = -1; dY < 2; dY++) {
      // Make sure it isn't the same tile
      if (dX === 0 && dY === 0) {
        continue;
      }
      tiles.push({
        x: x + dX,
        y: y + dY
      });
    }
  }
  return Singletons.RNG.randomizeArray(tiles);
};

module.exports = Game;
