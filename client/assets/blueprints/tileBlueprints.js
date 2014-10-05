var Tiles = {

  tile: {
    name: 'tile',
    inherits: '_base',
    tile: {},
    aspect: {}
  },
  nullTile: {
    name: 'nullTile',
    inherits: 'tile'
  },
  walkableTile: {
    name: 'walkableTile',
    inherits: 'tile',
    tile: {
      isWalkable: true
    }
  },
  floorTile: {
    name: 'floorTile',
    inherits: 'walkableTile',
    aspect: {
      character: '.',
      foreground: 'gray',
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
      foreground: 'gray',
      screenName: 'wall'
    }
  }
};

module.exports = Tiles;
