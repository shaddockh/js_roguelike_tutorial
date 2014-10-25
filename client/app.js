(function () {
  var $ = require('jquery');
  //window.$ = $;
  $(document).ready(function () {
    var Game = require('./assets/game');
    var dashboardController = require('./dashboard/dashboardcontroller');

    var bootstrap = require('bootstrap');
    if (Game.canRun()) {
      Game.init($('#game'));
      dashboardController.init();
    }
    $('#tabStrip a:first').tab('show');
  });
})();
