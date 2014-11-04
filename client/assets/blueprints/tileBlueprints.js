var Tiles = {

  tile: {
    name: 'tile',
    inherits: '_base',
    tile: {
      blocksLight: true
    },
    aspect: {}
  },
  nullTile: {
    name: 'nullTile',
    inherits: 'tile',
    aspect: {
      screenName: 'Unknown'
    }
  },
  walkableTile: {
    name: 'walkableTile',
    inherits: 'tile',
    tile: {
      isWalkable: true,
      blocksLight: false
    }
  },
  floorTile: {
    name: 'floorTile',
    inherits: 'walkableTile',
    aspect: {
      character: '.',
      foreground: 'silver',
      screenName: 'floor'

    }
  },
  stairsUpTile: {
    name: 'stairsUpTile',
    inherits: 'walkableTile',
    aspect: {
      character: '<',
      foreground: 'white',
      screenName: 'stairs up'
    }
  },
  stairsDownTile: {
    name: 'stairsDownTile',
    inherits: 'walkableTile',
    aspect: {
      character: '>',
      foreground: 'white',
      screenName: 'stairs up'
    }
  },
  wallTile: {
    name: 'wallTile',
    inherits: 'tile',
    tile: {
      isDiggable: true
    },
    aspect: {
      character: '#',
      foreground: 'silver',
      screenName: 'wall'
    }
  }
};

Tiles.holeTile = {
  inherits: 'walkableTile',
  aspect: {
    character: 'O',
    foreground: 'white',
    screenName: 'hole'
  }
};

Tiles.waterTile = {
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

module.exports = Tiles;
