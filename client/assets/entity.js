var Glyph = require('./glyph');

var Entity = function (properties) {
  properties = properties || {};
  // Call the glyph's construtor with our set of properties
  Glyph.call(this, properties);
  // Instantiate any properties from the passed object
  this._name = properties.name || '';
  this._x = properties.x || 0;
  this._y = properties.y || 0;
  // Create an object which will keep track what mixins we have
  // attached to this entity based on the name property
  this._attachedMixins = {};
  // Setup the object's mixins
  var mixins = properties.mixins || [];
  for (var i = 0; i < mixins.length; i++) {
    // Copy over all properties from each mixin as long
    // as it's not the name or the init property. We
    // also make sure not to override a property that
    // already exists on the entity.
    for (var key in mixins[i]) {
      if (key !== 'init' && key !== 'name' && !this.hasOwnProperty(key)) {
        this[key] = mixins[i][key];
      }
    }
    // Add the name of this mixin to our attached mixins
    this._attachedMixins[mixins[i].name] = true;
    // Finally call the init function if there is one
    if (mixins[i].init) {
      mixins[i].init.call(this, properties);
    }
  }
};

// Make entities inherit all the functionality from glyphs
Entity.extend(Glyph);

Entity.prototype.setName = function (name) {
  this._name = name;
};

Entity.prototype.setX = function (x) {
  this._x = x;
};

Entity.prototype.setY = function (y) {
  this._y = y;
};

Entity.prototype.getName = function () {
  return this._name;
};

Entity.prototype.getX = function () {
  return this._x;
};

Entity.prototype.getY = function () {
  return this._y;
};

Entity.prototype.hasMixin = function (obj) {
  // Allow passing the mixin itself or the name as a string
  if (typeof obj === 'object') {
    return this._attachedMixins[obj.name];
  } else {
    return this._attachedMixins[name];
  }
};

module.exports = Entity;
