/*global $*/

//NOTE: This is a singleton

var ROT = require('rot-js').ROT;
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

Game.init = function () {
  _display = new ROT.Display({
    width: Game.config.dimensions.width,
    height: Game.config.dimensions.height
  });
  // Bind keyboard input events
  bindEventToScreen('keydown');
  bindEventToScreen('keyup');
  bindEventToScreen('keypress');
};

Game.getDisplay = function () {
  return _display;
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

  if (typeof(screen) == 'string') {
    screen = require(screen);
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
    _currentScreen.render(_display);
  }

};

module.exports = Game;
