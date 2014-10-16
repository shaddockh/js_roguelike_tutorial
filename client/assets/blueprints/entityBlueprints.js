var Blueprints = {};
Blueprints.Actor = {
  inherits: '_base',
  name: 'Actor',
  Position: {},
  Moveable: {},
  Aspect: {
    screenName: 'Actor',
    blocksPath: true
  },
  Life: {}
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
  MessageRecipient: {},
  Digger: {},
  InventoryHolder: {
    inventorySlots: 22
  },
  FoodConsumer: {

  }
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
    maxHp: 10,
    destroySpawnTemplate: 'Bloodstain'
  }
};
Blueprints.WanderingActorTemplate = {
  inherits: 'Actor',
  name: 'WanderingActorTemplate',
  WanderingActor: {},
  Destructible: {
    destroySpawnTemplate: 'Bloodstain'
  }
};

Blueprints.BatTemplate = {
  inherits: 'WanderingActorTemplate',
  name: 'BatTemplate',
  Aspect: {
    character: 'B',
    foreground: 'white',
    screenName: 'bat'
  },
  Destructible: {
    maxHp: 5
  },
  Attacker: {
    attackValue: 4
  },
  CorpseDropper: {}
};

Blueprints.NewtTemplate = {
  inherits: 'WanderingActorTemplate',
  name: 'NewtTemplate',
  Aspect: {
    character: ':',
    foreground: 'yellow',
    screenName: 'newt'
  },
  Destructible: {
    maxHp: 3
  },
  Attacker: {
    attackValue: 2
  },
  CorpseDropper: {}
};
Blueprints.Item = {
  inherits: '_base',
  name: 'Item',
  Position: {},
  Aspect: {
    blocksPath: false,
    renderLayer: -1
  },
  Item: {}
};
Blueprints.BaseFood = {
  inherits: 'Item',
  name: 'BaseFood',
  Edible: {}
};

Blueprints.apple = {
  inherits: 'BaseFood',
  name: 'apple',
  Aspect: {
    character: '%',
    foreground: 'red',
    screenName: 'apple'
  },
  Edible: {
    foodValue: 50
  }
};

Blueprints.melon = {
  inherits: 'BaseFood',
  name: 'melon',
  Aspect: {
    character: '%',
    foreground: 'brightGreen',
    screenName: 'melon'
  },
  Edible: {
    foodValue: 35,
    consumptions: 4
  }
};

Blueprints.rock = {
  inherits: 'Item',
  name: 'rock',
  Aspect: {
    character: '*',
    foreground: 'white',
    screenName: 'rock'
  }
};

Blueprints.Decal = {
  inherits: '_base',
  name: 'Decal',
  Position: {},
  Aspect: {
    blocksPath: false,
    renderLayer: -99
  }
};

//TODO: Decals need to be drawn before actors/items
Blueprints.Bloodstain = {
  inherits: 'Decal',
  name: 'Bloodstain',
  Aspect: {
    character: '.',
    foreground: 'red',
    background: 'black',
    screenName: 'blood',
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

Blueprints.corpse = {
  name: 'corpse',
  inherits: 'Item',
  Aspect: {
    character: '%',
    screenName: 'Corpse'
  },
  Edible: {
    foodValue: 75,
    consumptions: 1
  }
};

module.exports = Blueprints;
