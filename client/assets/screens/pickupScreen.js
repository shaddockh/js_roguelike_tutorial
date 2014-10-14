var ItemListScreen = require('./itemListScreen');

var pickupScreen = new ItemListScreen({
  caption: 'Choose the items you wish to pickup',
  canSelect: true,
  canSelectMultipleItems: true,
  parentScreen: 'PlayScreen',
  ok: function (selectedItems) {
    var Game = require('../game');
    // Try to pick up all items, messaging the player if they couldn't all be
    // picked up.
    if (!this._player.pickupItems(Object.keys(selectedItems))) {
      Game.sendMessage(this._player, "Your inventory is full! Not all items were picked up.");
    }
    return true;
  }
});
module.exports = pickupScreen;
