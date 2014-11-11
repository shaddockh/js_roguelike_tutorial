var Blueprints = {};
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
