var ItemListScreen = require('./itemListScreen');
var Game = require('../game');

var eatScreen = new ItemListScreen({
  caption: 'Choose the item you wish to eat',
  canSelect: true,
  canSelectMultipleItems: false,
  parentScreen: 'PlayScreen',
  isAcceptable: function (item) {
    return item && item.hasMixin('Edible');
  },
  ok: function (selectedItems) {
    // Eat the item, removing it if there are no consumptions remaining.
    var key = Object.keys(selectedItems)[0];
    var item = selectedItems[key];
    Game.sendMessage(this._player, "You eat %s.", [item.describeThe()]);
    item.eat(this._player);
    if (!item.hasRemainingConsumptions()) {
      this._player.removeItem(key);
    }
    return true;
  }
});

module.exports = eatScreen;
