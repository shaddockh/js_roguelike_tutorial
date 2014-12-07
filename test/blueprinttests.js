'use strict';
/*global suite,test,setup */

var assert = require('chai').assert;
var BlueprintCatalog = require('entity-blueprint-manager').BlueprintCatalog;

suite('Blueprint tests', function () {

  var blueprintLibrary;
  var blueprintIndex = require('../client/assets/blueprints/_blueprintIndex');

  setup(function () {
    blueprintLibrary = new BlueprintCatalog();
    blueprintIndex.forEach(function (blueprintCollection) {
      blueprintLibrary.loadBlueprints(blueprintCollection, null);
    });
  });

  test('Hydrate Blueprints', function () {
    blueprintLibrary.hydrateAllBlueprints();
  });

  test('Check mixin naming convention', function () {

    blueprintLibrary.hydrateAllBlueprints();

    function checkBlueprint(bp) {
      var valid = true;
      for (var mixin in bp) {
        if (typeof (bp[mixin]) === 'object' && typeof (bp[mixin].length) === 'undefined') {
          if (mixin.charAt(0) !== mixin.toUpperCase().charAt(0)) {
            valid = false;
            console.error('Blueprint: "' + bp.name + '" has mixin: "' + mixin + '" that should be capitalized');
          }
        }
      }
      return valid;

    }

    var names = blueprintLibrary.getAllBlueprintNames();
    var failed = false;

    for (var i = 0; i < names.length; i++) {
      if (!checkBlueprint(blueprintLibrary.getBlueprint(names[i]))) {
        failed = true;
      }
    }
    if (failed) {
      throw new Error("Mixin capitalization checks failed");
    }
  });
});
