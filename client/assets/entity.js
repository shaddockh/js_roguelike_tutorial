var Glyph = require('./glyph');
var mixinCatalog = require('entity-blueprint-manager').MixinCatalog;

var Entity = function (blueprint) {
  blueprint = blueprint || {};
  // Call the glyph's construtor with our set of properties
  Glyph.call(this, blueprint);
  // Instantiate any properties from the passed object
  this._name = blueprint.name || '';
  // Create an object which will keep track what mixins we have
  // attached to this entity based on the name property
  this._attachedMixins = {};

  for (var componentKey in blueprint) {
    if (typeof (blueprint[componentKey]) === 'object') {
      //we have a component reference, grab it from the library and instantiate a mixin instance
      var mixin = mixinCatalog.getMixin(componentKey);

      if (mixin.obsolete) {
        console.error('adding obsolete mixin: ' + componentKey + ' to ' + this._name);
      }
      this.attachMixin(mixin, blueprint[componentKey]);
    }
  }
};

// Make entities inherit all the functionality from glyphs
Entity.extend(Glyph);

Entity.prototype.attachMixin = function (mixin, blueprint) {

  //add the name of this mixin to our attached mixins
  this._attachedMixins[mixin.name.toUpperCase()] = true;
  //if a group name is present, add it
  if (mixin.type) {
    this._attachedMixins[mixin.type.toUpperCase()] = true;
  }
  // Copy over all properties from each mixin as long
  // as it's not the name or the init property. We
  // also make sure not to override a property that
  // already exists on the entity.
  for (var key in mixin) {
    if (key !== 'init' && key !== 'name') {
      if (this.hasOwnProperty(key)) {
        console.error('Conflict attaching mixin property: ' + key + ' from mixin: ' + mixin.name + ' already exists!');
      } else {
        this[key] = mixin[key];
      }
    }
  }

  // Finally call the init function if there is one
  if (mixin.init) {
    mixin.init.call(this, blueprint);
  }
};

Entity.prototype.setName = function (name) {
  this._name = name;
};

Entity.prototype.getName = function () {
  return this._name;
};

Entity.prototype.hasMixin = function (obj) {
  // Allow passing the mixin itself or the name as a string
  if (typeof obj === 'object') {
    return this._attachedMixins[obj.name.toUpperCase()];
  } else {
    return this._attachedMixins[obj.toUpperCase()];
  }
};

module.exports = Entity;
