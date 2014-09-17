var Tile = require('./tile');
//Correponds to "World" in the other tutorial

var World = function (tiles) {
  this._tiles = tiles;
  // cache the width and height based
  // on the length of the dimensions of
  // the tiles array
  this._width = tiles.length;
  this._height = tiles[0].length;
};

// Standard getters
World.prototype.getWidth = function () {
  return this._width;
};
World.prototype.getHeight = function () {
  return this._height;
};

// Gets the tile for a given coordinate set
World.prototype.getTile = function (x, y) {
  // Make sure we are inside the bounds. If we aren't, return
  // null tile.
  if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
    return Tile.nullTile;
  } else {
    return this._tiles[x][y] || Tile.nullTile;
  }
};

World.prototype.dig = function (x, y) {
  // If the tile is diggable, update it to a floor
  if (this.getTile(x, y).isDiggable()) {
    this._tiles[x][y] = Tile.floorTile;
  }
};

World.prototype.getRandomFloorPosition = function () {
  // Randomly generate a tile which is a floor
  var x, y;
  do {
    x = Math.floor(Math.random() * this.getWidth());
    y = Math.floor(Math.random() * this.getHeight());
  } while (this.getTile(x, y) !== Tile.floorTile);
  return {
    x: x,
    y: y
  };
};

module.exports = World;
