var Game = require('../game');
var utils = require('../utils'),
  eventMessage = utils.events;
var _ = require('lodash');

var ROT = require('rot');
var Singletons = require('../singletons');
var Screen = require('./basescreen');

var doActionScreen = new Screen('Action to Perform');
doActionScreen.setup = function (player, actions, title) {
  // Must be called before rendering.
  this._player = player;
  this._options = actions;
  this._title = title || 'Choose and action to perform: ';

  return actions.length;
};

doActionScreen.render = function (display) {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  display.drawText(0, 0, this._title);

  // Iterate through each of our options
  for (var i = 0; i < this._options.length; i++) {
    display.drawText(0, 2 + i,
      letters.substring(i, i + 1) + ' - ' + this._options[i].verb);
  }

};

doActionScreen.handleInput = function (inputType, inputData) {
  if (inputType === 'keydown') {
    // If a letter was pressed, check if it matches to a valid option.
    if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
      // Check if it maps to a valid item by subtracting 'a' from the character
      // to know what letter of the alphabet we used.
      var index = inputData.keyCode - ROT.VK_A;
      var selectedAction = this._options[index];
      if (selectedAction) {
        // Call the action
        selectedAction.action.call(selectedAction.owner, this._player);
        Singletons.ScreenCatalog.getScreen('PlayScreen').setSubScreen(undefined);
      }
    }
  }
};

module.exports = doActionScreen;
