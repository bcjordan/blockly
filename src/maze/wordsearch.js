var _ = require('../lodash');

var SquareType = require('./tiles').SquareType;

var WordSearch = module.exports = function (map, drawTileFn) {
  this.map_ = map;
  this.drawTileFn_ = drawTileFn;
};

var TILE_SHAPES = {
  'A': [0, 0],  // A
  'B': [1, 0],  // B
  'C': [2, 0],  // C
  'D': [3, 0],  // D
  'E': [4, 0],  // E
  'F': [5, 0],  // F
  'G': [6, 0],  // G
  'H': [0, 1],  // H
  'I': [1, 1],  // I
  'J': [2, 1],  // J
  'K': [3, 1],  // K
  'L': [4, 1],  // L
  'M': [5, 1],  // M
  'N': [6, 1],  // N
  'O': [0, 2],  // O
  'P': [1, 2],  // P
  'Q': [2, 2],  // Q
  'R': [3, 2],  // R
  'S': [4, 2],  // S
  'T': [5, 2],  // T
  'U': [6, 2],  // U
  'V': [0, 3],  // V
  'W': [1, 3],  // W
  'X': [2, 3],  // X
  'Y': [3, 3],  // Y
  'Z': [4, 3],  // Z
};
TILE_SHAPES[SquareType.START] = [5, 3]; // START char

var ALL_CHARS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
  "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

/**
 * Generate random tiles for walls (with some restrictions) and draw them to
 * the svg.
 */
WordSearch.prototype.drawMapTiles = function (svg) {
  var tileId = 0;
  var tile;
  var restricted;

  for (var row = 0; row < this.map_.length; row++) {
    for (var col = 0; col < this.map_[row].length; col++) {
      var mapVal = this.map_[row][col];
      if (mapVal === SquareType.WALL) {
        restricted = this.restrictedValues_(row, col);
        tile = TILE_SHAPES[randomLetter(restricted)];
      } else {
        tile = TILE_SHAPES[letterValue(mapVal, true)];
      }

      this.drawTileFn_(svg, tile, row, col, tileId);

      tileId++;
    }
  }
};

/**
 * In word search, we indicate the last letter in the world with the form Nx
 * (where N is that last letter).
 */
WordSearch.prototype.isFinishCell = function (cell) {
  return (/^[A-Z]x$/).test(cell);
};

/**
 * Returns true if the given row,col is both on the grid and not a wall
 */
WordSearch.prototype.isOpen_ = function (row, col) {
  var map = this.map_;
  return ((map[row] !== undefined) &&
    (map[row][col] !== undefined) &&
    (map[row][col] !== SquareType.WALL));
};

/**
 * Given a row and col, returns the row, col pair of any non-wall neighbors
 */
WordSearch.prototype.openNeighbors_ =function (row, col) {
  var neighbors = [];
  if (this.isOpen_(row + 1, col)) {
    neighbors.push([row + 1, col]);
  }
  if (this.isOpen_(row - 1, col)) {
    neighbors.push([row - 1, col]);
  }
  if (this.isOpen_(row, col + 1)) {
    neighbors.push([row, col + 1]);
  }
  if (this.isOpen_(row, col - 1)) {
    neighbors.push([row, col - 1]);
  }

  return neighbors;
};

/**
 * We never want to have a branch where either direction gets you the next
 * correct letter.  As such, a "wall" space should never have the same value as
 * an open neighbor of an neighbor (i.e. if my non-wall neighbor has a non-wall
 * neighbor whose value is E, I can't also be E)
 */
WordSearch.prototype.restrictedValues_ = function (row, col) {
  var map = this.map_;
  var neighbors = this.openNeighbors_(row, col);
  var values = [];
  for (var i = 0; i < neighbors.length; i ++) {
    var secondNeighbors = this.openNeighbors_(neighbors[i][0], neighbors[i][1]);
    for (var j = 0; j < secondNeighbors.length; j++) {
      var neighborRow = secondNeighbors[j][0];
      var neighborCol = secondNeighbors[j][1];
      // push value to restricted list
      var val = letterValue(map[neighborRow][neighborCol]);
      values.push(val, false);
    }
  }
  return values;
};


/**
 * For wordsearch, values in Maze.map can take the form of a number (i.e. 2 means
 * start), a letter ('A' means A), or a letter followed by x ('Nx' means N and
 * that this is the finish.  This function will strip the x, and will ignore
 * non-letter values unless includeNumbers is true
 */
function letterValue(val, includeNumbers) {
  if (typeof(val) === "number") {
    return includeNumbers ? val : undefined;
  }

  if (typeof(val) === "string") {
    return val[0];
  }

  throw new Error("unexpected value for letterValue");
}

/**
 * Return a random uppercase letter that isn't in the list of restrictions
 */
function randomLetter (restrictions) {
  var letterPool;
  if (restrictions) {
    // args consists of ALL_CHARS followed by the set of restricted letters
    var args = restrictions || [];
    args.unshift(ALL_CHARS);
    letterPool = _.without.apply(null, args);
  } else {
    letterPool = ALL_CHARS;
  }

  return _.sample(letterPool);
}

/* start-test-block */
// export private function(s) to expose to unit testing
WordSearch.__testonly__ = {
  letterValue: letterValue,
  randomLetter: randomLetter
};
/* end-test-block */
