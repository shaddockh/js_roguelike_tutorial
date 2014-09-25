// Create our Mixins namespace
var Mixins = {};

var BaseMixin = function (name, type) {
  return {
    name: name,
    obsolete: false,
    type: type || name,
    init: function (blueprint) {}
  };
};
Mixins.Aspect = {
  name: 'Aspect',
  obsolete: false,
  type: 'Aspect',
  init: function (blueprint) {
    this.character = blueprint.character;
    this.foreground = blueprint.foreground;
    this.background = blueprint.background;
  },
  draw: function (display, x, y) {
    display.draw(
      x, y,
      this.getChar(),
      this.getForeground(),
      this.getBackground()
    );
  },
  getChar: function () {
    return this.character;
  },
  getForeground: function () {
    return this.foreground;
  },
  getBackground: function () {
    return this.background;
  }
};

// Define our Moveable mixin
Mixins.Moveable = {
  name: 'Moveable',
  obsolete: false,
  type: 'Moveable',
  init: function (blueprint) {},
  tryMove: function (x, y, map) {
    var tile = map.getTile(x, y);
    var target = map.getEntityAt(x, y);
    // Check if we can walk on the tile
    // and if so simply walk onto it

    if (target) {
      // If we are an attacker, try to attack
      // the target
      if (this.hasMixin('Attacker')) {
        this.attack(target);
        return true;
      } else {
        // If not nothing we can do, but we can't
        // move to the tile
        return false;
      }
    }
    //entity there..can't walk
    if (tile.isWalkable()) {
      // Update the entity's position
      this.setX(x);
      this.setY(y);
      return true;
      // Check if the tile is diggable, and
      // if so try to dig it
    } else if (tile.isDiggable()) {
      map.dig(x, y);
      return true;
    }
    return false;
  }
};

Mixins.Position = {
  name: 'Position',
  obsolete: false,
  doc: 'Handles an entities position in the world',
  type: 'Position',
  init: function (blueprint) {
    this._x = blueprint.x || 0;
    this._y = blueprint.y || 0;
  },
  getX: function () {
    return this._x;
  },
  setX: function (x) {
    this._x = x;
  },
  getY: function () {
    return this._y;
  },
  setY: function (y) {
    this._y = y;
  },
  setMap: function (map) {
    this._map = map;
  },
  getMap: function () {
    return this._map;
  }
};

var Game = require('./game');
var Entity = require('./entity');

Mixins.PlayerActor = {
  name: 'PlayerActor',
  type: 'Actor',
  doc: 'Player controller',
  init: function (blueprint) {},
  act: function () {
    //Re-render the screen
    Game.refresh();
    //lock the engine and wait asynchronously
    //for the player to press a key
    this.getMap().getEngine().lock();
  }
};

Mixins.FungusActor = {
  name: 'FungusActor',
  type: 'Actor',
  doc: 'Monster (Fungus)',
  init: function (blueprint) {
    this._growthsRemaining = blueprint.growths || 5;
    this._templateToSpawn = blueprint.templateToSpawn || 'FungusTemplate';
  },
  act: function () {
    // Check if we are going to try growing this turn
    if (this._growthsRemaining > 0) {
      if (Math.random() <= 0.02) {
        // Generate the coordinates of a random adjacent square by
        // generating an offset between [-1, 0, 1] for both the x and
        // y directions. To do this, we generate a number from 0-2 and then
        // subtract 1.
        var xOffset = Math.floor(Math.random() * 3) - 1;
        var yOffset = Math.floor(Math.random() * 3) - 1;
        // Make sure we aren't trying to spawn on the same tile as us
        if (xOffset !== 0 && yOffset !== 0) {
          // Check if we can actually spawn at that location, and if so
          // then we grow!
          if (this.getMap().isEmptyFloor(this.getX() + xOffset,
            this.getY() + yOffset)) {

            //TODO: flesh out template in constructor
            var spawn = Game.BlueprintCatalog.getBlueprint(this._templateToSpawn);
            var entity = new Entity(spawn);
            entity.setX(this.getX() + xOffset);
            entity.setY(this.getY() + yOffset);
            this.getMap().addEntity(entity);
            this._growthsRemaining--;
            console.log('Spawned!!');
          }
        }
      }
    }
  }
};

Mixins.Destructible = {
  name: 'Destructible',
  type: 'Destructible',
  doc: 'Takes damage',
  init: function (blueprint) {
    this._hp = blueprint.hp || 1;
  },
  takeDamage: function (attacker, damage) {
    this._hp -= damage;
    // If have 0 or less HP, then remove ourseles from the map
    if (this._hp <= 0) {
      this.getMap().removeEntity(this);
    }
  },
  getHp: function () {
    return this._hp;
  },
  setHp: function (hp) {
    this._hp = hp;
  }
};

Mixins.SimpleAttacker = {
  name: 'SimpleAttacker',
  type: 'Attacker',
  doc: 'Simple attacker',
  attack: function (target) {
    // Only remove the entity if they were attackable
    if (target.hasMixin('Destructible')) {
      target.takeDamage(this, 1);
    }
  }
};

module.exports = Mixins;
