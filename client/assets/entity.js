var Singletons = require('./singletons');
var Dictionary = require('entity-blueprint-manager').Dictionary;

var Entity = function (blueprint, blueprintOverrides) {
  this._loadBlueprint(blueprint, blueprintOverrides);
};

var noCopyList = {
  init: true,
  name: true,
  doc: true,
  type: true,
  obsolete: true
};

Entity.prototype._loadBlueprint = function (blueprint, blueprintOverrides) {
  //if the blueprint is coming in as just a name, then we need to look it up in
  //the blueprint catalog to get the actual blueprint
  if (typeof (blueprint) === 'string') {
    blueprint = Singletons.BlueprintCatalog.getBlueprint(blueprint, blueprintOverrides);
  }

  blueprint = blueprint || {};
  // Instantiate any properties from the passed object
  this._name = blueprint.name || '';

  // Create an object which will keep track what mixins we have
  // attached to this entity based on the name property
  this._attachedMixins = new Dictionary({
    ignoreCase: true
  });

  for (var componentKey in blueprint) {
    if (typeof (blueprint[componentKey]) === 'object') {
      //we have a component reference, grab it from the library and instantiate a mixin instance
      this.attachMixin(componentKey, blueprint[componentKey]);
    }
  }
};

Entity.prototype.attachMixin = function (mixin, blueprint) {

  var catalog = Singletons.MixinCatalog;

  if (typeof (mixin) === 'string') {
    mixin = catalog.getMixin(mixin);
  }

  if (mixin.obsolete) {
    console.error('adding obsolete mixin: ' + mixin.name + ' to ' + this._name);
  }
  //Let's look for Mixin Inheritance
  var parentMixin = null;
  if (mixin.type && mixin.type !== mixin.name && catalog.hasMixin(mixin.type)) {
    parentMixin = catalog.getMixin(mixin.type);
    this.attachMixin(parentMixin, blueprint);
  }

  // Copy over all properties from each mixin as long
  // as it's not the name or the init property. We
  // also make sure not to override a property that
  // already exists on the entity.
  for (var key in mixin) {
    if (mixin.hasOwnProperty(key)) {
      //Don't copy over any private properties or 'nocopy' items
      if (!noCopyList[key] && key[0] !== '_') {
        //TODO: check against parent mixin and override as appropriate
        if (this.hasOwnProperty(key) && (!parentMixin || !parentMixin.hasOwnProperty(key))) {
          console.error(this.getName() + ': Conflict attaching mixin property: ' + mixin.name + '.' + key + ' - property/method already exists.', this._attachedMixins);
        } else {
          this[key] = mixin[key];
        }
      }
    }
  }

  //add the name of this mixin to our attached mixins
  if (!this._attachedMixins.containsKey(mixin.name)) {
    this._attachedMixins.add(mixin.name);
  }
  //if a group name is present, add it
  if (mixin.type && !this._attachedMixins.containsKey(mixin.type)) {
    this._attachedMixins.add(mixin.type);
  }

  // Finally call the init function if there is one
  if (mixin.init) {
    mixin.init.call(this, blueprint, mixin, Singletons.MixinCatalog);
  }
};

Entity.prototype.getName = function () {
  return this._name;
};

Entity.prototype.hasMixin = function (obj) {
  // Allow passing the mixin itself or the name as a string
  if (typeof obj === 'object') {
    return this._attachedMixins.containsKey(obj.name);
  } else {
    return this._attachedMixins.containsKey(obj);
  }
};

module.exports = Entity;
