var $ = require('jquery');
var bootstrap = require('bootstrap');

var DashboardController = {};

DashboardController.init = function () {

  var Singletons = require('../assets/singletons');
  //create other tabs here
  var BlueprintNavigator = require('./blueprintnavcontroller');
  var bpNav = new BlueprintNavigator(Singletons.BlueprintCatalog, Singletons.MixinCatalog);
  bpNav.render($('#blueprints'));

  var MixinNavigator = require('./mixinnavcontroller');
  var mxNav = new MixinNavigator(Singletons.MixinCatalog);
  mxNav.render($('#mixins'));
};

module.exports = DashboardController;
