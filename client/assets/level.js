var Singletons = require('./singletons'),
  WorldBuilder = require('./worldbuilder'),
  ROT = require('rot'),
  utils = require('./utils'),
  _ = require('lodash'),
  eventMessage = utils.events;

//Correponds to "World" in the other tutorial

var Level = function (tiles, levelId, entities) {
  this._tiles = tiles;
  this._levelId = levelId || 'level';
  // cache the width and height based
  // on the length of the dimensions of
  // the tiles array
  this._width = tiles.length;
  this._height = tiles[0].length;

  this._entities = [];
  this._fov = null;
  this._lightingModel = null;
  this._explored = WorldBuilder.build2DArray(this._width, this._height, false);
  if (entities && entities.length) {
    for (var e = 0; e < entities.length; e++) {
      var entity = entities[e];
      this.addEntityAtPosition(entity, entity.getX(), entity.getY());
    }
  }

};

Level.prototype.getLevelId = function () {
  return this._levelId;
};

Level.prototype.getLightingModel = function () {
  return this._lightingModel;
};

Level.prototype.setLightingModel = function (lightingModel) {
  this._lightingModel = lightingModel;
};

/**
 * called when the level should start being displayed.  Should schedule the entities into the scheduler, etc.
 */
Level.prototype.activate = function () {
  var scheduler = Singletons.World.getScheduler();
  _.forEach(_.filter(this._entities, utils.namedEntityFilters.hasMixin('Actor')), function (entity) {
    scheduler.add(entity, true);
  });
};

/**
 * this level is now being hidden..let's take the entities out of the scheduler
 */
Level.prototype.deactivate = function () {
  var scheduler = Singletons.World.getScheduler();
  _.forEach(_.filter(this._entities, utils.namedEntityFilters.hasMixin('Actor')), function (entity) {
    scheduler.remove(entity);
  });
};

Level.prototype.drawViewPort = function (display, x1, y1, x2, y2) {

  console.time('Draw Viewport');
  // This object will keep track of all visible map cells

  var visibleCells = {};
  var level = this;

  if (level.getLightingModel()) {
    level.getLightingModel().reset();
  }
  // Find all visible cells and update the object
  this.getFov().compute(
    Singletons.Player.getX(), Singletons.Player.getY(),
    Singletons.Player.getSightRadius(),
    function (x, y, radius, visibility) {
      visibleCells[x + "," + y] = true;
      // Mark cell as explored
      level.setExplored(x, y, true);
    });

  for (var x = x1; x < x2; x++) {
    for (var y = y1; y < y2; y++) {
      if (this.isExplored(x, y)) {
        // Fetch the glyph for the tile and render it to the screen
        // at the offset position.
        var tile = this.getTile(x, y);
        tile.draw(display, x - x1, y - y1, {
          outsideFOV: !visibleCells[x + ',' + y],
          lightColor: this.getLightingModel().getColorAtCoord(x, y)
        });
      }
    }
  }

  // Render the entities
  var entities = _.filter(this.getEntities(), function (entity) {
    // Only render the entity if they would show up on the screen
    if (entity.isInBounds(x1, y1, x2, y2)) {
      if (entity.hasMixin('aspect')) {
        if (visibleCells[entity.getX() + ',' + entity.getY()]) {
          return true;
        } else if (entity.getDisplayOutsideFov() && level.isExplored(entity.getX(), entity.getY())) {
          return true;
        }
      }
    }
  });

  entities.sort(function (a, b) {
    return a.getRenderLayer() - b.getRenderLayer();
  });

  _.forEach(entities, function (entity) {
    entity.draw(display, entity.getX() - x1, entity.getY() - y1, {
      lightColor: level.getLightingModel().getColorAtCoord(entity.getX(), entity.getY())
    });
  });
  console.timeEnd('Draw Viewport');
};

Level.prototype.getEntities = function () {
  return this._entities || [];
};

Level.prototype.getEntitiesAt = function (x, y) {
  // Iterate through all entities searching for one with
  // matching position
  return _.filter(this.getEntities(), function (ent) {
    if (ent.getX() === x && ent.getY() === y) {
      return true;
    }
  });
};

Level.prototype.queryEntities = function (filter) {
  // Iterate through all entities searching for one with
  // matching position
  return _.filter(this.getEntities(), filter);
};

Level.prototype.queryEntitiesAt = function (x, y, filter) {
  // Iterate through all entities searching for one with
  // matching position
  return _.filter(this.getEntitiesAt(x, y), filter);
};

Level.prototype.getItemsAt = function (x, y) {
  return this.queryEntitiesAt(x, y, utils.namedEntityFilters.items);
};

Level.prototype.getEntitiesWithinRadius = function (centerX, centerY, radius) {
  // Determine our bounds
  var leftX = centerX - radius;
  var rightX = centerX + radius;
  var topY = centerY - radius;
  var bottomY = centerY + radius;

  // Iterate through our entities, adding any which are within the bounds
  return _.filter(this._entities, function (entity) {
    return entity.isInBounds(leftX, topY, rightX, bottomY);
  });
};

/**
 * Will return an array of entities within a specified radius optionally filtered by filter
 * @param centerX
 * @param centerY
 * @param radius
 * @param filter
 * @returns {*}
 */
Level.prototype.queryEntitiesWithinRadiua = function (centerX, centerY, radius, filter) {
  return _.filter(this.getEntitiesWithinRadius(centerX, centerY, radius), filter);
};

/**
 * Gets the width of the level
 * @returns {*|Level._width}
 */
Level.prototype.getWidth = function () {
  return this._width;
};

/**
 * Gets the height of the level
 * @returns {*|Level._height}
 */
Level.prototype.getHeight = function () {
  return this._height;
};

/**
 * Gets the tile at a given coordinate
 * @param x
 * @param y
 * @returns {*}
 */
Level.prototype.getTile = function (x, y) {
  // Make sure we are inside the bounds. If we aren't, return
  // null tile.
  if (!this.isInBounds(x, y)) {
    return Singletons.TileCatalog.get('nullTile');
  } else {
    return this._tiles[x][y] || Singletons.TileCatalog.get('nullTile');
  }
};

Level.prototype.setTile = function (x, y, tile) {
  if (this.isInBounds(x, y)) {
    this._tiles[x][y] = tile;
  }
};

Level.prototype.getTileArray = function () {
  return this._tiles;
};

Level.prototype.getFov = function () {
  return this._fov;
};

Level.prototype.setFov = function (fovFunction) {
  this._fov = fovFunction;
};

/**
 * Returns whether the current tile is empty
 * @param x
 * @param y
 * @returns {boolean}
 */
Level.prototype.isEmptyFloor = function (x, y) {
  // Check if the tile is floor and also has no entity
  return this.getTile(x, y).isWalkable() &&
    !this.getEntitiesAt(x, y).length;
};

Level.prototype.dig = function (x, y) {
  // If the tile is diggable, update it to a floor
  if (this.getTile(x, y).isDiggable()) {
    this._tiles[x][y] = Singletons.TileCatalog.get('floorTile');
  }
};

Level.prototype.getRandomFloorPosition = function () {
  // Randomly generate a tile which is a floor
  var x, y;
  do {
    x = Singletons.RNG.randomIntInRange(0, this.getWidth());
    y = Singletons.RNG.randomIntInRange(0, this.getHeight());
  } while (!this.isEmptyFloor(x, y));
  return {
    x: x,
    y: y
  };
};

/**
 * Determine if a coordinate pair is in-bounds of the map
 * @param x
 * @param y
 * @returns {boolean} the coord is in bounds
 */
Level.prototype.isInBounds = function (x, y) {
  if (x < 0 || x >= this.getWidth() ||
    y < 0 || y >= this.getHeight()) {
    return false;
  }
  return true;
};

/**
 * Add an entity to the world
 * @param entity entity to add
 */
Level.prototype.addEntity = function (entity) {

  // Make sure the entity's position is within bounds
  if (!this.isInBounds(entity.getX(), entity.getY())) {
    throw new Error('adding entity out of bounds.');
  }
  // Update the entity's map
  entity.setMap(this);
  // Add the entity to the list of entities
  this._entities.push(entity);

  entity.raiseEvent(eventMessage.onEnteredLevel, this);
  // Check if this entity is an actor, and if so add
  // them to the scheduler
  if (this.isActiveLevel()) {
    if (this.isActiveLevel() && entity.hasMixin('Actor')) {
      Singletons.World.getScheduler().add(entity, true);
    }
  }
};

Level.prototype.isActiveLevel = function () {
  return Singletons.World.getActiveLevelId() === this.getLevelId();
};

/**
 * Removes an entity from the world
 * @param entity entity to remove
 */
Level.prototype.removeEntity = function (entity) {
  // Find the entity in the list of entities if it is present
  for (var i = 0; i < this._entities.length; i++) {
    if (this._entities[i] === entity) {
      this._entities.splice(i, 1);
      break;
    }
  }
  if (entity.hasMixin('position')) {
    entity.setMap(null);
    entity.setPosition(0, 0);
  }
  // If the entity is an actor, remove them from the scheduler
  if (this.isActiveLevel() && entity.hasMixin('Actor')) {
    Singletons.World.getScheduler().remove(entity);
  }
};

Level.prototype.addEntityAtPosition = function (entity, x, y) {
  entity.setPosition(x, y);
  this.addEntity(entity);
};

Level.prototype.addEntityAtRandomPosition = function (entity) {
  var position = this.getRandomFloorPosition();
  this.addEntityAtPosition(entity, position.x, position.y);
};

Level.prototype.setExplored = function (x, y, state) {
  // Only update if the tile is within bounds
  if (this.isInBounds(x, y)) {
    this._explored[x][y] = state;
  }
};

Level.prototype.isExplored = function (x, y) {
  // Only return the value if within bounds
  if (this.isInBounds(x, y)) {
    return this._explored[x][y];
  } else {
    return false;
  }
};

module.exports = Level;
