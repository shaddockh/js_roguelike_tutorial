var Blueprints = {};
Blueprints.BaseLevelBuilder = {
  name: 'BaseLevelBuilder',
  inherits: '_base',
  LevelBuilder: {},
  ReportStatistics: {}
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
  FovBuilder: {},
  CellularAutomataTerrainBuilder: {
    smoothness: 3
  },
  RandomPositionCreatureBuilder: {
    minCreatureCount: 40,
    maxCreatureCount: 50,
    creatureList: [
      'FungusTemplate', 'NewtTemplate', 'BatTemplate', 'kobold'
    ]
  },
  RandomPositionItemBuilder: {
    minItemCount: 10,
    maxItemCount: 15,
    itemList: [
      'apple', 'rock', 'melon', 'dagger', 'sword', 'staff', 'tunic', 'chainmail', 'platemail'
    ]
  }
};

Blueprints.ZombieBossLevel01 = {
  name: 'ZombieBossLevel01',
  inherits: 'BaseLevelBuilder',
  LevelBuilder: {
    width: 80,
    height: 24,
    levelId: 'ZombieBossLevel01'
  },
  BossLevelTerrainBuilder: {},
  FovBuilder: {},
  RandomPositionCreatureBuilder: {
    minCreatureCount: 1,
    maxCreatureCount: 1,
    creatureList: ['GiantZombie']
  }
};

Blueprints.TownLevel01 = {
  name: 'TownLevel01',
  inherits: 'BaseLevelBuilder',
  LevelBuilder: {
    width: 44,
    height: 13,
    levelId: 'TownLevel01'
  },
  FovBuilder: {},
  Lighting: {},
  MapTerrainBuilder: {
    levelData: [
      '############################################',
      '#.....................F....................#',
      '#..........................................#',
      '#..........................................#',
      '#.....................F....................#',
      '#............<.............................#',
      '#...............................@..........#',
      '#..........................................#',
      '#...................................k......#',
      '#......F...................................#',
      '#..........................................#',
      '#..........................................#',
      '#..........................................#',
      '#..........................................#',
      '#..........................................#',
      '###############################...##########',
      '###############################...##########',
      '#####....######################...##########',
      '#####..|.######################...##########',
      '###############################...##########',
      '###############################.k.##########',
      '###############################...##########',
      '###############################...##########',
      '#..........................................#',
      '#.....W....................................#',
      '#..........................................#',
      '#..........................................#',
      '############################################',
    ],
    //'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1234567890-=!@#$%^&*()_+[]{}|;:",./<>?',
    //92 unique glyphs to handle this
    legend: {
      '#': {
        tile: 'wallTile'
      },
      '|': {
        tile: 'floorTile',
        entity: ['knifeofslicing']
      },
      'k': {
        tile: 'floorTile',
        entity: ['kobold']
      },
      'W': {
        tile: 'floorTile',
        entity: ['witch']
      },
      '.': {
        tile: 'floorTile'
      },
      'F': {
        tile: 'floorTile',
        entity: ['FungusTemplate']
      },
      '<': {
        tile: 'stairsDownTile',
        entity: ['StairsPortal']
      },
      '@': {
        tile: 'floorTile',
        entity: ['StartingPosition', 'BlueLight']
      }
    },
    defaultTile: 'nullTile'
  }
};
/* need to figure out a way to have a map builder assemble multiple levels together */
/*
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
*/
module.exports = Blueprints;
