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

module.exports.build2DArray = build2DArray;

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

    if (levelBuilder.hasMixin('FOVBuilder')) {
      levelBuilder.buildFOV();
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
    return Singletons.RNG.randomizeArray(matches);
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
