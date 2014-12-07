var Blueprints = Blueprints || {};

Blueprints.fungusWorld = {
  name: 'fungusWorld',
  inherits: '_base',
  Levels: [{
      inherits: 'FungusLevelBuilder',
      LevelBuilder: {
        levelId: 'fungus01',
        levelDifficulty: 1
      }
    }, {
      inherits: 'FungusLevelBuilder',
      LevelBuilder: {
        levelId: 'fungus02',
        levelDifficulty: 2
      }
    }, {
      inherits: 'FungusLevelBuilder',
      LevelBuilder: {
        levelId: 'fungus03',
        levelDifficulty: 3
      }
    },
    'zombieBossLevel01',
    'townLevel01'
  ],
  Connections: [{
    strategy: 'CaveToCaveRegionConnector',
    from: 'fungus01',
    to: 'fungus02',
    biDirectional: true,
    leftPortal: 'stairsDown',
    rightPortal: 'stairsUp'
  }, {
    strategy: 'CaveToCaveRegionConnector',
    from: 'fungus02',
    to: 'fungus03',
    biDirectional: true,
    leftPortal: 'stairsDown',
    rightPortal: 'stairsUp'
  }, {
    strategy: 'CaveToBossRegionConnection',
    from: 'fungus03',
    to: 'zombieBossLevel01',
    biDirectional: false,
    leftPortal: 'hole'
  }],
  entryPoint: 'townLevel01'
    //entryPoint: 'fungus01'
};

module.exports = Blueprints;
