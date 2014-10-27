var Screen = function (name) {
  this._screenName = name;
};

Screen.prototype.enter = function () {
  console.log("Entered " + name + " screen.");
};

Screen.prototype.exit = function () {
  console.log("Exited" + name + " screen.");
};
Screen.prototype.render = function (display) {};

Screen.prototype.handleInput = function (inputType, inputData) {};

module.exports = Screen;
