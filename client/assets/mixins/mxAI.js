var Mixins = {},
  Singletons = require('../singletons'),
  Game = require('../game'),
  Entity = require('../entity'),
  Dictionary = require('entity-blueprint-manager').Dictionary,
  eventMessage = require('./../utils').events,
  ROT = require('rot');

/**
 * This is a base mixin type.  Any mixins that specify this as their 'type' will first call init on this
 * type and then init themselves.  This allows specific types of mixins to only override the functionality
 * that they need to from a base mixin type
 */
Mixins.Actor = {
  name: 'Actor',
  type: 'Actor',
  doc: 'Base actor mixin',
  init: function (blueprint) {
    this._speed = blueprint.speed || 1000;
  },
  getSpeed: function () {
    return this._speed;
  },
  setSpeed: function (value) {
    this._speed = value;
  },
  act: function () {
    if (this._acting) {
      return;
    }
    this.raiseEvent(eventMessage.onAct);
    this._acting = false;
  }
};

Mixins.PlayerActor = {
  name: 'PlayerActor',
  type: 'Actor',
  doc: 'Player controller',
  init: function (blueprint) {},
  listeners: {
    onAct: function () {
      this.raiseEvent(eventMessage.onGameTurn);
      // Detect if the game is over
      if (!this.isAlive()) {
        Singletons.ScreenCatalog.getScreen('PlayScreen').setGameEnded(true);
        // Send a last message to the player
        Game.sendMessage(this, 'You have died... Press [Enter] to continue!');
      }
      //Re-render the screen
      Game.refresh();
      //lock the engine and wait asynchronously
      //for the player to press a key
      Singletons.World.getEngine().lock();
      this.clearMessages();
    }
  },
  playerActivate: function (x, y, map, activateMessage) {
    this.getMap().getEntitiesAt(x, y).forEach(function (entity) {
      if (entity.hasMixin('activateable')) {
        entity.activate(activateMessage);
      }
    });
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
  listeners: {
    onAct: function () {
      this.doAct();
    }
  },
  doAct: function () {
    // Check if we are going to try growing this turn
    if (this._growthsRemaining > 0) {
      if (Singletons.RNG.random() <= 0.02) {
        // Generate the coordinates of a random adjacent square by
        // generating an offset between [-1, 0, 1] for both the x and
        // y directions. To do this, we generate a number from 0-2 and then
        // subtract 1.
        var xOffset = Singletons.RNG.randomIntInRange(0, 2);
        var yOffset = Singletons.RNG.randomIntInRange(0, 2);
        // Make sure we aren't trying to spawn on the same tile as us
        if (xOffset !== 0 && yOffset !== 0) {
          // Check if we can actually spawn at that location, and if so
          // then we grow!
          if (this.getMap().isEmptyFloor(this.getX() + xOffset,
              this.getY() + yOffset)) {

            var entity = new Entity(this._templateToSpawn);
            entity.setPosition(this.getX() + xOffset, this.getY() + yOffset);
            this.getMap().addEntity(entity);
            this._growthsRemaining--;
            // Send a message nearby!
            Game.sendMessageNearby(this.getMap(),
              entity.getX(), entity.getY(), 5,
              'The fungus is spreading!');
          }
        }
      }
    }
  }
};

Mixins.WanderingActor = {
  name: 'WanderingActor',
  type: 'Actor',
  doc: 'Wandering actor.  Just randomly wanders around',
  listeners: {
    onAct: function () {
      this.doAct();
    }
  },
  doAct: function () {
    // Flip coin to determine if moving by 1 in the positive or negative direction
    var moveOffset = (Math.round(Singletons.RNG.random()) === 1) ? 1 : -1;
    // Flip coin to determine if moving in x direction or y direction
    if (Math.round(Singletons.RNG.random()) === 1) {
      this.tryMove(this.getX() + moveOffset, this.getY());
    } else {
      this.tryMove(this.getX(), this.getY() + moveOffset);
    }
  }
};

Mixins.TaskActor = {
  name: 'TaskActor',
  type: 'Actor',
  doc: 'Actor handler that can be a provided a list of AiTaskHandler names to try to execute.  AiTaskHandlers determine if they can run and what they do when run',
  init: function (blueprint) {
    this._registeredTasks = new Dictionary({
      ignoreCase: true
    });
    // Load tasks
    this._tasks = [];
    this.loadAiTasks(blueprint.aiTasks || ['AiTaskWander']);
  },
  loadAiTasks: function (taskArray) {
    for (var i = 0; i < taskArray.length; i++) {
      if (!this.hasMixin(taskArray[i])) {
        this.attachMixin(taskArray[i]);
      }
      this._tasks.push(taskArray[i]);
    }
  },
  registerAiTask: function (mixinName, taskMethodName, canDoTaskMethodName) {
    this._registeredTasks.add(mixinName, {
      taskName: taskMethodName,
      canDoTaskName: canDoTaskMethodName
    });
  },
  listeners: {
    onAct: function () {
      this.doAct();
    }
  },
  doAct: function () {
    // Iterate through all our tasks
    var task;
    for (var i = 0; i < this._tasks.length; i++) {
      var taskName = this._tasks[i];
      if (this.canDoAiTask(taskName)) {
        // If we can perform the task, execute the function for it.
        this[this._registeredTasks.get(taskName).taskName]();
        return;
      }
    }
  },
  canDoAiTask: function (taskName) {
    if (this._registeredTasks.containsKey(taskName)) {
      var task = this._registeredTasks.get(taskName);
      return this[task.canDoTaskName]();
    } else {
      throw new Error('Tried to perform undefined task ' + taskName);
    }
  }
};

Mixins.AiTaskHunt = {
  name: 'AiTaskHunt',
  type: 'AiTask',
  doc: 'Hunter AiTask - hunts down the player if in sight',
  init: function (blueprint, mixin) {
    this.registerAiTask(mixin.name, 'hunt', 'canHunt');
  },
  canHunt: function () {
    return this.hasMixin('Sight') && this.canSee(Singletons.Player);
  },
  hunt: function () {
    var goal = Singletons.Player;

    // If we are adjacent to the player, then attack instead of hunting.
    var offsets = Math.abs(goal.getX() - this.getX()) +
      Math.abs(goal.getY() - this.getY());
    if (offsets === 1) {
      if (this.hasMixin('Attacker')) {
        this.attack(goal);
        return;
      }
    }

    // Generate the path and move to the first tile.
    var source = this;
    var map = source.getMap();
    var path = new ROT.Path.AStar(goal.getX(), goal.getY(), function (x, y) {
      if (!map.getTile(x, y).isWalkable()) {
        return false;
      }
      //get all entities that either block path or are not the target or the source
      var targets = map.getEntitiesAt(x, y).filter(function (entity) {
        if (entity !== goal && entity !== source && entity.hasMixin('aspect') && entity.blocksPath()) {
          return true;
        } else {
          return false;
        }
      });

      return targets.length === 0;
    }, {
      topology: 4
    });
    // Once we've gotten the path, we want to move to the second cell that is
    // passed in the callback (the first is the entity's strting point)
    var count = 0;
    path.compute(source.getX(), source.getY(), function (x, y) {
      if (count === 1) {
        source.tryMove(x, y);
      }
      count++;
    });
  }
};

Mixins.AiTaskWander = {
  name: 'AiTaskWander',
  type: 'AiTask',
  doc: 'Wander task - randomly chooses a direction to move',
  init: function (blueprint, mixin) {
    this.registerAiTask(mixin.name, 'wander', 'canWander');
  },
  canWander: function () {
    return true;
  },
  wander: function () {
    // Flip coin to determine if moving by 1 in the positive or negative direction
    var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
    // Flip coin to determine if moving in x direction or y direction
    if (Math.round(Math.random()) === 1) {
      this.tryMove(this.getX() + moveOffset, this.getY());
    } else {
      this.tryMove(this.getX(), this.getY() + moveOffset);
    }
  }
};

Mixins.AiTaskSpawnSlime = {
  name: 'AiTaskSpawnSlime',
  type: 'AiTask',
  doc: 'Spawns a slime',
  init: function (blueprint, mixin) {
    this.registerAiTask(mixin.name, 'spawnSlime', 'canSpawnSlime');
  },
  canSpawnSlime: function () {
    return Math.round(Math.random() * 100) <= 10;
  },
  spawnSlime: function () {
    // Generate a random position nearby.
    var xOffset = Math.floor(Math.random() * 3) - 1,
      yOffset = Math.floor(Math.random() * 3) - 1,
      x = this.getX() + xOffset,
      y = this.getY() + yOffset;

    // Check if we can spawn an entity at that position.
    //TODO: should we look for an empty space? or just fail if the first try doesn't work?
    if (!this.getMap().isEmptyFloor(x, y)) {
      // If we cant, do nothing
      return;
    }
    // Create the entity
    var slime = new Entity('slime');
    this.getMap().addEntityAtPosition(slime, x, y);
  }
};

Mixins.AiTaskGrowArm = {
  name: 'AiTaskGrowArm',
  type: 'AiTask',
  doc: 'Grows an arm',
  init: function (blueprint, mixin) {
    this.registerAiTask(mixin.name, 'growArm', 'canGrowArm');
  },
  canGrowArm: function () {
    return this.getHp() <= 20 && !this._hasGrownArm;
  },
  growArm: function () {
    this._hasGrownArm = true;
    this.increaseAttackValue(5);
    // Send a message saying the zombie grew an arm.
    Game.sendMessageNearby(this.getMap(), this.getX(), this.getY(), 'An extra arm appears on the ' + this.getScreenName());
  }
};

module.exports = Mixins;
