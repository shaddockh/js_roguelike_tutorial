var ItemMixins = {};

// Edible mixins
ItemMixins.Edible = {
  name: 'Edible',
  doc: 'Edible item',
  init: function (blueprint) {
    // Number of points to add to hunger
    this._foodValue = blueprint.foodValue || 5;
    // Number of times the item can be consumed
    this._maxConsumptions = blueprint.consumptions || 1;
    this._remainingConsumptions = this._maxConsumptions;
  },
  eat: function (entity) {
    if (entity.hasMixin('FoodConsumer')) {
      if (this.hasRemainingConsumptions()) {
        entity.modifyFullnessBy(this._foodValue);
        this._remainingConsumptions--;
      }
    }
  },
  hasRemainingConsumptions: function () {
    return this._remainingConsumptions > 0;
  },
  //TODO; this won't work
  describe: function () {
    if (this._maxConsumptions !== this._remainingConsumptions) {
      //return 'partly eaten ' + Game.Item.prototype.describe.call(this);
      return 'partly eaten ' + this.getScreenName();
    } else {
      return this.getScreenName();
    }
  }
};

ItemMixins.Equippable = {
  name: 'Equippable',
  doc: 'Allows an item to be equipped',
  init: function (blueprint) {
    this._attackValue = blueprint.attackValue || 0;
    this._defenseValue = blueprint.defenseValue || 0;
    this._wieldable = blueprint.wieldable || false;
    this._wearable = blueprint.wearable || false;
  },
  getAttackValue: function () {
    return this._attackValue;
  },
  getDefenseValue: function () {
    return this._defenseValue;
  },
  isWieldable: function () {
    return this._wieldable;
  },
  isWearable: function () {
    return this._wearable;
  }
};

module.exports = ItemMixins;
