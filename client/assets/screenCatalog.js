var Dictionary = require('entity-blueprint-manager').Dictionary;

var ScreenCatalog = (function () {
  var catalog = new Dictionary({
    ignoreCase: true
  });

  function addScreen(name, screen) {
    catalog.add(name, screen);
  }

  function getScreen(name) {
    return catalog.getItem(name);
  }
  return {
    addScreen: addScreen,
    getScreen: getScreen
  };
})();

module.exports = ScreenCatalog;
