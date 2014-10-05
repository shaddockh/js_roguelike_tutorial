var Blueprints = {};
Blueprints.Actor = {
  inherits: '_base',
  name: 'Actor',
  Position: {},
  Moveable: {},
  Aspect: {
    screenName: 'Actor',
    blocksPath: true
  }
};

// Player template
Blueprints.PlayerTemplate = {
  inherits: 'Actor',
  name: 'PlayerTemplate',
  Aspect: {
    character: '@',
    foreground: 'white',
    background: 'black',
    screenName: 'Player'
  },
  PlayerActor: {},
  Attacker: {
    attackValue: 10
  },
  Destructible: {
    maxHp: 40
  },
  Sight: {
    sightRadius: 6
  },
  MessageRecipient: {}
};

Blueprints.FungusTemplate = {
  inherits: 'Actor',
  name: 'FungusTemplate',
  Aspect: {
    character: 'F',
    foreground: 'green',
    background: 'black',
    screenName: 'Fungus'
  },
  FungusActor: {},
  Destructible: {
    maxHp: 10
  }
};

Blueprints.Gizmo = {
  inherits: '_base',
  name: 'Gizmo',
  position: {},
  activateable: {}
};

Blueprints.StairsPortal = {
  inherits: 'Gizmo',
  name: 'StairsPortal',
  portal: {
    targetLevel: null,
    targetX: null,
    targetY: null
  }
};

module.exports = Blueprints;
