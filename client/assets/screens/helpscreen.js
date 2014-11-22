var Screen = require('./basescreen');
var Game = require('../game');

var helpScreen = new Screen('Help');

// Define our winning screen
helpScreen.render = function (display) {
  var text = 'jsrogue help';
  var border = '-------------';
  var y = 0;
  display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
  display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, border);
  display.drawText(0, y++, 'The villagers have been complaining of a terrible stench coming from the cave.');
  display.drawText(0, y++, 'Find the source of this smell and get rid of it!');
  y += 3;
  display.drawText(0, y++, '[h or Left Arrow] to move left');
  display.drawText(0, y++, '[l or Right Arrow] to move right');
  display.drawText(0, y++, '[j or Down Arrow] to move down');
  display.drawText(0, y++, '[k or Up Arrow] to move up');
  display.drawText(0, y++, '[,] to pick up items');
  //display.drawText(0, y++, '[d] to drop items');
  //display.drawText(0, y++, '[e] to eat items');
  //display.drawText(0, y++, '[w] to wield items');
  //display.drawText(0, y++, '[W] to wield items');
  //display.drawText(0, y++, '[x] to examine items');
  display.drawText(0, y++, '[i] to view and manipulate your inventory');
  display.drawText(0, y++, '[;] to look around you');
  display.drawText(0, y++, '[?] to show this help screen');
  y += 3;
  text = '--- press any key to continue ---';
  display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
};

helpScreen.handleInput = function (inputType, inputData) {
  // Switch back to the play screen.
  this.getParentScreen().setSubScreen(undefined);
};

module.exports = helpScreen;
