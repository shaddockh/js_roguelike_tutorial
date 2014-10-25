var Mixins = {};
Mixins.Tile = {
  name: 'Tile',
  obsolete: false,
  type: 'Tile',
  doc: 'Base tile.  Used for all tile elements on the map.  Is not instanced, but reused for each type of tile on the map',
  init: function (blueprint) {
    this._isDiggable = blueprint.isDiggable || false;
    this._isWalkable = blueprint.isWalkable || false;
    this._blocksLight = typeof (blueprint.blocksLight) !== 'undefined' ? blueprint.blocksLight : true;
  },
  isWalkable: function () {
    return this._isWalkable;
  },
  isDiggable: function () {
    return this._isDiggable;
  },
  getBlocksLight: function () {
    return this._blocksLight;
  },
  setBlocksLight: function (value) {
    this._blocksLight = value;
  }
};

module.exports = Mixins;
