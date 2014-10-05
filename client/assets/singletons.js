var MixinCatalog = require('entity-blueprint-manager').MixinCatalog;
var BlueprintCatalog = require('entity-blueprint-manager').BlueprintCatalog;
var TileCatalog = require('./tileCatalog');
var World = require('./world');

function initialize() {
  var Mixins = require('./mixins');
  var Tiles = require('./tiles');
  var Blueprints = require('./blueprints');
  var WorldBuilder = require('./worldbuilder');

  var Entity = require('./entity');

  //Load all the mixins
  // World Builder Mixins
  MixinCatalog.loadMixins(WorldBuilder.BuilderMixins, function (name, loaded, msg) {
    console.log(msg);
  });
  // Entity Mixins
  MixinCatalog.loadMixins(Mixins, function (name, loaded, msg) {
    console.log(msg);
  });

  //Load all the tiles
  BlueprintCatalog.loadBlueprints(Tiles, function (name, loaded, msg) {
    console.log(msg);
  });

  //Load all the builder blueprints
  BlueprintCatalog.loadBlueprints(WorldBuilder.BuilderBlueprints, function (name, loaded, msg) {
    console.log(msg);
  });

  //Load all the entity blueprints
  BlueprintCatalog.loadBlueprints(Blueprints, function (name, loaded, msg) {
    console.log(msg);
  });

  //BlueprintCatalog.hydrateAllBlueprints();

  //Build the tile cache
  BlueprintCatalog.getBlueprintsDescendingFrom('tile', true).forEach(function (obj) {
    TileCatalog.add(obj.name, new Entity(obj.name));
  });

  module.exports.Player = new Entity('PlayerTemplate');
  module.exports.World = new World();
}

module.exports.BlueprintCatalog = BlueprintCatalog;
module.exports.TileCatalog = TileCatalog;
module.exports.MixinCatalog = MixinCatalog;
module.exports.initialize = initialize;
module.exports.World = null;
module.exports.Player = null;
