var World = function () {
  var ROT = require('rot');
  //TODO: these should be passed in
  //this._scheduler = new ROT.Scheduler.Simple();
  this._scheduler = new ROT.Scheduler.Speed();
  this._engine = new ROT.Engine(this._scheduler);
  this._levels = {};
  this._activeLevelId = null;
};

World.prototype.getEngine = function () {
  return this._engine;
};

World.prototype.getScheduler = function () {
  return this._scheduler;
};

World.prototype.setActiveLevel = function (levelId) {
  if (this._activeLevelId) {
    this.getActiveLevel().deactivate();
  }
  this._activeLevelId = levelId;
  this.getActiveLevel().activate(this.getScheduler());
};

World.prototype.getActiveLevelId = function () {
  return this._activeLevelId;
};

World.prototype.getActiveLevel = function () {
  if (this._activeLevelId) {
    return this.getLevelById(this._activeLevelId);
  }
  return null;
};

World.prototype.getLevelById = function (levelId) {

  return this._levels[levelId];
};

World.prototype.addLevel = function (level) {
  this._levels[level.getLevelId()] = level;
};

module.exports = World;
