var Blueprints = {};
var eventMessage = require('../utils').events;

//////////////////////////////////////
// BASE EQUIPMENT
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

Blueprints.Wearable = {
  name: 'Wearable',
  inherits: 'Equipment',
  Equippable: {
    wearable: true
  }
};

//////////////////////////////////////
// WEAPONS
Blueprints.Weapon = {
  inherits: 'Wieldable',
  name: 'Weapon'
};

Blueprints.Torch = {
  inherits: 'Weapon',
  name: 'torch',
  Aspect: {
    character: 'i',
    foreground: 'yellow',
    screenName: 'Torch'
  },
  Equippable: {
    attackValue: 2,
    //TODO: implement equip slots
    equipSlot: 'shieldHand'
  },
  ExpirableItem: {
    duration: 100,
    expiredName: 'Burnt out torch',
    nonExpiredName: 'Torch (%s turns left)'
  },
  EffectManager: {
    effectName: 'fxTorch',
    targetOwner: true
  },
  EventRouter: {
    onEquip: eventMessage.onActivate,
    onUnequip: eventMessage.onDeactivate
  }
};
Blueprints.fxBase = {
  name: 'fxBase',
  inherits: '_base',
  Position: {},
  Effect: {}
};

Blueprints.fxTorch = {
  name: 'fxTorch',
  inherits: 'fxBase',
  LightEffect: {}
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

Blueprints.knifeofslicing = {
  name: 'knifeofslicing',
  inherits: 'Weapon',
  Aspect: {
    character: '|',
    foreground: 'red',
    screenName: 'Knife of Slicing'
  },
  Equippable: {
    attackValue: 7
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

//////////////////////////////////////
// ARMOR
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
