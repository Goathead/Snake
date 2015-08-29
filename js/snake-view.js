/* global Snk */
(function () {
  if (typeof Snk === "undefined") {
    window.Snk = {};
  }

  var View = Snk.View = function ($el) {
    this.$el = $el;
    this.board = new Snk.Board(20);
    this.hiScore = 0;
    this.speed = 110;
    this.inPlay = false;
    this.paused = false;

    var that = this;
    $(window).on("keydown", this.handleKeyEvent.bind(this));
    $(window).ready(function () {
      $("#easy").click(function () {
        that.speed = 200;
        that.startGame();
      });
      $("#med").click(function () {
        that.speed = 110;
        that.startGame();
      });
      $("#hard").click(function () {
        that.speed = 60;
        that.startGame();
      });
    });
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      window.clearInterval(this.intervalID);
      this.promptNewGame();
    }
  };

  View.prototype.startGame = function () {
    window.clearInterval(this.intervalID);
    this.board = new Snk.Board(20);
    this.setupGrid();
    this.inPlay = true;
    this.intervalID = window.setInterval(
      this.step.bind(this),
      this.speed
    );
  };

  View.prototype.resumeGame = function () {
    $("body").removeClass("paused");
    this.paused = false;
    this.toggleBtns();
    this.intervalID = window.setInterval(
      this.step.bind(this),
      this.speed
    );
  };

  View.prototype.pauseGame = function () {
    $("body").addClass("paused");
    this.paused = true;
    this.toggleBtns();
    window.clearInterval(this.intervalID);
  };

  View.prototype.toggleBtns = function () {
    if (this.paused) {
      $(".button").prop("disabled", true);
    } else {
      $(".button").prop("disabled", false);
    }
  };

  View.prototype.promptNewGame = function () {
    this.inPlay = false;
    this.$el.empty();
    this.$el.append("<h2>You died! ... Hit space to play again!</h2>");
  };

  View.prototype.handleKeyEvent = function (e) {
    if (e.keyCode === 32) {
      if (!this.inPlay) {
        this.startGame();
      } else {
        if (this.paused) {
          this.resumeGame();
        } else {
          this.pauseGame();
        }
      }
    } else if (View.DIRS[e.keyCode]) {
      this.board.snake.turn(View.DIRS[e.keyCode]);
    }
  };

  View.prototype.setupGrid = function () {
    this.$el.empty();
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
    this.updateScore(this.board.snake.score);
    this.renderSquares(this.board.snake.segments, "snake");
    this.renderSquares([this.board.apple.pos], "apple");
    if (this.inPlay) {
      this.renderSquares([this.board.snake.head()], "head");
    }
  };

  View.prototype.updateScore = function (score) {
    $(".points").empty();
    $(".points").append(score);
    if (score > this.hiScore) {
      $(".hiscore").empty();
      this.hiScore = score;
      $(".hiscore").append(this.hiScore);
    }
  };

  View.prototype.renderSquares = function (coords, className) {
    this.$li.filter("." + className).removeClass();
    coords.forEach(function(coord) {
      if (this.board.snake.head()) {
        var flatCoord = (coord.r * this.board.size) + coord.c;
      }
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.DIRS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S",
  };

})();
