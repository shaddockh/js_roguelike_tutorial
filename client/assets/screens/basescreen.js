var Screen = function (name) {
  var impl = {
    enter: function () {
      console.log("Entered " + name + " screen.");
    },
    exit: function () {
      console.log("Exited" + name + " screen.");
    },
    render: function (display) {},
    handleInput: function (inputType, inputData) {}
  };

  return impl;
};
// Define our winning screen
module.exports = Screen;
