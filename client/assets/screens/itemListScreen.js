var ROT = require('rot');
var Singletons = require('../singletons');
var Game = require('../game');

function ItemListScreen(options) {
  options = options || {};
  // Set up based on the template
  this._caption = options.caption;
  this._okFunction = options.ok;

  // By default, we use the identity function
  this._isAcceptableFunction = options.isAcceptable || function (x) {
    return x;
  };
  // Whether the user can select items at all.
  this._canSelectItem = options.canSelect;
  // Whether the user can select multiple items.
  this._canSelectMultipleItems = options.canSelectMultipleItems;
  //the play screen
  this._parentScreen = options.parentScreen;
  this._hasNoItemOption = options.hasNoItemOption || false;
  this._autoCloseOnSelect = typeof (options.autoCloseOnSelect) === 'undefined' ? true : options.autoCloseOnSelect;
  this._selectFunction = options.selectFunction || null;
  this._postRenderFunction = options.postRenderFunction || null;
  this._postSetupFunction = options.postSetupFunction || null;
}

ItemListScreen.prototype.getParentScreen = function () {
  return Singletons.ScreenCatalog.getScreen(this._parentScreen);
};

ItemListScreen.prototype.setup = function (player, items) {
  this._player = player;
  // Should be called before switching to the screen.
  var count = 0;
  // Iterate over each item, keeping only the aceptable ones and counting
  // the number of acceptable items.
  var that = this;
  this._items = items.map(function (item) {
    // Transform the item into null if it's not acceptable
    if (that._isAcceptableFunction(item)) {
      count++;
      return item;
    } else {
      return null;
    }
  });
  // Clean set of selected indices
  this._selectedIndices = {};
  if (this._postSetupFunction) {
    this._postSetupFunction();
  }
  return count;
};

ItemListScreen.prototype.render = function (display) {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  // Render the caption in the top row
  display.drawText(0, 0, this._caption);
  if (this._hasNoItemOption) {
    display.drawText(0, 1, '0 - no item');
  }
  var row = 0;
  for (var i = 0; i < this._items.length; i++) {
    // If we have an item, we want to render it.
    if (this._items[i]) {
      // Get the letter matching the item's index
      var letter = letters.substring(i, i + 1);

      var isSelected = (this._canSelectItem && this._selectedIndices[i]);
      // If we have selected an item, show a +, else show a dash between
      // the letter and the item's name.
      var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
        this._selectedIndices[i]) ? '+' : '-';

      // Check if the item is worn or wielded
      var suffix = '';
      //TODO: need to query the item slots for all the items wearable / wieldable
      if (this._items[i] === this._player.getArmor()) {
        suffix = ' (wearing)';
      } else if (this._items[i] === this._player.getWeapon()) {
        suffix = ' (wielding)';
      }
      // Render at the correct row and add 2.
      var fg = isSelected ? 'black' : 'white',
        bg = isSelected ? 'white' : 'black';

      display.drawText(0, 2 + row, letter + ' ' + selectionState + ' %c{' + fg + '}%b{' + bg + '} ' + this._items[i].describe() + suffix);
      row++;
    }
  }
  if (this._postRenderFunction) {
    this._postRenderFunction(display);
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
  if (this._okFunction && this._okFunction(selectedItems)) {
    this.getParentScreen().endTurn();
  }
};

ItemListScreen.prototype.executeSelectFunction = function (currentSelectedItem) {
  if (this._selectFunction) {
    this._selectFunction(currentSelectedItem);
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
      // Handle pressing zero when 'no item' selection is enabled
    } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0) {
      this._selectedIndices = {};
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
          Game.refresh();
        } else {
          this._selectedIndices = {};
          this._selectedIndices[index] = true;
          this.executeSelectFunction(this._items[index], index);
          if (this._autoCloseOnSelect) {
            this.executeOkFunction();
          } else {
            Game.refresh();
          }
        }
      }
    }
  }
};

module.exports = ItemListScreen;
