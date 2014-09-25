//TODO: Replace with the Entity Blueprint Manager

var mixinCatalog = require('entity-blueprint-manager').MixinCatalog;
var blueprintCatalog = require('entity-blueprint-manager').BlueprintCatalog;

var Mixins = require('./mixins');
mixinCatalog.loadMixins(Mixins, function (name, loaded, msg) {
  console.log(msg);
});

var Blueprints = require('./blueprints');
blueprintCatalog.loadBlueprints(Blueprints, function (name, loaded, msg) {
  console.log(msg);
});

module.exports.BlueprintCatalog = blueprintCatalog;
