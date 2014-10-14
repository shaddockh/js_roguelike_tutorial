(function ($) {
  window.$ = $;
  $(document).ready(function () {
    var Game = require('./assets/game');

    if (Game.canRun()) {
      Game.init();
      // Add the container to our HTML page
      document.body.appendChild(Game.getDisplay().getContainer());
      // Load the start screen

      Game.switchScreen(require('./assets/singletons').ScreenCatalog.getScreen('StartScreen'));
    }
  });
})(require('jquery/dist/jquery.min'));
