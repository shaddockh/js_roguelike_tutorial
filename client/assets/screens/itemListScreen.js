var ROT = require('../rot');
var Singletons = require('../singletons');

function ItemListScreen(options) {
  options = options || {};
  // Set up based on the template
  this._caption = options.caption;
  this._okFunction = options.ok;
  // Whether the user can select items at all.
  this._canSelectItem = options.canSelect;
  // Whether the user can select multiple items.
  this._canSelectMultipleItems = options.canSelectMultipleItems;
  //the play screen
  this._parentScreen = options.parentScreen;
}

ItemListScreen.prototype.getParentScreen = function () {
  return Singletons.ScreenCatalog.getScreen(this._parentScreen);
};

ItemListScreen.prototype.setup = function (player, items) {
  this._player = player;
  // Should be called before switching to the screen.
  this._items = items;
  // Clean set of selected indices
  this._selectedIndices = {};
};

ItemListScreen.prototype.render = function (display) {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  // Render the caption in the top row
  display.drawText(0, 0, this._caption);
  var row = 0;
  for (var i = 0; i < this._items.length; i++) {
    // If we have an item, we want to render it.
    if (this._items[i]) {
      // Get the letter matching the item's index
      var letter = letters.substring(i, i + 1);
      // If we have selected an item, show a +, else show a dash between
      // the letter and the item's name.
      var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
        this._selectedIndices[i]) ? '+' : '-';
      // Render at the correct row and add 2.
      display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' + this._items[i].describe());
      row++;
    }
  }
};

ItemListScreen.prototype.executeOkFunction = function () {
  // Gather the selected items.
  var selectedItems = {};
  for (var key in this._selectedIndices) {
    selectedItems[key] = this._items[key];
  }
  // Switch back to the play screen.
  this.getParentScreen().setSubScreen(undefined);
  // Call the OK function and end the player's turn if it return true.
  if (this._okFunction(selectedItems)) {
    this.getParentScreen().endTurn();
  }
};

ItemListScreen.prototype.handleInput = function (inputType, inputData) {
  if (inputType === 'keydown') {
    // If the user hit escape, hit enter and can't select an item, or hit
    // enter without any items selected, simply cancel out
    if (inputData.keyCode === ROT.VK_ESCAPE ||
      (inputData.keyCode === ROT.VK_RETURN &&
        (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))) {
      this.getParentScreen().setSubScreen(undefined);
      // Handle pressing return when items are selected
    } else if (inputData.keyCode === ROT.VK_RETURN) {
      this.executeOkFunction();
      // Handle pressing a letter if we can select
    } else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A &&
      inputData.keyCode <= ROT.VK_Z) {
      // Check if it maps to a valid item by subtracting 'a' from the character
      // to know what letter of the alphabet we used.
      var index = inputData.keyCode - ROT.VK_A;
      if (this._items[index]) {
        // If multiple selection is allowed, toggle the selection status, else
        // select the item and exit the screen
        if (this._canSelectMultipleItems) {
          if (this._selectedIndices[index]) {
            delete this._selectedIndices[index];
          } else {
            this._selectedIndices[index] = true;
          }
          // Redraw screen
          var Game = require('../game');
          Game.refresh();
        } else {
          this._selectedIndices[index] = true;
          this.executeOkFunction();
        }
      }
    }
  }
};

module.exports = ItemListScreen;
