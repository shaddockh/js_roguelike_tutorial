var ROT = require('rot');

var LightingModel = function (lighting) {
  this._lighting = lighting;
  this._dirty = true;
};

LightingModel.prototype.setLighting = function (lighting) {
  this._lighting = lighting;
  this._dirty = true;
};

LightingModel.prototype.setAmbientLight = function (l) {
  this._ambientLight = l;
  this._dirty = true;
};

LightingModel.prototype.getAmbientLight = function () {
  return this._ambientLight;
};

LightingModel.prototype.setLight = function (x, y, color) {
  console.log('setting light: ', x, y, color);
  this._lighting.setLight(x, y, color);
  this._dirty = true;
};

LightingModel.prototype.compute = function () {
  if (this._dirty) {
    var lightData = {};
    var lightingCallback = function (x, y, color) {
      lightData[x + "," + y] = color;
    };
    this._lighting.compute(lightingCallback);
    this._lightData = lightData;
    console.log(lightData);
    this._dirty = false;
  }
};

LightingModel.prototype.getColorAtCoord = function (x, y) {
  this.compute();
  /* all cells are lit by ambient light; some are also lit by light sources */
  var ambientLight = this.getAmbientLight(),
    lightData = this._lightData,
    id = x + ',' + y;

  //var tile = this.getLevel().getTile(x, y);
  //var baseColor = (tile.getBlocksLight() ? [100, 100, 100] : [50, 50, 50]);
  var light = ambientLight;
  if (id in lightData) { /* add light from our computation */
    light = ROT.Color.add(light, lightData[id]);
  }
  return light;
};

module.exports = LightingModel;
