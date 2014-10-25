// Create our Mixins namespace
var Singletons = require('./../singletons');
var Game = require('./../game');
var Entity = require('./../entity');

var Mixins = {};

var BaseMixin = function (name, type) {
  return {
    name: name,
    obsolete: false,
    type: type || name,
    init: function (blueprint) {}
  };
};

Mixins.Debug = {
  name: 'Debug',
  obsolete: false,
  type: 'Debug',
  doc: 'Turns on debug mode for entity',
  init: function (blueprint) {
    if (typeof (blueprint.isDebug) !== 'undefined') {
      this._isDebug = blueprint.isDebug;
    } else {
      this._isDebug = false;
    }
  },
  debugEnabled: function () {
    //TODO: probably need to also look at a global DebugEnabled flag
    return this._isDebug;
  },
  debug: function (msg, component) {
    if (this.debugEnabled()) {
      console.log(msg);
    }
  }
};

Mixins.Activateable = {
  name: 'Activateable',
  obsolete: false,
  type: 'Activateable',
  doc: 'Allows components to register for activate messages',
  init: function (blueprint) {
    this._registeredActivateCallbacks = [];
  },
  registerActivate: function (callback, activateMessageFilter) {
    this._registeredActivateCallbacks.push(callback);
  },
  activate: function (activateMessage) {
    console.log('activate called');
    for (var i = 0; i < this._registeredActivateCallbacks.length; i++) {
      this._registeredActivateCallbacks[i].call(this, activateMessage);
    }
  }
};

Mixins.Portal = {
  name: 'Portal',
  obsolete: false,
  type: 'Portal',
  doc: 'Moves player from one level to another level',
  init: function (blueprint) {
    this._targetLevel = blueprint.targetLevel || null;
    this._targetX = blueprint.targetX || null;
    this._targetY = blueprint.targetY || null;
    if (this.hasMixin('Activateable')) {
      this.registerActivate(this.activatePortal);
    }
  },
  setPortalTarget: function (level, x, y) {
    this._targetLevel = level;
    this._targetX = x;
    this._targetY = y;
  },
  activatePortal: function (activateMessage) {
    //TODO: handle specific messages
    console.log('TODO: Handle Portal Specific Messages ');
    Singletons.World.getActiveLevel().removeEntity(Singletons.Player);
    Singletons.World.setActiveLevel(this._targetLevel);
    Singletons.World.getActiveLevel().addEntityAtPosition(Singletons.Player, this._targetX, this._targetY);
    console.log('Switching to level: ' + this._targetLevel);

  }
};

Mixins.Aspect = {
  name: 'Aspect',
  obsolete: false,
  type: 'Aspect',
  doc: 'Handles the visual for an entity.  Will draw itself onto the screen',
  init: function (blueprint) {
    this._character = blueprint.character;
    this._foreground = blueprint.foreground;
    this._obscuredForeground = blueprint.obscuredForeground || 'dimGray';
    this._background = blueprint.background;
    this._screenName = blueprint.screenName;
    this._blocksPath = blueprint.blocksPath || false;
    this._renderLayer = blueprint.renderLayer || 0;
  },
  draw: function (display, x, y, options) {
    options = options || {};
    display.draw(
      x, y,
      this.getChar(),
      options.outsideFOV ? this.getObscuredForeground() : this.getForeground(),
      this.getBackground()
    );
  },
  getChar: function () {
    return this._character;
  },
  getForeground: function () {
    return this._foreground;
  },
  getObscuredForeground: function () {
    return this._obscuredForeground;
  },
  getBackground: function () {
    return this._background;
  },
  getScreenName: function () {
    return this._screenName;
  },
  blocksPath: function () {
    return this._blocksPath;
  },
  getRenderLayer: function () {
    return this._renderLayer;
  },
  describe: function () {
    return this._screenName;
  },
  describeA: function (capitalize) {
    // Optional parameter to capitalize the a/an.
    var prefixes = capitalize ? ['A', 'An'] : ['a', 'an'];
    var string = this.describe();
    var firstLetter = string.charAt(0).toLowerCase();
    // If word starts by a vowel, use an, else use a. Note that this is not perfect.
    var prefix = 'aeiou'.indexOf(firstLetter) >= 0 ? 1 : 0;

    return prefixes[prefix] + ' ' + string;
  },
  describeThe: function (capitalize) {
    var prefix = capitalize ? 'The' : 'the';
    return prefix + ' ' + this.describe();
  }
};

// Define our Moveable mixin
Mixins.Moveable = {
  name: 'Moveable',
  obsolete: false,
  type: 'Moveable',
  init: function (blueprint) {},
  tryMove: function (x, y, map) {
    map = map || this.getMap();
    var tile = map.getTile(x, y);

    // Check if we can walk on the tile
    // and if so simply walk onto it

    var targets = map.getEntitiesAt(x, y).filter(function (entity) {
      if (entity.hasMixin('aspect') && entity.blocksPath()) {
        return true;
      } else {
        return false;
      }
    });

    if (targets.length) {
      //entity there..can't walk
      var result = false;
      for (var i = 0; i < targets.length; i++) {
        if (this.hasMixin('Attacker') && this.canAttack(targets[i])) {
          this.attack(targets[i]);
          result = true;
        }
      }
      return result;
    }

    if (tile.isWalkable()) {
      // Update the entity's position
      this.setX(x);
      this.setY(y);

      if (this.hasMixin('PlayerActor')) {
        //TODO: needs to be fixed to only pick up visible items
        var items = this.getMap().getItemsAt(x, y);
        if (items.length) {
          if (items.length === 1) {
            Game.sendMessage(this, "You see %s.", [items[0].describeA()]);
          } else {
            Game.sendMessage(this, "There are several things here.");
          }
        }
      }

      return true;
      // Check if the tile is diggable, and
      // if so try to dig it
    } else if (this.hasMixin('digger') && tile.isDiggable()) {
      map.dig(x, y);
      return true;
    }
    return false;
  }
};

Mixins.Digger = {
  name: 'Digger',
  obsolete: false,
  doc: 'Can dig',
  init: function (blueprint) {

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
  },
  setPosition: function (x, y) {
    this._x = x;
    this._y = y;
  },
  isInBounds: function (x1, y1, x2, y2) {
    return this.getX() >= x1 && this.getX() < x2 && this.getY() >= y1 && this.getY() < y2;
  }
};

Mixins.Destructible = {
  name: 'Destructible',
  type: 'Destructible',
  doc: 'Takes damage',
  init: function (blueprint) {
    this._maxHp = blueprint.maxHp || 10;
    this._hp = blueprint.hp || this._maxHp;
    this._defenseValue = blueprint.defenseValue || 0;
    this._destroySpawnTemplate = blueprint.destroySpawnTemplate || null;
    this._destroyMessage = blueprint.destroyMessage || 'You kill the %s!';
  },
  takeDamage: function (attacker, damage) {
    this._hp -= damage;
    // If have 0 or less HP, then remove ourseles from the map
    if (this._hp <= 0) {
      Game.sendMessage(attacker, this._destroyMessage, [this.getScreenName()]);
      if (this._destroySpawnTemplate) {
        var spawn = new Entity(this._destroySpawnTemplate);
        this.getMap().addEntityAtPosition(spawn, this.getX(), this.getY());
      }
      // If the entity is a corpse dropper, try to add a corpse
      if (this.hasMixin('DestroySpawn')) {
        this.tryDestroySpawn();
      }

      if (this.hasMixin('Life')) {
        this.kill();
      } else {
        this.getMap().removeEntity(this);
      }
    }
  },
  getHp: function () {
    return this._hp;
  },
  setHp: function (value) {
    this._hp = value;
  },
  getMaxHp: function () {
    return this._maxHp;
  },
  setMaxHp: function (value) {
    this._maxHp = value;
  },
  getDefenseValue: function () {
    var modifier = 0;
    // If we can equip items, then have to take into
    // consideration weapon and armor
    if (this.hasMixin('EquipSlots')) {
      modifier = this.getEquippedDefenseValue();
    }
    return this._defenseValue + modifier;
  },
  setDefenseValue: function (value) {
    this._defenseValue = value;
  }
};

Mixins.Attacker = {
  name: 'Attacker',
  type: 'Attacker',
  doc: 'Attacker',
  init: function (blueprint) {
    this._attackValue = blueprint.attackValue || 1;
  },
  getAttackValue: function () {
    var modifier = 0;
    // If we can equip items, then have to take into
    // consideration weapon and armor
    if (this.hasMixin('EquipSlots')) {
      modifier = this.getEquippedAttackValue();
    }
    return this._attackValue + modifier;
  },
  setAttackValue: function (value) {
    this._attackValue = value;
  },
  canAttack: function (target) {

    //TODO: build some kind of alignment system
    if (this.hasMixin('PlayerActor') || target.hasMixin('PlayerActor')) {
      return true;
    } else {
      return false;
    }
  },
  attack: function (target) {
    // Only remove the entity if they were attackable
    if (target.hasMixin('Destructible')) {
      var attack = this.getAttackValue();
      var defense = target.getDefenseValue();
      var max = Math.max(0, attack - defense);
      var damage = Singletons.RNG.randomIntInRange(1, max);

      Game.sendMessage(this, 'You strike the %s for %d damage!', [target.getScreenName(), damage]);
      Game.sendMessage(target, 'The %s strikes you for %d damage!', [this.getScreenName(), damage]);

      target.takeDamage(this, damage);
    }
  }
};

Mixins.MessageRecipient = {
  name: 'MessageRecipient',
  type: 'MessageRecipient',
  doc: 'Can display messages to the screen',
  init: function (blueprint) {
    this._messages = [];
  },
  receiveMessage: function (message) {
    this._messages.push(message);
  },
  getMessages: function () {
    return this._messages;
  },
  clearMessages: function () {
    this._messages = [];
  }
};

Mixins.Sight = {
  name: 'Sight',
  type: 'Sight',
  doc: 'This signifies our entity possesses a field of vision of a given radius',
  init: function (blueprint) {
    this._sightRadius = blueprint.sightRadius || 5;
  },
  getSightRadius: function () {
    return this._sightRadius;
  },
  canSee: function (entity) {
    // If not on the same map or on different floors, then exit early
    if (!entity || this.getMap() !== entity.getMap()) {
      return false;
    }

    var otherX = entity.getX(),
      otherY = entity.getY(),
      x = this.getX(),
      y = this.getY();

    var sightRadius = this.getSightRadius();

    var leftX = x - sightRadius,
      rightX = x + sightRadius,
      topY = y - sightRadius,
      bottomY = y + sightRadius;

    // If we're not in a square field of view, then we won't be in a real
    // field of view either.
    if (!entity.isInBounds(leftX, topY, rightX, bottomY)) {
      return false;
    }

    // Compute the FOV and check if the coordinates are in there.
    var found = false;

    var level = this.getMap();
    level.getFov().compute(
      x, y, sightRadius, function (x, y, radius, visibility) {
        if (x === otherX && y === otherY) {
          found = true;
        }
      });
    return found;
  }
};

Mixins.InventoryHolder = {
  name: 'InventoryHolder',
  doc: 'Contains inventory items',
  init: function (blueprint) {
    // Default to 10 inventory slots.
    var inventorySlots = blueprint.inventorySlots || 10;
    // Set up an empty inventory.
    this._items = new Array(inventorySlots);
  },
  getItems: function () {
    return this._items;
  },
  getItem: function (i) {
    return this._items[i];
  },
  addItem: function (item) {
    // Try to find a slot, returning true only if we could add the item.
    for (var i = 0; i < this._items.length; i++) {
      if (!this._items[i]) {
        this._items[i] = item;
        return true;
      }
    }
    return false;
  },
  removeItem: function (i) {
    // If we can equip items, then make sure we unequip the item we are removing.
    if (this._items[i] && this.hasMixin('EquipSlots') && this._items[i].hasMixin('Equippable')) {
      this.unequip(this._items[i]);
    }
    // Simply clear the inventory slot.
    this._items[i] = null;
  },
  canAddItem: function () {
    // Check if we have an empty slot.
    for (var i = 0; i < this._items.length; i++) {
      if (!this._items[i]) {
        return true;
      }
    }
    return false;
  },
  pickupItems: function (indices) {
    // Allows the user to pick up items from the map, where indices is
    // the indices for the array returned by map.getItemsAt
    var level = this.getMap();
    var mapItems = level.getItemsAt(this.getX(), this.getY());
    var added = 0;
    var removed = [];
    // Iterate through all indices.
    for (var i = 0; i < indices.length; i++) {
      // Try to add the item. If our inventory is not full, then splice the
      // item out of the list of items. In order to fetch the right item, we
      // have to offset the number of items already added.
      var currentIdx = indices[i] - added;
      if (this.addItem(mapItems[currentIdx])) {
        removed.push(mapItems[currentIdx]);
        mapItems.splice(currentIdx, 1);
        added++;
      } else {
        // Inventory is full
        break;
      }
    }
    // Update the map items
    removed.forEach(function (item) {
      level.removeEntity(item);
    });
    //this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
    // Return true only if we added all items
    return added === indices.length;
  },
  dropItem: function (i) {
    // Drops an item to the current map tile
    if (this._items[i]) {
      this.getMap().addEntityAtPosition(this._items[i], this.getX(), this.getY());
      this.removeItem(i);
    }
  }
};

Mixins.Item = {
  name: 'Item',
  doc: 'Item ',
  init: function (blueprint) {

  }
};

Mixins.Life = {
  name: 'Life',
  doc: 'Alive or Dead',
  init: function (blueprint) {
    this._alive = typeof (blueprint.alive) === 'undefined' ? true : blueprint.alive;
  },
  isAlive: function () {
    return this._alive;
  },
  kill: function (message) {
    // Only kill once!
    if (!this._alive) {
      return;
    }
    this._alive = false;
    message = message || 'You have died!';
    Game.sendMessage(this, "You have died!");

    // Check if the player died, and if so call their act method to prompt the user.
    if (this.hasMixin('PlayerActor')) {
      this.act();
    } else {
      this.getMap().removeEntity(this);
    }
  }
};

Mixins.FoodConsumer = {
  name: 'FoodConsumer',
  doc: 'Food Consumer',
  init: function (blueprint) {
    this._maxFullness = blueprint.maxFullness || 1000;
    // Start halfway to max fullness if no default value
    this._fullness = blueprint.fullness || (this._maxFullness / 2);
    // Number of points to decrease fullness by every turn.
    this._fullnessDepletionRate = blueprint.fullnessDepletionRate || 1;
  },
  addTurnHunger: function () {
    // Remove the standard depletion points
    this.modifyFullnessBy(this._fullnessDepletionRate * -1);
  },
  modifyFullnessBy: function (points) {
    this._fullness += points;
    if (this._fullness <= 0) {
      this.kill("You have died of starvation!");
    } else if (this._fullness > this._maxFullness) {
      this.kill("You choke and die!");
    }
  },
  getHungerState: function () {
    // Fullness points per percent of max fullness
    var perPercent = this._maxFullness / 100;
    // 5% of max fullness or less = starving
    if (this._fullness <= perPercent * 5) {
      return 'Starving';
      // 25% of max fullness or less = hungry
    } else if (this._fullness <= perPercent * 25) {
      return 'Hungry';
      // 95% of max fullness or more = oversatiated
    } else if (this._fullness >= perPercent * 95) {
      return 'Oversatiated';
      // 75% of max fullness or more = full
    } else if (this._fullness >= perPercent * 75) {
      return 'Full';
      // Anything else = not hungry
    } else {
      return 'Not Hungry';
    }
  }
};

Mixins.CorpseDropper = {
  name: 'CorpseDropper',
  type: 'DestroySpawn',
  init: function (blueprint) {
    // Chance of dropping a cropse (out of 100).
    this._corpseDropRate = blueprint.corpseDropRate || 100;
  },
  tryDestroySpawn: function () {
    if (Math.round(Math.random() * 100) < this._corpseDropRate) {
      // Create a new corpse item and drop it.
      var corpse = new Entity('corpse', {
        Aspect: {
          screenName: this.getScreenName() + ' corpse',
          foreground: this.getForeground()
        }
      });
      this.getMap().addEntityAtPosition(corpse, this.getX(), this.getY());
    }
  }
};

Mixins.EquipSlots = {
  name: 'EquipSlots',
  doc: 'Allows an entity to equip items',
  init: function (blueprint) {
    this._weapon = blueprint.weapon || null;
    this._armor = blueprint.armor || null;
  },
  wield: function (item) {
    this._weapon = item;
  },
  unwield: function () {
    this._weapon = null;
  },
  wear: function (item) {
    this._armor = item;
  },
  takeOff: function () {
    this._armor = null;
  },
  getWeapon: function () {
    return this._weapon;
  },
  getArmor: function () {
    return this._armor;
  },
  unequip: function (item) {
    // Helper function to be called before getting rid of an item.
    if (this._weapon === item) {
      this.unwield();
    }
    if (this._armor === item) {
      this.takeOff();
    }
  },
  getEquippedDefenseValue: function () {
    var modifier = 0;
    if (this.getWeapon()) {
      modifier += this.getWeapon().getDefenseValue();
    }
    if (this.getArmor()) {
      modifier += this.getArmor().getDefenseValue();
    }
    return modifier;
  },
  getEquippedAttackValue: function () {
    var modifier = 0;
    // If we can equip items, then have to take into
    // consideration weapon and armor
    if (this.getWeapon()) {
      modifier += this.getWeapon().getAttackValue();
    }
    if (this.getArmor()) {
      modifier += this.getArmor().getAttackValue();
    }
    return modifier;
  }
};

module.exports = Mixins;
