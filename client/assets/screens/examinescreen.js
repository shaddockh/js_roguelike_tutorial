var ItemListScreen = require('./itemListScreen');

var examineScreen = new ItemListScreen({
  caption: 'Choose the item you wish to examine',
  canSelect: true,
  canSelectMultipleItems: false,
  hasNoItemOption: false,
  parentScreen: 'PlayScreen',
  isAcceptable: function (item) {
    return item && (item.hasMixin('Examinable') || item.hasMixin('Aspect'));
  },
  ok: function (selectedItems) {
    var Game = require('../game');
    var keys = Object.keys(selectedItems);
    if (keys.length > 0) {
      var item = selectedItems[keys[0]];
      if (item.hasMixin('Examinable')) {
        Game.sendMessage(this._player, "It's %s (%s).", [
          item.describeA(false),
          item.examine()
        ]);
      } else {
        Game.sendMessage(this._player, "It's %s.", [
          item.describeA(false)
        ]);

      }
    }
    return true;
  }
});

module.exports = examineScreen;
