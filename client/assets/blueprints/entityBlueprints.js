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
  Life: {},
  Examinable: {}
};

Blueprints.Item = {
  inherits: '_base',
  name: 'Item',
  Position: {},
  Aspect: {
    blocksPath: false,
    renderLayer: -1
  },
  Examinable: {},
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
    foreground: 'lightGreen',
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

Blueprints.Bloodstain = {
  inherits: 'Decal',
  name: 'Bloodstain',
  Aspect: {
    character: '.',
    foreground: 'red',
    background: 'black',
    screenName: 'blood'
  }
};

Blueprints.Gizmo = {
  inherits: '_base',
  name: 'Gizmo',
  position: {},
  activateable: {}
};

Blueprints.Portal = {
  inherits: 'Gizmo',
  name: 'Portal',
  portal: {
    targetLevel: null,
    targetX: null,
    targetY: null
  }
};
Blueprints.StairsPortal = {
  inherits: 'Portal',
  name: 'StairsPortal'
};

Blueprints.Hole = {
  inherits: 'Portal',
  name: 'Hole',
  Aspect: {
    character: 'O',
    foreground: 'white',
    screenName: 'hole',
    renderLayer: -99
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

Blueprints.Equipment = {
  inherits: 'Item',
  name: 'Equipment',
  Equippable: {}
};

Blueprints.Wieldable = {
  inherits: 'Equipment',
  name: 'Wieldable',
  Equippable: {
    wieldable: true
  }
};

Blueprints.Weapon = {
  inherits: 'Wieldable',
  name: 'Weapon'
};

Blueprints.dagger = {
  name: 'dagger',
  inherits: 'Weapon',
  Aspect: {
    character: ')',
    foreground: 'gray',
    screenName: 'Dagger'
  },
  Equippable: {
    attackValue: 5
  }
};

Blueprints.sword = {
  name: 'sword',
  inherits: 'Weapon',
  Aspect: {
    character: ')',
    foreground: 'white',
    screenName: 'Sword'
  },
  Equippable: {
    attackValue: 10
  }
};

Blueprints.staff = {
  name: 'staff',
  inherits: 'Weapon',
  Aspect: {
    character: ')',
    foreground: 'yellow',
    screenName: 'Staff'
  },
  Equippable: {
    attackValue: 5,
    defenseValue: 3
  }
};

Blueprints.Wearable = {
  name: 'Wearable',
  inherits: 'Equipment',
  Equippable: {
    wearable: true
  }
};

Blueprints.Armor = {
  name: 'Armor',
  inherits: 'Wearable'
};

Blueprints.tunic = {
  name: 'tunic',
  inherits: 'Armor',
  Aspect: {
    character: '[',
    foreground: 'green',
    screenName: 'Tunic'
  },
  Equippable: {
    defenseValue: 2
  }
};

Blueprints.chainmail = {
  name: 'chainmail',
  inherits: 'armor',
  Aspect: {
    character: '[',
    foreground: 'white',
    screenName: 'Chain Mail'
  },
  Equippable: {
    defenseValue: 4
  }
};

Blueprints.platemail = {
  name: 'platemail',
  inherits: 'armor',
  Aspect: {
    character: '[',
    foreground: 'aliceblue',
    screenName: 'Plate Mail'
  },
  Equippable: {
    defenseValue: 6
  }
};

module.exports = Blueprints;
