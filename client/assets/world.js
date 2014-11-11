var Dictionary = require('entity-blueprint-manager').Dictionary;
var World = function () {
  var ROT = require('rot');
  //TODO: these should be passed in
  //this._scheduler = new ROT.Scheduler.Simple();
  this._scheduler = new ROT.Scheduler.Speed();
  this._engine = new ROT.Engine(this._scheduler);
  this._levels = new Dictionary({
    ignoreCase: true
  });
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
  var level = this.getLevelById(levelId);
  this._activeLevelId = level.getLevelId();
  level.activate(this.getScheduler());
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

  return this._levels.get(levelId);
};

World.prototype.addLevel = function (level) {
  this._levels.add(level.getLevelId(), level);
};

module.exports = World;
