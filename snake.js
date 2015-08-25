/* global Snk */
(function () {
  if (typeof Snk === "undefined") {
    window.Snk = {};
  }

  var Coord = Snk.Coord = function (r, c) {
    this.r = r;
    this.c = c;
  };

  Coord.prototype.plus = function (argCrd) {
    return new Coord((this.r + argCrd.r), (this.c + argCrd.c));
  };

  Coord.prototype.equals = function (argCrd) {
    return (this.r === argCrd.r) && (this.c === argCrd.c);
  };

  Coord.prototype.isOpposite = function (argCrd) {
    return (this.r === (-1 * argCrd.r)) && (this.c === (-1 * argCrd.c));
  };

  var Snake = Snk.Snake = function (board) {
    this.dir = "N";
    this.segments = [new Coord(6, 6)]; //Change to center of board?
    this.turning = false;
  };

  Snake.DIFFS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
    this.segments.shift();
    this.turning = false;
  };

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.turn = function (dir) {
    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) || this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };

  var Board = Snk.Board = function (size) {
    this.size = size;
    this.snake = new Snake(this);
  };

  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.size);
    this.snake.segments.forEach(function (seg) {
      grid[seg.r][seg.c] = Snake.SYM;
    });

    var rowStrs = [];
    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };

  Board.prototype.validPos = function (coord) {
    return (coord.r >= 0) && (coord.r < this.size) &&
      (coord.c >= 0) && (coord.c < this.size);
  };

  Board.blankGrid = function (size) {
    var grid = [];
    for (var i = 0; i < size; i++) {
      var row = [];
      for (var j = 0; j < size; j++) {
        row.push(Board.EMPTY);
      }
      grid.push(row);
    }
    return grid;
  };

  Board.EMPTY = ".";
  Snake.SYM = "S";

})();
