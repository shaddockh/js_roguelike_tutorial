var Blueprints = {};
Blueprints.BaseLevelBuilder = {
  name: 'BaseLevelBuilder',
  inherits: '_base',
  LevelBuilder: {}
};

Blueprints.FungusLevelBuilder = {
  name: 'FungusLevelBuilder',
  inherits: 'BaseLevelBuilder',
  Debug: {},
  RegionBuilder: {},
  LevelBuilder: {
    width: 100,
    height: 100
  },
  CellularAutomataTerrainBuilder: {
    smoothness: 3
  },
  RandomPositionCreatureBuilder: {
    minCreatureCount: 40,
    maxCreatureCount: 50,
    creatureList: [
      'FungusTemplate'
    ]
  }
};

/* need to figure out a way to have a map builder assemble multiple levels together */
Blueprints.MapBuilder = {
  name: 'MapBuilder',
  inherits: 'BaseMapBuilder',
  LevelHandler: {

    LevelBlocks: [{
      name: 'FungusDungeon',
      builder: 'FungusLevelBuilder',
      levelMin: '1',
      levelMax: '5',
      connected: true,
      dungeon: true
    }, {
      name: 'WolfDungeon',
      builder: 'WolfDungeonLevelBuilder',
      levelMin: 6,
      levelMax: 8,
      dungeon: true
    }],
    LevelConnections: [{
        from: 'Fungus01',
        to: 'Fungus02',
        minConnections: '1',
        maxConnections: '5'
      },
      ['Fungus01->fungus02',
        'Fungus02->fungus03'
      ]
    ]
  }

};

module.exports = Blueprints;
