var Blueprints = Blueprints || {};

Blueprints.tile = {
  name: 'tile',
  inherits: '_base',
  tile: {
    blocksLight: true
  },
  aspect: {}
};
Blueprints.nullTile = {
  name: 'nullTile',
  inherits: 'tile',
  aspect: {
    screenName: 'Unknown'
  }
};
Blueprints.walkableTile = {
  name: 'walkableTile',
  inherits: 'tile',
  tile: {
    isWalkable: true,
    blocksLight: false
  }
};
Blueprints.floorTile = {
  name: 'floorTile',
  inherits: 'walkableTile',
  aspect: {
    character: '.',
    foreground: 'silver',
    screenName: 'floor'

  }
};
Blueprints.stairsUpTile = {
  name: 'stairsUpTile',
  inherits: 'walkableTile',
  aspect: {
    character: '<',
    foreground: 'white',
    screenName: 'stairs up'
  }
};
Blueprints.stairsDownTile = {
  name: 'stairsDownTile',
  inherits: 'walkableTile',
  aspect: {
    character: '>',
    foreground: 'white',
    screenName: 'stairs up'
  }
};
Blueprints.wallTile = {
  name: 'wallTile',
  inherits: 'tile',
  tile: {
    isDiggable: true,
    reflectivity: 0.3
  },
  aspect: {
    character: '#',
    foreground: 'silver',
    screenName: 'wall'
  }
};

Blueprints.holeTile = {
  inherits: 'walkableTile',
  aspect: {
    character: 'O',
    foreground: 'white',
    screenName: 'hole'
  }
};

Blueprints.waterTile = {
  inherits: 'tile',
  aspect: {
    character: '~',
    foreground: 'blue',
    obscuredForeground: 'darkblue',
    screenName: 'water'
  },
  tile: {
    isWalkable: false,
    blocksLight: false
  }
};

module.exports = Blueprints;
