//TODO: Replace with the Entity Blueprint Manager

// Create our Mixins namespace
var Mixins = {};

var BaseMixin = function (name, type) {
  return {
    name: name,
    obsolete: false,
    type: type || name,
    init: function (blueprint) {}
  };
};

// Define our Moveable mixin
Mixins.Moveable = {
  name: 'Moveable',
  obsolete: false,
  type: 'Moveable',
  init: function (blueprint) {},
  tryMove: function (x, y, map) {
    var tile = map.getTile(x, y);
    // Check if we can walk on the tile
    // and if so simply walk onto it
    if (tile.isWalkable()) {
      // Update the entity's position
      this._x = x;
      this._y = y;
      return true;
      // Check if the tile is diggable, and
      // if so try to dig it
    } else if (tile.isDiggable()) {
      map.dig(x, y);
      return true;
    }
    return false;
  }
};

Mixins.Position = {
  name: 'Position',
  obsolete: false,
  doc: 'Handles an entities position in the world',
  type: 'Position',
  init: function (blueprint) {

  },
  setMap: function (map) {
    this._map = map;
  },
  getMap: function () {
    return this._map;
  }
};

var mixinCatalog = require('entity-blueprint-manager').MixinCatalog;
mixinCatalog.loadSingleMixin(Mixins.Moveable);
mixinCatalog.loadSingleMixin(Mixins.Position);

module.exports.Mixins = Mixins;

// Player template
var PlayerTemplate = {
  character: '@',
  foreground: 'white',
  background: 'black',
  mixins: [mixinCatalog.getMixin('Position'), mixinCatalog.getMixin('Moveable')]
};

module.exports.PlayerTemplate = PlayerTemplate;
