var ItemListScreen = require('./itemListScreen');
var inventoryScreen = new ItemListScreen({
  caption: 'Inventory',
  canSelect: false,
  parentScreen: 'PlayScreen'
});

module.exports = inventoryScreen;
