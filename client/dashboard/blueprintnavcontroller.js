var $ = require('jquery');
var Dictionary = require('entity-blueprint-manager').Dictionary;

function BlueprintNavigator(blueprintCatalog, mixinCatalog) {
  this.blueprintCatalog = blueprintCatalog;
  this.mixinCatalog = mixinCatalog;
}

BlueprintNavigator.prototype.render = function ($container) {
  var blueprintCatalog = this.blueprintCatalog;
  var ul = $('<ul></ul>');
  $container.append(ul);

  var map = new Dictionary({
    ignoreCase: true
  });
  map.add('_base', {
    name: '_base',
    children: []
  });

  this.blueprintCatalog.getAllBlueprintNames().forEach(function (name) {
    var bp = blueprintCatalog.getOriginalBlueprint(name);

    var el;
    if (!map.containsKey(bp.name)) {
      el = {
        name: bp.name,
        children: []
      };
      map.add(bp.name, el);
    } else {
      el = map.get(bp.name);
    }
    var parent;
    if (!map.containsKey(bp.inherits)) {
      parent = {
        name: bp.inherits,
        children: []
      };
      map.add(bp.inherits, parent);
    } else {
      parent = map.get(bp.inherits);
    }
    parent.children.push(el);
  });

  this.buildTree(ul, map.get('_base'));

};
BlueprintNavigator.prototype.buildTree = function ($ul, element) {
  var li = $('<li></li>').text(element.name);
  $ul.append(li);
  if (element.children.length) {
    element.children.sort(function (a, b) {
      a = a.name.toUpperCase();
      b = b.name.toUpperCase();
      return a < b ? -1 : a > b ? 1 : 0;
    });

    var $ul2 = $('<ul></ul>');
    li.append($ul2);
    for (var i = 0; i < element.children.length; i++) {
      this.buildTree($ul2, element.children[i]);
    }
  }
};

module.exports = BlueprintNavigator;
