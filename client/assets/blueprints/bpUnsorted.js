var Blueprints = {};

Blueprints.Decal = {
  inherits: '_base',
  name: 'Decal',
  Position: {},
  Aspect: {
    blocksPath: false,
    renderLayer: -99
  }
};

Blueprints.Bloodstain = {
  inherits: 'Decal',
  name: 'Bloodstain',
  Aspect: {
    character: '.',
    foreground: 'red',
    background: 'black',
    screenName: 'blood',
    displayOutsideFov: true
  }
};

Blueprints.Gizmo = {
  inherits: '_base',
  name: 'Gizmo',
  position: {}
};

Blueprints.Light = {
  inherits: 'gizmo',
  name: 'Light',
  Light: {
    color: [255, 255, 255]
  }
};

Blueprints.BlueLight = {
  inherits: 'Light',
  name: 'BlueLight',
  Light: {
    color: [0, 0, 255]
  }
};
Blueprints.StaticObject = {
  inherits: '_base',
  name: 'StaticObject',
  position: {},
  Aspect: {}
};
Blueprints.StartingPosition = {
  inherits: 'gizmo',
  name: 'StartingPosition'
};

Blueprints.ActivatableGizmo = {
  inherits: 'gizmo',
  name: 'ActivatableGizmo',
  activateable: {}
};

Blueprints.Portal = {
  inherits: 'ActivatableGizmo',
  name: 'Portal',
  Portal: {
    targetLevelId: null,
    targetX: null,
    targetY: null
  }
};
Blueprints.StairsPortal = {
  inherits: 'Portal',
  name: 'StairsPortal'
};

Blueprints.Hole = {
  inherits: 'Portal',
  name: 'Hole',
  Aspect: {
    character: 'O',
    foreground: 'white',
    screenName: 'hole',
    renderLayer: -99
  }
};

module.exports = Blueprints;
