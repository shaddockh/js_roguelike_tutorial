var entityBlueprintManager = require('entity-blueprint-manager');
var MixinCatalog = new entityBlueprintManager.MixinCatalog();
var BlueprintCatalog = new entityBlueprintManager.BlueprintCatalog();
var TileCatalog = require('./tileCatalog');
var World = require('./world');
var ScreenCatalog = require('./screenCatalog');
var RNG = require('./rng');

function initialize() {
  var blueprintIndex = require('./blueprints/_blueprintIndex');
  var mixinIndex = require('./mixins/_mixinIndex');
  var WorldBuilder = require('./worldbuilder');
  var Entity = require('./entity');

  //Load all the mixins
  mixinIndex.forEach(function (mixinCollection) {
    MixinCatalog.loadMixins(mixinCollection, function (name, loaded, msg) {
      console.log(msg);
    });
  });

  //Load all the blueprints
  blueprintIndex.forEach(function (blueprintCollection) {
    BlueprintCatalog.loadBlueprints(blueprintCollection, function (name, loaded, msg) {
      console.log(msg);
    });
  });
  BlueprintCatalog.hydrateAllBlueprints();

  //Build the tile cache
  BlueprintCatalog.getBlueprintsDescendingFrom('tile', true).forEach(function (obj) {
    TileCatalog.add(obj.name, new Entity(obj.name));
  });

  module.exports.Player = new Entity('PlayerTemplate');
  module.exports.World = new World();

  //set up the screens
  var screens = require('./screens/_screenIndex');
  for (var name in screens) {
    ScreenCatalog.addScreen(name, screens[name]);
  }
  //var includeFolder = require('include-folder'),
  //folder = includeFolder('./client/assets');
  //console.log(folder);
}

module.exports.BlueprintCatalog = BlueprintCatalog;
module.exports.TileCatalog = TileCatalog;
module.exports.MixinCatalog = MixinCatalog;
module.exports.ScreenCatalog = ScreenCatalog;
module.exports.World = null;
module.exports.Player = null;
module.exports.RNG = RNG;
module.exports.initialize = initialize;
