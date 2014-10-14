var ItemListScreen = require('./itemListScreen');

var dropScreen = new ItemListScreen({
  caption: 'Choose the item you wish to drop',
  canSelect: true,
  canSelectMultipleItems: false,
  parentScreen: 'PlayScreen',
  ok: function (selectedItems) {
    // Drop the selected item
    this._player.dropItem(Object.keys(selectedItems)[0]);
    return true;
  }
});

module.exports = dropScreen;
