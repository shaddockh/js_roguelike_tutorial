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
  EquipSlots: {},
  ExperienceGainer: {},
  PlayerStatGainer: {}
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
  },
  ExperienceGainer: {},
  RandomStatGainer: {}
};

Blueprints.TaskActor = {
  inherits: 'Actor',
  name: 'TaskActor',
  TaskActor: {
    aiTasks: ['aiTaskWander']
  }
};

//////////////////////////////
// WANDERERS
/////////////////////////////
Blueprints.WanderingActorTemplate = {
  inherits: 'TaskActor',
  name: 'WanderingActorTemplate',
  TaskActor: {
    aiTasks: ['aiTaskWander']
  },
  Destructible: {
    destroySpawnTemplate: 'Bloodstain'
  },
  CorpseDropper: {},
  ExperienceGainer: {},
  RandomStatGainer: {}
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
  inherits: 'TaskActor',
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
  },
  ExperienceGainer: {},
  RandomStatGainer: {}
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

Blueprints.GiantZombie = {
  name: 'giantZombie',
  inherits: 'HunterActorTemplate',
  Aspect: {
    character: 'Z',
    screenName: 'giant zombie'
  },
  Destructible: {
    maxHp: 30,
    defenseValue: 5
  },
  Attacker: {
    attackValue: 8
  },
  Sight: {
    sightRadius: 6
  },
  ExperienceGainer: {
    level: 5
  },
  TaskActor: {
    aiTasks: ['AiTaskWander', 'AiTaskHunt', 'AiTaskSpawnSlime', 'AiTaskGrowArm']
  },
  WinOnDeath: {}
};

Blueprints.slime = {
  name: 'slime',
  inherits: 'HunterActorTemplate',
  Aspect: {
    character: 's',
    foreground: 'lightGreen'
  },
  Destructible: {
    maxHp: 10
  },
  Attacker: {
    attackValue: 5
  },
  Sight: {
    sightRadius: 3
  }
};

module.exports = Blueprints;
