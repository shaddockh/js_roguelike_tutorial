var ROT = require('rot-js').ROT;
var Tile = require('./tile');
var World = require('./world');

function buildTilesArray(width, height) {

  var tiles = [];
  for (var x = 0; x < width; x++) {
    // Create the nested array for the y values
    tiles.push([]);
    // Add all the tiles
    for (var y = 0; y < height; y++) {
      tiles[x].push(Tile.nullTile);
    }
  }
  return tiles;
}

var CellularAutomataWorldBuilder = function (width, height) {

  var bldr = {};
  var tiles = buildTilesArray(width, height);

  var generator = new ROT.Map.Cellular(width, height);
  // Setup the map generator
  generator.randomize(0.5);

  bldr.build = function () {
    // Create our map from the tiles
    return new World(tiles);
  };

  bldr.smooth = function (totalIterations) {
    // Iteratively smoothen the map
    for (var i = 0; i < totalIterations - 1; i++) {
      generator.create();
    }
    return bldr;
  };

  bldr.randomizeTiles = function () {
    // Smoothen it one last time and then update our map
    generator.create(function (x, y, v) {
      if (v === 1) {
        tiles[x][y] = Tile.floorTile;
      } else {
        tiles[x][y] = Tile.wallTile;
      }
    });
    return bldr;
  };

  return bldr;
};

module.exports.CellularAutomata = CellularAutomataWorldBuilder;

var UniformWorldBuilder = function (width, height) {

  var bldr = {};
  var tiles = buildTilesArray(width, height);

  var generator = new ROT.Map.Uniform(width, height, {
    timeLimit: 5000
  });

  bldr.build = function () {
    // Create our map from the tiles
    return new World(tiles);
  };

  bldr.smooth = function (totalIterations) {
    return bldr;
  };

  bldr.randomizeTiles = function () {
    generator.create(function (x, y, v) {
      if (v === 0) {
        tiles[x][y] = Tile.floorTile;
      } else {
        tiles[x][y] = Tile.wallTile;
      }
    });
    return bldr;
  };

  return bldr;
};

module.exports.Uniform = UniformWorldBuilder;
