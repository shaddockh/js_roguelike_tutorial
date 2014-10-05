var Dictionary = require('entity-blueprint-manager').Dictionary;

var TileCatalog = (function () {
  var catalog = new Dictionary({
    ignoreCase: true
  });

  return catalog;
})();
module.exports = TileCatalog;
