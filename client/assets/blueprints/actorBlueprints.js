var Blueprints = {};
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
  FoodConsumer: {},
  EquipSlots: {}
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
  FungusActor: {
    speed: 250
  },
  Destructible: {
    maxHp: 10,
    destroySpawnTemplate: 'Bloodstain'
  }
};

//////////////////////////////
// WANDERERS
/////////////////////////////
Blueprints.WanderingActorTemplate = {
  inherits: 'Actor',
  name: 'WanderingActorTemplate',
  TaskActor: {
    aiTasks: ['aiTaskWander']
  },
  //WanderingActor: {},
  Destructible: {
    destroySpawnTemplate: 'Bloodstain'
  },
  CorpseDropper: {}
};

Blueprints.BatTemplate = {
  inherits: 'WanderingActorTemplate',
  name: 'BatTemplate',
  TaskActor: {
    speed: 2000
  },
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
  }
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
  }
};

//////////////////////////////
// HUNTERS
/////////////////////////////
Blueprints.HunterActorTemplate = {
  inherits: 'Actor',
  name: 'HunterActorTemplate',
  Sight: {
    sightRadius: 5
  },
  TaskActor: {
    aiTasks: ['aiTaskHunt', 'aiTaskWander']
  },
  CorpseDropper: {},
  Destructible: {
    destroySpawnTemplate: 'Bloodstain'
  }
};

Blueprints.KoboldTemplate = {
  name: 'kobold',
  inherits: 'HunterActorTemplate',
  Aspect: {
    character: 'k',
    foreground: 'white',
    screenName: 'Kobold'
  },
  Destructible: {
    maxHp: 6
  },
  Attacker: {
    attackValue: 4
  },
  Sight: {
    sightRadius: 5
  }
};

module.exports = Blueprints;
