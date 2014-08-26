(function ($) {
  window.$ = $;
  $(document).ready(function () {
    var game = require('./assets/game');
    game.run();
  });
})(require('jquery/dist/jquery.min'));
