var ROT = require('./rot');
var Level = require('./level');
var Singletons = require('./singletons');
var Game = require('./game');
var Entity = require('./entity');

function build2DArray(width, height, defaultValue) {

  defaultValue = defaultValue || 0;
  var arr = [];
  for (var x = 0; x < width; x++) {
    // Create the nested array for the y values
    arr.push([]);
    // Add all the tiles
    for (var y = 0; y < height; y++) {
      arr[x].push(defaultValue);
    }
  }
  return arr;
}

function buildTilesArray(width, height) {
  return build2DArray(width, height, Singletons.TileCatalog.getItem('nullTile'));
}

/**
 * Builder for individual levels.  Build returns the levelbuilder
 */
var LevelBuilder = (function () {

  function buildLevel(levelBlueprint, levelId) {

    var levelBuilder = new Entity(levelBlueprint);
    if (levelId) {
      levelBuilder.setLevelId(levelId);
    }

    if (levelBuilder.hasMixin('TerrainBuilder')) {
      levelBuilder.buildTerrain();
    }

    if (levelBuilder.hasMixin('CreatureBuilder')) {
      levelBuilder.buildCreatures();
    }

    if (levelBuilder.hasMixin('ItemBuilder')) {
      levelBuilder.buildItems();
    }

    //TODO: should this return the level that was built or the levelbuilder?
    return levelBuilder;
  }

  return {
    buildLevel: buildLevel
  };

}());
module.exports.LevelBuilder = LevelBuilder;

var WorldBuilder = (function () {

  // This fetches a list of points that overlap between one
  // region at a given depth level and a region at a level beneath it.
  var findRegionOverlaps = function (upperLevelBuilder, lowerLevelBuilder, r1, r2) {
    var matches = [];
    var upperLevel = upperLevelBuilder.getLevel(),
      lowerLevel = lowerLevelBuilder.getLevel(),
      upperLevelTiles = upperLevel.getTileArray(),
      lowerLevelTiles = lowerLevel.getTileArray();

    // Iterate through all tiles, checking if they respect
    // the region constraints and are floor tiles. We check
    // that they are floor to make sure we don't try to
    // put two stairs on the same tile.
    for (var x = 0, xEnd = upperLevel.getWidth(); x < xEnd; x++) {
      for (var y = 0, yEnd = upperLevel.getHeight(); y < yEnd; y++) {
        if (upperLevel.isEmptyFloor(x, y) &&
          lowerLevel.isEmptyFloor(x, y) &&
          upperLevelBuilder.getRegion(x, y) === r1 &&
          lowerLevelBuilder.getRegion(x, y) === r2) {
          matches.push({
            x: x,
            y: y
          });
        }
      }
    }
    // We shuffle the list of matches to prevent bias
    return matches.randomize();
  };

  // This tries to connect two regions by calculating
  // where they overlap and adding stairs
  var connectRegions = function (upperLevelBuilder, lowerLevelBuilder, r1, r2) {
    var overlap = findRegionOverlaps(upperLevelBuilder, lowerLevelBuilder, r1, r2);
    // Make sure there was overlap
    if (overlap.length === 0) {
      return false;
    }
    // Select the first tile from the overlap and change it to stairs
    var point = overlap[0];
    upperLevelBuilder.getLevel().setTile(point.x, point.y, Singletons.TileCatalog.getItem('stairsDownTile'));
    var entity = new Entity('StairsPortal');
    entity.setPortalTarget(lowerLevelBuilder.getLevel().getLevelId(), point.x, point.y);
    upperLevelBuilder.getLevel().addEntityAtPosition(entity, point.x, point.y);

    lowerLevelBuilder.getLevel().setTile(point.x, point.y, Singletons.TileCatalog.getItem('stairsUpTile'));
    entity = new Entity('StairsPortal');
    entity.setPortalTarget(upperLevelBuilder.getLevel().getLevelId(), point.x, point.y);
    lowerLevelBuilder.getLevel().addEntityAtPosition(entity, point.x, point.y);

    return true;
  };

  // This tries to connect all regions for each depth level,
  // starting from the top most depth level.
  var connectLevels = function (upperLevelBuilder, lowerLevelBuilder) {
    var upperLevel = upperLevelBuilder.getLevel(),
      lowerLevel = lowerLevelBuilder.getLevel();
    // Iterate through each tile, and if we haven't tried
    // to connect the region of that tile on both depth levels
    // then we try. We store connected properties as strings
    // for quick lookups.
    var connected = {};
    var key;
    for (var x = 0, xEnd = upperLevel.getWidth(); x < xEnd; x++) {
      for (var y = 0, yEnd = upperLevel.getHeight(); y < yEnd; y++) {
        key = upperLevelBuilder.getRegion(x, y) + ',' + lowerLevelBuilder.getRegion(x, y);
        if (!connected[key] &&
          upperLevel.isEmptyFloor(x, y) &&
          lowerLevel.isEmptyFloor(x, y)) {
          // Since both tiles are floors and we haven't
          // already connected the two regions, try now.
          connectRegions(upperLevelBuilder, lowerLevelBuilder, upperLevelBuilder.getRegion(x, y),
            lowerLevelBuilder.getRegion(x, y));
          connected[key] = true;
        }
      }
    }
  };

  function buildWorld(worldBlueprint) {

    //TODO: make this blueprint configurable

    var levels = [
      LevelBuilder.buildLevel('FungusLevelBuilder', 'fungus01'),
      LevelBuilder.buildLevel('FungusLevelBuilder', 'fungus02'),
      LevelBuilder.buildLevel('FungusLevelBuilder', 'fungus03')
    ];

    connectLevels(levels[0], levels[1]);
    connectLevels(levels[1], levels[2]);

    Singletons.World.addLevel(levels[0].getLevel());
    Singletons.World.addLevel(levels[1].getLevel());
    Singletons.World.addLevel(levels[2].getLevel());

    Singletons.World.setActiveLevel(levels[0].getLevel().getLevelId());

    return Singletons.World;

    //return {
    //  getEntryLevel: function () {
    //    return levels[0].getLevel();
    //  }
    //};
  }

  return {
    buildWorld: buildWorld
  };

})();

module.exports.WorldBuilder = WorldBuilder;

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
    this._regions = build2DArray(this.getWidth(), this.getHeight());
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
    var count = Math.round(Math.random() * (this._maxCreatureCount - this._minCreatureCount) + this._minCreatureCount);
    if (this.hasMixin('debug')) {
      this.debug('Creature Builder: building ' + count + ' creatures.', 'RandomPositionCreatureBuilder');
    }
    for (var i = 0; i < count; i++) {
      level.addEntityAtRandomPosition(new Entity(this._creatureList[0]));
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

var Blueprints = {};
Blueprints.BaseLevelBuilder = {
  name: 'BaseLevelBuilder',
  inherits: '_base',
  LevelBuilder: {}
};

Blueprints.FungusLevelBuilder = {
  name: 'FungusLevelBuilder',
  inherits: 'BaseLevelBuilder',
  Debug: {},
  RegionBuilder: {},
  LevelBuilder: {
    width: 100,
    height: 100
  },
  CellularAutomataTerrainBuilder: {
    smoothness: 3
  },
  RandomPositionCreatureBuilder: {
    minCreatureCount: 40,
    maxCreatureCount: 50,
    creatureList: [
      'FungusTemplate'
    ]
  }
};

/* need to figure out a way to have a map builder assemble multiple levels together */
Blueprints.MapBuilder = {
  name: 'MapBuilder',
  inherits: 'BaseMapBuilder',
  LevelHandler: {

    LevelBlocks: [{
      name: 'FungusDungeon',
      builder: 'FungusLevelBuilder',
      levelMin: '1',
      levelMax: '5',
      connected: true,
      dungeon: true
    }, {
      name: 'WolfDungeon',
      builder: 'WolfDungeonLevelBuilder',
      levelMin: 6,
      levelMax: 8,
      dungeon: true
    }],
    LevelConnections: [{
        from: 'Fungus01',
        to: 'Fungus02',
        minConnections: '1',
        maxConnections: '5'
      },
      ['Fungus01->fungus02',
        'Fungus02->fungus03'
      ]
    ]
  }

};

module.exports.BuilderBlueprints = Blueprints;
module.exports.BuilderMixins = Mixins;
