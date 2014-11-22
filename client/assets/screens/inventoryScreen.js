var ItemListScreen = require('./itemListScreen');
var Game = require('../game');
var utils = require('../utils'),
  eventMessage = utils.events;
var _ = require('lodash');

var inventoryScreen = new ItemListScreen({
  caption: 'Inventory',
  canSelect: true,
  parentScreen: 'PlayScreen',
  autoCloseOnSelect: false,
  selectFunction: function (item) {
    this._currentHoverItem = item;
  },
  postSetupFunction: function () {
    this._currentHoverItem = null;
    if (this._items.length && !this._currentHoverItem) {
      this._selectedIndices[0] = true;
      this._currentHoverItem = this._items[0];
    }
  },
  postRenderFunction: function (display) {
    this.renderDescriptionArea(display);
    this.renderActionArea(display);
  },
  ok: function (selectedItems) {
    selectedItems = _.values(selectedItems);
    if (selectedItems.length === 1) {
      var verbs = _.flatten(selectedItems[0].raiseEvent(eventMessage.onRequestVerbs, this._player));
      if (verbs.length) {
        this.getParentScreen().showActionScreen(verbs, 'Choose an action to perform: ' + selectedItems[0].getScreenName());
        return false;
      }
    } else if (selectedItems.length > 1) {
      throw new Error('multiple item were selected!');
    }
    return false;
  }
});

inventoryScreen.renderDescriptionArea = function (display) {
  if (this._currentHoverItem) {
    var item = this._currentHoverItem;
    var msg = '';
    if (item && (item.hasMixin('Examinable') || item.hasMixin('Aspect'))) {
      if (item.hasMixin('Examinable')) {
        msg = item.describeA(false);
        msg += '\n' + item.examine();
      } else {
        msg = item.describeA(false);
      }
    }
    display.drawText(50, 2, msg);
  }
  display.drawText(50, 2, '   ');
};

inventoryScreen.renderActionArea = function (display) {
  if (this._currentHoverItem) {
    var item = this._currentHoverItem;
    var msg = '';
    display.drawText(50, 20, 'Actions Available: ');
    var verbs = _.flatten(item.raiseEvent(eventMessage.onRequestVerbs, this._player));
    if (verbs.length) {
      var actionList = _.map(verbs, function (verb) {
        return verb.verb;
      }).join(', ');
      display.drawText(50, 21, actionList);
    } else {
      display.drawText(50, 21, 'None');
    }
  } else {
    display.drawText(50, 21, 'None');
  }
};

module.exports = inventoryScreen;
