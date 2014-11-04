var ROT = require('rot');
var Singletons = require('../singletons');
var utils = require('../utils');
var Game = require('../game');

function TargetBasedScreen(options) {
  options = options || {};
  // By default, our ok return does nothing and does not consume a turn.
  this._okFunction = options.okFunction || function (x, y) {
    return false;
  };

  // The default caption function simply returns an empty string.
  this._captionFunction = options.captionFunction || function (x, y) {
    return '';
  };

  //the play screen
  this._parentScreen = options.parentScreen;
}

TargetBasedScreen.prototype.setup = function (player, startX, startY, offsetX, offsetY) {
  this._player = player;
  // Store original position. Subtract the offset to make life easy so we don't
  // always have to remove it.
  this._startX = startX - offsetX;
  this._startY = startY - offsetY;
  // Store current cursor position
  this._cursorX = this._startX;
  this._cursorY = this._startY;
  // Store map offsets
  this._offsetX = offsetX;
  this._offsetY = offsetY;
  // Cache the FOV
  var visibleCells = {};
  this._player.getMap().getFov().compute(
    this._player.getX(), this._player.getY(),
    this._player.getSightRadius(),
    function (x, y, radius, visibility) {
      visibleCells[x + "," + y] = true;
    });
  this._visibleCells = visibleCells;
};

TargetBasedScreen.prototype.render = function (display) {

  Singletons.ScreenCatalog.getScreen('PlayScreen').renderTiles(display);
  //Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);

  // Draw a line from the start to the cursor.
  var points = utils.geometry.getLine(this._startX, this._startY, this._cursorX,
    this._cursorY);

  // Render stars along the line.
  for (var i = 0, l = points.length; i < l; i++) {
    display.drawText(points[i].x, points[i].y, '%c{magenta}*');
  }

  // Render the caption at the bottom.
  display.drawText(0, Game.getScreenHeight() - 1,
    this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

TargetBasedScreen.prototype.handleInput = function (inputType, inputData) {
  // Move the cursor
  if (inputType === 'keydown') {
    if (inputData.keyCode === ROT.VK_LEFT) {
      this.moveCursor(-1, 0);
    } else if (inputData.keyCode === ROT.VK_RIGHT) {
      this.moveCursor(1, 0);
    } else if (inputData.keyCode === ROT.VK_UP) {
      this.moveCursor(0, -1);
    } else if (inputData.keyCode === ROT.VK_DOWN) {
      this.moveCursor(0, 1);
    } else if (inputData.keyCode === ROT.VK_ESCAPE) {
      this.getParentScreen().setSubScreen(undefined);
    } else if (inputData.keyCode === ROT.VK_RETURN) {
      this.executeOkFunction();
    }
  }
  Game.refresh();
};

TargetBasedScreen.prototype.moveCursor = function (dx, dy) {
  // Make sure we stay within bounds.
  this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
  // We have to save the last line for the caption.
  this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));
};

TargetBasedScreen.prototype.getParentScreen = function () {
  return Singletons.ScreenCatalog.getScreen(this._parentScreen);
};

TargetBasedScreen.prototype.setParentScreen = function (value) {
  this._parentScreen = value;
};

TargetBasedScreen.prototype.executeOkFunction = function () {
  // Switch back to the play screen.
  this.getParentScreen().setSubScreen(undefined);

  // Call the OK function and end the player's turn if it return true.
  if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
    this.getParentScreen().endTurn();
  }
};

module.exports = TargetBasedScreen;
