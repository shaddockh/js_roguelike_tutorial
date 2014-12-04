/*jshint bitwise: false*/
var ROT = require('rot');
var Level = require('./level');
var Singletons = require('./singletons');
var Game = require('./game');
var Entity = require('./entity');
var Dictionary = require('entity-blueprint-manager').Dictionary;

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

function fillCircle(tiles, centerX, centerY, radius, tile) {
  // Copied from the DrawFilledCircle algorithm
  // http://stackoverflow.com/questions/1201200/fast-algorithm-for-drawing-filled-circles
  var x = radius;
  var y = 0;
  var xChange = 1 - (radius << 1);
  var yChange = 0;
  var radiusError = 0;

  while (x >= y) {
    for (var i = centerX - x; i <= centerX + x; i++) {
      tiles[i][centerY + y] = tile;
      tiles[i][centerY - y] = tile;
    }
    for (var j = centerX - y; j <= centerX + y; j++) {
      tiles[j][centerY + x] = tile;
      tiles[j][centerY - x] = tile;
    }

    y++;
    radiusError += yChange;
    yChange += 2;
    if (((radiusError << 1) + xChange) > 0) {
      x--;
      radiusError += xChange;
      xChange += 2;
    }
  }
}
module.exports.fillCircle = fillCircle;

/**
 * Builder for individual levels.  Build returns the levelbuilder
 */
var LevelBuilder = (function () {

  /**
   * Pass in either the name of the level blueprint to build or an object.  If object, make sure the 'inherits' property is filled
   * @param levelBlueprint
   * @returns {*}
   */
  function buildLevel(levelBlueprint) {

    //TODO: don't like the interface to this.
    var levelBuilder;
    if (typeof (levelBlueprint) === 'string') {
      levelBuilder = new Entity(levelBlueprint);
    } else {
      levelBuilder = new Entity(levelBlueprint.inherits, levelBlueprint);
    }

    console.log('Building Level: ' + levelBuilder.getLevelId());
    console.log('Difficulty: ' + levelBuilder.getLevelDifficulty());

    if (levelBuilder.hasMixin('TerrainBuilder')) {
      console.profile("Build Terrain - " + levelBuilder.getLevelId());
      levelBuilder.buildTerrain();
      console.profileEnd();
    }

    if (levelBuilder.hasMixin('CreatureBuilder')) {
      levelBuilder.buildCreatures();
    }

    if (levelBuilder.hasMixin('ItemBuilder')) {
      levelBuilder.buildItems();
    }

    if (levelBuilder.hasMixin('FOVBuilder')) {
      levelBuilder.buildFOV();
    }

    if (levelBuilder.hasMixin('Lighting')) {
      levelBuilder.calculateLighting();
    }

    levelBuilder.dumpStatistics();

    //TODO: should this return the level that was built or the levelbuilder?
    return levelBuilder;
  }

  return {
    buildLevel: buildLevel
  };

}());
module.exports.LevelBuilder = LevelBuilder;
var caveToBossRegionConnection = (function () {
  // Add a hole to the final cavern on the last level.
  function connect(connectionDefinition, fromLevelBuilder, toLevelBuilder) {
    var fromLevel = fromLevelBuilder.getLevel(),
      toLevel = toLevelBuilder.getLevel();

    var point = fromLevel.getRandomFloorPosition();
    //fromLevel.setTile(point.x, point.y, Singletons.TileCatalog.get('hole'));

    var destPoint = toLevel.getRandomFloorPosition();
    var entity = new Entity('hole');
    entity.setPortalTarget(toLevel.getLevelId(), destPoint.x, destPoint.y);
    fromLevel.addEntityAtPosition(entity, point.x, point.y);
  }
  return {
    connect: connect
  };
})();

var caveToCaveRegionConnector = (function () {

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
    upperLevelBuilder.getLevel().setTile(point.x, point.y, Singletons.TileCatalog.get('stairsDownTile'));
    var entity = new Entity('StairsPortal');
    entity.setPortalTarget(lowerLevelBuilder.getLevel().getLevelId(), point.x, point.y);
    upperLevelBuilder.getLevel().addEntityAtPosition(entity, point.x, point.y);

    lowerLevelBuilder.getLevel().setTile(point.x, point.y, Singletons.TileCatalog.get('stairsUpTile'));
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

  function connect(connectionDefinition, fromLevelBuilder, toLevelBuilder) {
    connectLevels(fromLevelBuilder, toLevelBuilder);
  }
  return {
    connect: connect
  };
})();

var WorldBuilder = (function () {

  var connectionStrategies = new Dictionary({
    ignoreCase: true
  });
  connectionStrategies.add('CaveToCaveRegionConnector', caveToCaveRegionConnector);
  connectionStrategies.add('caveToBossRegionConnection', caveToBossRegionConnection);

  function buildWorld(worldBlueprint) {
    worldBlueprint = Singletons.BlueprintCatalog.getBlueprint(worldBlueprint);

    //TODO: make this blueprint configurable
    var levels = new Dictionary({
      ignoreCase: true
    });
    console.profile('Build levels');
    worldBlueprint.levels.forEach(function (levelDefinition) {
      var levelBuilder = LevelBuilder.buildLevel(levelDefinition);
      levels.add(levelBuilder.getLevelId(), levelBuilder);
      Singletons.World.addLevel(levelBuilder.getLevel());
    });
    console.profileEnd();

    console.profile('Connect levels');
    worldBlueprint.connections.forEach(function (connectionDefinition) {
      connectionStrategies.get(connectionDefinition.strategy)
        .connect(connectionDefinition, levels.get(connectionDefinition.from), levels.get(connectionDefinition.to));
    });
    console.profileEnd();

    Singletons.World.setActiveLevel(worldBlueprint.entryPoint);
    return Singletons.World;
  }

  return {
    buildWorld: buildWorld
  };

})();

module.exports.WorldBuilder = WorldBuilder;
