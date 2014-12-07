var Blueprints = Blueprints || {};

Blueprints.Blockable = {
  inherits: '_base',
  name: 'Blockable',
  Position: {},
  Aspect: {
    blocksPath: true,
    displayOutsideFov: true
  }
};

Blueprints.Sconce = {
  inherits: 'Blockable',
  name: 'Sconce',
  Aspect: {
    character: '^',
    screenName: 'Sconce',
    foreground: 'yellow'
  },
  Light: {
    color: 'yellow'
  }
};

module.exports = Blueprints;
