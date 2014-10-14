var Singletons = require('../singletons');
var ROT = require('../rot');
var Level = require('../level');
var Game = require('../game');
var Entity = require('../entity');
var WorldBuilder = require('../worldbuilder');

function buildTilesArray(width, height) {
  return WorldBuilder.build2DArray(width, height, Singletons.TileCatalog.getItem('nullTile'));
}

var Mixins = {};
Mixins.LevelBuilder = {
  name: 'LevelBuilder',
  doc: 'Base Level Builder',

  init: function (blueprint) {
    this._width = blueprint.width || 0;
    this._height = blueprint.height || 0;
    this._levelId = blueprint.levelId || 'level';
  },
  getWidth: function () {
    return this._width;
  },
  getHeight: function () {
    return this._height;
  },
  setLevel: function (level) {
    this._level = level;
  },
  getLevel: function () {
    return this._level;
  },
  getLevelId: function () {
    return this._levelId;
  },
  setLevelId: function (levelId) {
    this._levelId = levelId;
  }

};
Mixins.FovBuilder = {
  name: 'FOVBuilder',
  doc: 'Field of View',
  init: function (blueprint) {
    this._fovTopology = blueprint.fovTopology || 8;
  },
  //TODO: need a better way
  buildFOV: function () {
    var level = this.getLevel();
    var builder = this;

    level.setFov(
      new ROT.FOV.PreciseShadowcasting(function (x, y) {
        return !level.getTile(x, y).getBlocksLight();
      }, {
        topology: builder._fovTopology
      }));
  }
};

Mixins.RegionBuilder = {
  name: 'RegionBuilder',
  init: function (blueprint) {
    this._minRegionSize = blueprint.minRegionSize || 20;
    this._regionWallTile = blueprint.regionWallTile || 'wallTile';
  },
  getRegion: function (x, y) {
    return this._regions[x][y];
  },
  canFillRegion: function (x, y) {
    // Make sure the tile is within bounds
    if (x < 0 || y < 0 || x >= this.getWidth() ||
      y >= this.getHeight()) {
      return false;
    }
    // Make sure the tile does not already have a region
    if (this._regions[x][y] !== 0) {
      return false;
    }
    // Make sure the tile is walkable
    return this.getLevel().getTile(x, y).isWalkable();
  },
  fillRegion: function (region, x, y) {
    var tilesFilled = 1;
    var tiles = [{
      x: x,
      y: y
    }];
    var tile;
    var neighbors;
    // Update the region of the original tile
    this._regions[x][y] = region;
    // Keep looping while we still have tiles to process
    while (tiles.length > 0) {
      tile = tiles.pop();
      // Get the neighbors of the tile
      neighbors = Game.getNeighborPositions(tile.x, tile.y);
      // Iterate through each neighbor, checking if we can use it to fill
      // and if so updating the region and adding it to our processing
      // list.
      while (neighbors.length > 0) {
        tile = neighbors.pop();
        if (this.canFillRegion(tile.x, tile.y)) {
          this._regions[tile.x][tile.y] = region;
          tiles.push(tile);
          tilesFilled++;
        }
      }
    }
    return tilesFilled;
  },

  // This removes all tiles at a given depth level with a region number.
  // It fills the tiles with a wall tile.
  removeRegion: function (region) {
    var fillTile = Singletons.TileCatalog.getItem(this._regionWallTile);
    for (var x = 0; x < this._width; x++) {
      for (var y = 0; y < this._height; y++) {
        if (this._regions[x][y] === region) {
          // Clear the region and set the tile to a wall tile
          this._regions[x][y] = 0;
          this.getLevel().setTile(x, y, fillTile);
        }
      }
    }
  },

  // This sets up the regions for a given depth level.
  setupRegions: function () {
    this._regions = WorldBuilder.build2DArray(this.getWidth(), this.getHeight());
    var region = 1;
    var tilesFilled;
    // Iterate through all tiles searching for a tile that
    // can be used as the starting point for a flood fill
    for (var x = 0; x < this.getWidth(); x++) {
      for (var y = 0; y < this.getHeight(); y++) {
        if (this.canFillRegion(x, y)) {
          // Try to fill
          tilesFilled = this.fillRegion(region, x, y);
          // If it was too small, simply remove it
          if (tilesFilled <= this._minRegionSize) {
            this.removeRegion(region);
          } else {
            region++;
          }
        }
      }
    }
  }
};

Mixins.CellularAutomataTerrainBuilder = {
  name: 'CellularAutomataTerrainBuilder',
  type: 'TerrainBuilder',
  doc: 'Builds a cellular automata level',
  init: function (blueprint) {
    this._randomization = blueprint.randomization || 0.5;
    this._smoothness = blueprint.smoothness || 3;
  },
  buildTerrain: function () {
    var tiles = buildTilesArray(this._width, this._height);
    var generator = new ROT.Map.Cellular(this._width, this._height);
    // Setup the map generator
    generator.randomize(this._randomization);

    for (var i = 0; i < this._smoothness - 1; i++) {
      generator.create();
    }

    // Smoothen it one last time and then update our map
    generator.create(function (x, y, v) {
      if (v === 1) {
        tiles[x][y] = Singletons.TileCatalog.getItem('floorTile');
      } else {
        tiles[x][y] = Singletons.TileCatalog.getItem('wallTile');
      }
    });
    this.setLevel(new Level(tiles, this.getLevelId()));
    if (this.hasMixin('RegionBuilder')) {
      this.setupRegions();
    }
  }
};

Mixins.RandomPositionCreatureBuilder = {
  name: 'RandomPositionCreatureBuilder',
  type: 'CreatureBuilder',
  doc: 'Generates a number of random creatures from an array of templates on a level',
  init: function (blueprint) {
    this._minCreatureCount = blueprint.minCreatureCount || 10;
    this._maxCreatureCount = blueprint.maxCreatureCount || 10;
    this._creatureList = blueprint.creatureList || [];
  },
  buildCreatures: function () {
    var level = this.getLevel();
    var count = Singletons.RNG.randomIntInRange(this._minCreatureCount, this._maxCreatureCount);
    if (this.hasMixin('debug')) {
      this.debug('Creature Builder: building ' + count + ' creatures.', 'RandomPositionCreatureBuilder');
    }
    for (var i = 0; i < count; i++) {
      level.addEntityAtRandomPosition(new Entity(Singletons.RNG.randomArrayElement(this._creatureList)));
    }
  }
};

Mixins.RandomPositionItemBuilder = {
  name: 'RandomPositionItemBuilder',
  type: 'ItemBuilder',
  doc: 'Generates a number of random items from an array of templates on a level',
  init: function (blueprint) {
    this._minItemCount = blueprint.minItemCount || 10;
    this._maxItemCount = blueprint.maxItemCount || 10;
    this._itemList = blueprint.itemList || [];
  },
  buildItems: function () {
    var level = this.getLevel();
    var count = Singletons.RNG.randomIntInRange(this._minItemCount, this._maxItemCount);
    if (this.hasMixin('debug')) {
      this.debug('Item Builder: building ' + count + ' items.', 'RandomPositionItemBuilder');
    }
    for (var i = 0; i < count; i++) {
      level.addEntityAtRandomPosition(new Entity(Singletons.RNG.randomArrayElement(this._itemList)));
    }
  }
};

//Mixins.tt = (function () {
//  //example of creating a mixin that still has access to it's name, etc.
//  //usually, the mixin doesn't have access once it's attached to the entity
//  var mixinName = 'test';
//  return {
//    name: mixinName,
//    init: function (blueprint) {
//      console.log(mixinName);
//    }
//  };
//})();

Mixins.UniformTerrainBuilder = {
  name: 'UniformTerrainBuilder',
  type: 'TerrainBuilder',
  doc: 'Builds a uniform level',
  init: function (blueprint) {
    this._timeLimit = blueprint.timeLimit || 5000;
    this._randomization = blueprint.randomization || 0.5;
  },
  buildTerrain: function () {
    var tiles = buildTilesArray(this._width, this._height);
    var generator = new ROT.Map.Uniform(this._width, this._height, {
      timeLimit: this._timeLimit
    });

    // Setup the map generator
    generator.randomize(this._randomization);

    //create our map
    generator.create(function (x, y, v) {
      if (v === 1) {
        tiles[x][y] = Singletons.TileCatalog.getItem('floorTile');
      } else {
        tiles[x][y] = Singletons.TileCatalog.getItem('wallTile');
      }
    });
    this.setLevel(new Level(tiles));
  }
};

module.exports = Mixins;
