var TargetBasedScreen = require('./targetbasedscreen');
var Singletons = require('../singletons');
var lookScreen = new TargetBasedScreen({
  captionFunction: function (x, y) {
    var level = this._player.getMap();
    // If the tile is explored, we can give a better capton
    if (level.isExplored(x, y)) {
      // If the tile isn't explored, we have to check if we can actually
      // see it before testing if there's an entity or item.
      if (this._visibleCells[x + ',' + y]) {
        var items = level.getItemsAt(x, y);
        // If we have items, we want to render the top most item
        if (items && items.length) {
          var item = items[items.length - 1];
          return String.format('%s - %s (%s)',
            item.getRepresentation(),
            item.describeA(true),
            item.examine());
          // Else check if there's an entity
        } else {
          var entities = level.queryEntitiesAt(x, y, function (entity) {
            return entity.hasMixin('aspect');
          });
          if (entities.length) {
            var entity = entities[0];
            if (entity.hasMixin('Examinable')) {
              return String.format('%s - %s (%s)',
                entity.getRepresentation(),
                entity.describeA(true),
                entity.examine());
            } else {
              return String.format('%s - %s',
                entity.getRepresentation(),
                entity.describeA(true));
            }
          }
        }
      }
      // If there was no entity/item or the tile wasn't visible, then use
      // the tile information.
      return String.format('%s - %s',
        level.getTile(x, y).getRepresentation(),
        level.getTile(x, y).getScreenName());

    } else {
      var nullTile = Singletons.TileCatalog.get('nullTile');
      // If the tile is not explored, show the null tile description.
      return String.format('%s - %s',
        nullTile.getRepresentation(),
        nullTile.getScreenName());
    }
  }
});

module.exports = lookScreen;
