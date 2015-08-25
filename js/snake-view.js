/* global Snk */
(function () {
  if (typeof Snk === "undefined") {
    window.Snk = {};
  }

  var View = Snk.View = function ($el) {
    this.$el = $el;
    this.board = new Snk.Board(24);
    this.setupGrid();
    this.interval = window.setInterval(
      this.step.bind(this),
      View.MOVE_TIME
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };


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

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.size; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.size; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }
    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.render = function () {
    // debugger;
    // this.$el.html(this.board.render());
    this.renderSquares(this.board.snake.segments, "snake");
  };

  View.prototype.renderSquares = function (coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord) {
      var flatCoord = (coord.r * this.board.size) + coord.c;
      this.$li.eq(flatCoord).addClass(className);
    });
  };


  View.MOVE_TIME = 120;
  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };


})();
