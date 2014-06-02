var _ = require('../lodash');

var SquareType = require('./tiles').SquareType;

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

var allChars = _.range(26).map(function (i) {
  return String.fromCharCode('A'.charCodeAt(0) + i);
});


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
    // args consists of allChars followed by the set of restricted letters
    var args = restrictions || [];
    args.unshift(allChars);
    letterPool = _.without.apply(null, args);
  } else {
    letterPool = allChars;
  }

  return _.sample(letterPool);
}

function isOpen (row, col) {
  return ((Maze.map[row] !== undefined) &&
    (Maze.map[row][col] !== undefined) &&
    (Maze.map[row][col] !== SquareType.WALL));
}

/**
 * Given a row and col, returns the row, col pair of any non-wall neighbors
 */
function openNeighbors (row, col) {
  var neighbors = [];
  if (isOpen(row + 1, col)) {
    neighbors.push([row + 1, col]);
  }
  if (isOpen(row - 1, col)) {
    neighbors.push([row - 1, col]);
  }
  if (isOpen(row, col + 1)) {
    neighbors.push([row, col + 1]);
  }
  if (isOpen(row, col - 1)) {
    neighbors.push([row, col - 1]);
  }

  return neighbors;
}

/**
 * We never want to have a branch where either direction gets you the next
 * correct letter.  As such, a "wall" space should never have the same value as
 * an open neighbor of an neighbor (i.e. if my non-wall neighbor has a non-wall
 * neighbor whose value is E, I can't also be E)
 */
function restrictedValues (row, col) {
  var neighbors = openNeighbors(row, col);
  var values = [];
  for (var i = 0; i < neighbors.length; i ++) {
    var secondNeighbors = openNeighbors(neighbors[i][0], neighbors[i][1]);
    for (var j = 0; j < secondNeighbors.length; j++) {
      var neighborRow = secondNeighbors[j][0];
      var neighborCol = secondNeighbors[j][1];
      // push value to restricted list
      var val = letterValue(Maze.map[neighborRow][neighborCol]);
      values.push(val, false);
    }
  }
  return values;
}

/**
 * Generate random tiles for walls (with some restrictions) and draw them to
 * the svg.
 */
module.exports.drawMapTiles = function (svg) {
  var tileId = 0;
  var tile;
  var restricted;

  for (var row = 0; row < Maze.ROWS; row++) {
    for (var col = 0; col < Maze.COLS; col++) {
      var mapVal = Maze.map[row][col];
      if (mapVal === SquareType.WALL) {
        restricted = restrictedValues(row, col);
        tile = TILE_SHAPES[randomLetter(restricted)];
        Maze.wallMap[row][col] = tile;

      } else {
        tile = TILE_SHAPES[letterValue(mapVal, true)];
      }

      Maze.drawTile(svg, tile, row, col, tileId);

      tileId++;
    }
  }
};

/**
 * In word search, we indicate the last letter in the world with the form Nx
 * (where N is that last letter).
 */
module.exports.isFinishCell = function (cell) {
  return (/^[A-Z]x$/).test(cell);
};
