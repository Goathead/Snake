/* global Snk */
(function () {
  if (typeof Snk === "undefined") {
    window.Snk = {};
  }

  var View = Snk.View = function ($el) {
    this.$el = $el;
    this.board = new Snk.Board(24);

    this.interval = window.setInterval(
      this.step.bind(this),
      View.MOVE_TIME
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.MOVE_TIME = 120;

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose!");
      window.clearInterval(this.interval);
    }
  };

  View.prototype.handleKeyEvent = function (e) {
    if (View.KEYS[e.keyCode]) {
      this.board.snake.turn(View.KEYS[e.keyCode]);
    }
  };

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };


})();
