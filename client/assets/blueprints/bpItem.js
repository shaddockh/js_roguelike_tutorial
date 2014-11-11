var Blueprints = Blueprints || {};
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
