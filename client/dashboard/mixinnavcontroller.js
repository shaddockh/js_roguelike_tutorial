var $ = require('jquery');
var Dictionary = require('entity-blueprint-manager').Dictionary;

function MixinNavigator(mixinCatalog) {
  this.mixinCatalog = mixinCatalog;
}

MixinNavigator.prototype.render = function ($container) {
  var mixinCatalog = this.mixinCatalog;
  var ul = $('<ul></ul>');
  $container.append(ul);

  var map = new Dictionary({
    ignoreCase: true
  });
  map.add('_base', {
    name: '_base',
    doc: 'Base Mixin',
    children: []
  });

  this.mixinCatalog.getAllMixinNames().forEach(function (name) {
    var mixin = mixinCatalog.getMixin(name);

    var el;
    if (!map.containsKey(mixin.name)) {
      el = {
        name: mixin.name,
        doc: mixin.doc,
        children: []
      };
      map.add(mixin.name, el);
    } else {
      el = map.get(mixin.name);
      el.doc = mixin.doc;
    }
    console.log(name + ':' + (mixin.type || '_base'));
    var parent, parentType, parentTypeEqualsName;
    parentType = mixin.type || '_base';
    if (parentType.toUpperCase() === mixin.name.toUpperCase()) {
      parentTypeEqualsName = true;
      parentType = '_base';
      console.log(parentType + '==' + mixin.name);
    }

    if (!parentTypeEqualsName) {
      if (!map.containsKey(parentType)) {
        parent = {
          name: parentType,
          doc: 'Abstract base mixin type',
          children: []
        };
        map.add(parentType, parent);
        map.get('_base').children.push(parent);
      } else {
        parent = map.get(parentType);
      }
      parent.children.push(el);
    } else {
      map.get('_base').children.push(el);
    }
  });

  this.buildTree(ul, map.get('_base'));

};
MixinNavigator.prototype.buildTree = function ($ul, element) {
  var li = $('<li></li>').text(element.name + ' - ' + (element.doc || 'Undocumented'));
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

module.exports = MixinNavigator;
