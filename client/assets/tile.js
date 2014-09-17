var Glyph = require('./glyph');
var Tile = function (properties) {
  properties = properties || {};
  Glyph.call(this, properties);
  this._isWalkable = properties.isWalkable || false;
  this._isDiggable = properties.isDiggable || false;
};
Tile.extend(Glyph);

Tile.prototype.isWalkable = function () {
  return this._isWalkable;
};

Tile.prototype.isDiggable = function () {
  return this._isDiggable;
};

var Glyph = require('./glyph');
Tile.nullTile = new Tile();
Tile.floorTile = new Tile({
  character: '.',
  isWalkable: true
});

Tile.wallTile = new Tile({
  character: '#',
  foreground: 'goldenrod',
  isDiggable: true
});

module.exports = Tile;
