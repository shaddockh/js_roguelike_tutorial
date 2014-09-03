var Tile = function (glyph) {
  this._glyph = glyph;
};

Tile.prototype.getGlyph = function () {
  return this._glyph;
};

var Glyph = require('./glyph');
Tile.nullTile = new Tile(new Glyph());
Tile.floorTile = new Tile(new Glyph('.'));
Tile.wallTile = new Tile(new Glyph('#', 'goldenrod'));

module.exports = Tile;
