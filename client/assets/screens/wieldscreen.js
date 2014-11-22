var ItemListScreen = require('./itemListScreen');

var wieldScreen = new ItemListScreen({
  caption: 'Choose the item you wish to wield',
  canSelect: true,
  canSelectMultipleItems: false,
  hasNoItemOption: true,
  parentScreen: 'PlayScreen',
  isAcceptable: function (item) {
    return item && item.hasMixin('Equippable') && item.isWieldable();
  },
  ok: function (selectedItems) {
    var Game = require('../game');
    // Check if we selected 'no item'
    var keys = Object.keys(selectedItems);
    var item = this._player.getWeapon();
    if (keys.length === 0) {
      if (item) {
        this._player.unequip(item);
      }
      Game.sendMessage(this._player, "You are empty handed.");
    } else {
      if (item) {
        this._player.unequip(item);
      }
      // Make sure to unequip the item first in case it is the armor.
      var newitem = selectedItems[keys[0]];
      this._player.wield(newitem);
      Game.sendMessage(this._player, "You are wielding %s.", [newitem.describeA()]);
    }
    return true;
  }
});

module.exports = wieldScreen;
