var Tile = require('./tile');
//Correponds to "World" in the other tutorial

var World = function (tiles) {
  this._tiles = tiles;
  // cache the width and height based
  // on the length of the dimensions of
  // the tiles array
  this._width = tiles.length;
  this._height = tiles[0].length;

  this._entities = [];
  //create the engine and the scheduler

  var ROT = require('./rot');
  //TODO: these should be passed in
  this._scheduler = new ROT.Scheduler.Simple();
  this._engine = new ROT.Engine(this._scheduler);

};

World.prototype.getEngine = function () {
  return this._engine;
};
World.prototype.getEntities = function () {
  return this._entities;
};

World.prototype.getEntityAt = function (x, y) {
  // Iterate through all entities searching for one with
  // matching position
  var ents = this.getEntities();
  for (var i = 0, len = ents.length; i < len; i++) {
    if (ents[i].getX() === x && ents[i].getY() === y) {
      return ents[i];
    }
  }
  return false;
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

/**
 * Returns whether the current tile is empty
 * @param x
 * @param y
 * @returns {boolean}
 */
World.prototype.isEmptyFloor = function (x, y) {
  // Check if the tile is floor and also has no entity
  return this.getTile(x, y) === Tile.floorTile &&
    !this.getEntityAt(x, y);
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
World.prototype.isInBounds = function (x, y) {
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
World.prototype.addEntity = function (entity) {
  // Make sure the entity's position is within bounds
  if (!this.isInBounds(entity.getX(), entity.getY())) {
    throw new Error('adding entity out of bounds.');
  }
  // Update the entity's map
  entity.setMap(this);
  // Add the entity to the list of entities
  this._entities.push(entity);
  // Check if this entity is an actor, and if so add
  // them to the scheduler
  if (entity.hasMixin('Actor')) {
    this._scheduler.add(entity, true);
  }
};

/**
 * Removes an entity from the world
 * @param entity entity to remove
 */
World.prototype.removeEntity = function (entity) {
  // Find the entity in the list of entities if it is present
  for (var i = 0; i < this._entities.length; i++) {
    if (this._entities[i] === entity) {
      this._entities.splice(i, 1);
      break;
    }
  }
  // If the entity is an actor, remove them from the scheduler
  if (entity.hasMixin('Actor')) {
    this._scheduler.remove(entity);
  }
};

World.prototype.addEntityAtRandomPosition = function (entity) {
  var position = this.getRandomFloorPosition();
  entity.setX(position.x);
  entity.setY(position.y);
  this.addEntity(entity);
};

World.prototype.getRandomFloorPosition = function () {
  // Randomly generate a tile which is a floor
  var Tile = require('./tile');
  var x, y;
  do {
    x = Math.floor(Math.random() * this._width);
    y = Math.floor(Math.random() * this._width);
  } while (this.getTile(x, y) !== Tile.floorTile || this.getEntityAt(x, y));
  return {
    x: x,
    y: y
  };
};

module.exports = World;
