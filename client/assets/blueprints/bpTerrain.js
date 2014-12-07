var Blueprints = Blueprints || {};

Blueprints.tile = {
  name: 'tile',
  inherits: '_base',
  Tile: {
    blocksLight: true
  },
  Aspect: {}
};
Blueprints.nullTile = {
  name: 'nullTile',
  inherits: 'tile',
  Aspect: {
    screenName: 'Unknown'
  }
};
Blueprints.walkableTile = {
  name: 'walkableTile',
  inherits: 'tile',
  Tile: {
    isWalkable: true,
    blocksLight: false
  }
};
Blueprints.floorTile = {
  name: 'floorTile',
  inherits: 'walkableTile',
  Aspect: {
    character: '.',
    foreground: 'silver',
    screenName: 'floor'

  }
};
Blueprints.stairsUpTile = {
  name: 'stairsUpTile',
  inherits: 'walkableTile',
  Aspect: {
    character: '<',
    foreground: 'white',
    screenName: 'stairs up'
  }
};
Blueprints.stairsDownTile = {
  name: 'stairsDownTile',
  inherits: 'walkableTile',
  Aspect: {
    character: '>',
    foreground: 'white',
    screenName: 'stairs up'
  }
};
Blueprints.wallTile = {
  name: 'wallTile',
  inherits: 'tile',
  Tile: {
    isDiggable: true,
    reflectivity: 0.3
  },
  Aspect: {
    character: '#',
    foreground: 'silver',
    screenName: 'wall'
  }
};

Blueprints.holeTile = {
  inherits: 'walkableTile',
  Aspect: {
    character: 'O',
    foreground: 'white',
    screenName: 'hole'
  }
};

Blueprints.waterTile = {
  inherits: 'tile',
  Aspect: {
    character: '~',
    foreground: 'blue',
    obscuredForeground: 'darkblue',
    screenName: 'water'
  },
  Tile: {
    isWalkable: false,
    blocksLight: false
  }
};

module.exports = Blueprints;
