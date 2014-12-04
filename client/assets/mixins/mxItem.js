var ItemMixins = {};

var utils = require('../utils'),
  eventMessage = utils.events;
var vsprintf = require('sprintf-js').vsprintf,
  _ = require('lodash'),
  Entity = require('../entity');

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
  listeners: {
    onLoaded: function () {
      if (this._maxConsumptions !== this._remainingConsumptions) {
        this.setScreenName('partly eaten ' + this.getScreenName());
        this._edibleUpdatedScreenName = true;
      }
    },
    details: function () {
      return [{
        key: 'food',
        value: this._foodValue
      }];
    },
    onRequestVerbs: function () {
      return [{
        verb: 'Eat',
        action: this.eat,
        owner: this
      }];
    }

  },
  eat: function (entity) {
    if (entity.hasMixin('FoodConsumer')) {
      if (this.hasRemainingConsumptions()) {
        entity.modifyFullnessBy(this._foodValue);
        this._remainingConsumptions--;
        if (this._maxConsumptions !== this._remainingConsumptions && !this._edibleUpdatedScreenName) {
          this.setScreenName('partly eaten ' + this.getScreenName());
          this._edibleUpdatedScreenName = true;
        }
      }
    }
  },
  hasRemainingConsumptions: function () {
    return this._remainingConsumptions > 0;
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
    this._equipSlot = blueprint.equipSlot || 'any';
  },
  listeners: {
    details: function () {
      var results = [];
      if (this._wieldable) {
        results.push({
          key: 'attack',
          value: this.getAttackValue()
        });
      }
      if (this._wearable) {
        results.push({
          key: 'defense',
          value: this.getDefenseValue()
        });
      }
      return results;
    },
    onRequestVerbs: function (owner) {
      var results = [];
      if (owner.hasMixin('EquipSlots')) {
        if (owner.isEquipped(this)) {
          if (owner.canUnequip(this)) {
            results.push({
              verb: 'Unequip',
              action: this.unequip,
              owner: this
            });
          }
        } else {
          if (owner.canEquip(this)) {
            results.push({
              verb: 'Equip',
              action: this.equip,
              owner: this
            });
          }
        }
      }
      return results;
    }
  },
  equip: function (owner) {
    if (owner.hasMixin('EquipSlots') && owner.canEquip(this)) {
      owner.equip(this);
    }
  },
  unequip: function (owner) {
    if (owner.hasMixin('EquipSlots') && owner.canUnequip(this)) {
      owner.unequip(this);
    }
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

ItemMixins.ExpirableItem = {

  name: 'ExpirableItem',
  doc: 'Will expire after so many turns',
  init: function (blueprint) {
    this._expirationDuration = blueprint.expirationDuration || 100;
    this._expiredName = blueprint.expiredName || 'Expired Item';
    this._nonExpiredName = blueprint.nonExpiredName || '%s turns left';
    this._expirableItemActive = false;
  },
  expireItem: function () {
    this.setScreenName(this._expiredName);
  },
  listeners: {
    onLoaded: function () {
      this.setScreenName(vsprintf(this._nonExpiredName, [this._expirationDuration]));
    },
    onActivate: function () {
      this._expirableItemActive = true;
      console.log('activated ' + this.getScreenName());
    },
    onDeactivate: function () {
      this._expirableItemActive = false;
      console.log('deactivated ' + this.getScreenName());
    },
    onGameTurn: function () {
      if (this._expirableItemActive) {
        this._expirationDuration -= 1;
        if (this._expirationDuration === 0) {
          this.expireItem();
          this.raiseEvent(eventMessage.onDeactivate);
        } else {
          this.setScreenName(vsprintf(this._nonExpiredName, [this._expirationDuration]));
        }
      }
    }
  }
};

/**
 * The event router allows for re-routing one event to another event
 *  usage:
 *   EventRouter: {
 *       eventToListenFor: eventToRaise,
 *       eventToListenFor, eventToRaise
 *   }
 */
ItemMixins.EventRouter = {
  name: 'EventRouter',
  doc: 'Reroute one event to another event',
  init: function (blueprint) {

    var entity = this;

    function createRaiseEvent(targetEvent) {
      return function () {
        entity.raiseEvent(targetEvent);
      };
    }

    blueprint = blueprint || {};
    for (var eventName in blueprint) {
      this.addListener(eventName, createRaiseEvent(blueprint[eventName]));
    }
  }
};

ItemMixins.Effect = {
  name: 'Effect',
  doc: 'Base mixin for handling an effect',
  init: function (blueprint) {
    blueprint = blueprint || {};
    this._effectDuration = blueprint.duration || 1;
  },
  getEffectDuration: function () {
    return this._effectDuration;
  },
  setEffectDuration: function (value) {
    this._effectDuration = value;
  },
  updateEffect: function () {
    this.raiseEvent(eventMessage.onUpdateEffect);
  },
  startEffect: function () {
    this.raiseEvent(eventMessage.onStartEffect);
  },
  endEffect: function () {
    this.raiseEvent(eventMessage.onEndEffect);
  },
  isDone: function () {
    return this._isDone;
  }
};
ItemMixins.Follower = {

  name: 'Follower',
  doc: 'Will cause this entity to follow another entity',
  init: function (blueprint) {

  },
  followEntity: function (entity) {
    this._followedEntity = entity;
  },
  stopFollowingEntity: function (entity) {

  },
  listener: {
    onAct: function () {
      var followed = this._followedEntity;
      if (followed) {
        //TODO: verify that we are removed from prior map
        this.setPosition(followed.getX(), followed.getY());
        this.setMap(followed.getMap());
      }
    }
  }
};

ItemMixins.EffectManager = {
  name: 'EffectManager',
  doc: 'Handles applying an effect to an entity and tracking effects applied',
  init: function (blueprint) {
    blueprint = blueprint || {};
    this._effectName = blueprint.effectName || null;
    this._effects = [];
  },
  applyEffect: function (targetEntity) {
    //TODO: apply effect should instantiate a new version of effect and apply it to entity
    var effect = new Entity(this._effectName);
    effect.startEffect.call(effect, this, targetEntity);
    this.addEffect(effect);
  },
  addEffect: function (effect) {
    this._effects.push(effect);
  },
  updateEffects: function () {
    var effectsToRemove = [];
    _.forEach(this._effects, function (effect) {
      effect.updateEffect();
      if (effect.isDone()) {
        effect.end();
        effectsToRemove.push(effect);
      }
    });
    this.removeAllEffects(effectsToRemove);
  },
  removeAllEffects: function (effectsToRemove) {
    //todo: if effects is blank, remove entire array otherwise remove just provided
    var effects = this._effects;
    if (!effects || effects.length === 0) {
      effects = []; //TODO: find better way to clear an array
    } else {
      effects = _.remove(this._effects, function (el) {

      });
    }
  }
};

module.exports = ItemMixins;
