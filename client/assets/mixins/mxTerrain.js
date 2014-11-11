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
    this._reflectivity = blueprint.reflectivity || 0;
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
  },
  getReflectivity: function () {
    return this._reflectivity;
  }
};

module.exports = Mixins;
