var utils = require('../utils');

/**
 * Only call API functions if we haven't yet terminated execution
 */
var API_FUNCTION =function (fn) {
  return utils.executeIfConditional(function () {
    return !BlocklyApps.executionInfo.isTerminated();
  }, fn);
};

var Bee = function (maze, config) {
  this.maze_ = maze;
  this.skin_ = config.skin;

  this.nectarGoal_ = config.level.nectarGoal || 0;
  this.honeyGoal_ = config.level.honeyGoal || 0;

  // Create our own copy to ensure that it's not changing underneath us
  this.initialDirt_ = utils.cloneWithoutFunctions(config.level.initialDirt);

  this.honeyImages_ = [];
  this.nectarImages_ = [];
};

module.exports = Bee;

Bee.prototype.reset = function () {
  this.honey_ = 0;
  this.nectar_ = 0;
  this.updateNectarImages_();
  this.updateHoneyImages_();
};

/**
 * Did we reach our total nectar/honey goals, and accomplish any specific hiveGoals
 */
Bee.prototype.finished = function () {
  if (this.honey_ < this.honeyGoal_ || this.nectar_ < this.nectarGoal_) {
    return false;
  }

  for (var row = 0; row < this.initialDirt_.length; row++) {
    for (var col = 0; col < this.initialDirt_[row].length; col++) {
      // If any of our hives still have non infinite capactiy, we haven't hit
      // the hiveGoal
      var capacity = this.hiveRemainingCapacity(row, col);
      if (this.isHive(row, col) && capacity > 0 && capacity < Infinity) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Each cell of initialDirt is below zero if it's a hive.  If a hive has no hive
 * specific goal, it is represented as -1.  If a hive does have a goal, it is
 * represented as -(1 + hiveGoal).
 */
Bee.prototype.isHive = function (row, col) {
  return this.initialDirt_[row][col] < 0;
};

/**
 * See isHive comment.
 */
Bee.prototype.hiveGoal = function (row, col) {
  var val = this.initialDirt_[row][col];
  if (val >= -1) {
    return 0;
  }

  return Math.abs(val) - 1;
};


/**
 * How much more honey can the hive at (row, col) produce before it hits the goal
 */
Bee.prototype.hiveRemainingCapacity = function (row, col) {
  if (!this.isHive(row, col)) {
    return 0;
  }

  var currentVal = this.maze_.dirt_[row][col];
  var initialVal = this.initialDirt_[row][col];
  // If we started at -1, we have no hiveGoal and have infinite capacity
  if (currentVal === -1 && initialVal === -1) {
    return Infinity;
  }

  // Otherwise our capacity is how many more until we get to -1
  return Math.abs(currentVal + 1);
};

/**
 * Update model to represent made honey.  Does no validation
 */
Bee.prototype.makeHoneyAt = function (row, col) {
  var capacity = this.hiveRemainingCapacity(row, col);
  if (capacity > 0 && capacity !== Infinity) {
    this.maze_.dirt_[row][col] += 1; // update progress towards goal
  }

  this.nectar_ -= 1;
  this.honey_ += 1;
};

// API

Bee.prototype.getNectar = API_FUNCTION(function (id) {
  var col = this.maze_.pegmanX;
  var row = this.maze_.pegmanY;

  // Nectar is positive.  Make sure we have it.
  if (this.maze_.dirt_[row][col] <= 0) {
    BlocklyApps.executionInfo.terminateWithValue(false);
    return;
  }

  BlocklyApps.executionInfo.log.push(['nectar', id]);
  this.nectar_ += 1;
});

Bee.prototype.makeHoney = API_FUNCTION(function (id) {
  var col = this.maze_.pegmanX;
  var row = this.maze_.pegmanY;

  if (this.nectar_ === 0 || this.hiveRemainingCapacity(row, col) === 0) {
    BlocklyApps.executionInfo.terminateWithValue(false);
    return;
  }

  BlocklyApps.executionInfo.log.push(['honey', id]);
  this.makeHoneyAt(row, col);
});

// ANIMATIONS

Bee.prototype.animateGetNectar = function () {
  var col = this.maze_.pegmanX;
  var row = this.maze_.pegmanY;

  if (this.maze_.dirt_[row][col] <= 0) {
    throw new Error("Shouldn't be able to end up with a nectar animation if " +
      "there was no nectar to be had");
  }

  this.maze_.dirt_[row][col] -= 1;
  // todo - i have an improvement for how updateDirt works on a different branch
  if (this.maze_.dirt_[row][col] === 0) {
    this.maze_.removeDirt(row, col);
  } else {
    this.maze_.updateDirt(row, col);
  }

  this.nectar_ += 1;

  this.updateNectarImages_();

  // play a sound?
};

Bee.prototype.updateNectarImages_ = function () {
  var self = this;

  var svg = document.getElementById('svgMaze');
  var pegmanElement = document.getElementsByClassName('pegman-location')[0];

  // create any needed images
  for (var i = this.nectarImages_.length; i < this.nectar_; i++) {
    // Create clip path.
    var clip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
    clip.setAttribute('id', 'nectarClip' + (i + 1));
    var rect = document.createElementNS(Blockly.SVG_NS, 'rect');
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', 50);
    clip.appendChild(rect);
    svg.insertBefore(clip, pegmanElement);

    this.nectarImages_[i] = document.createElementNS(Blockly.SVG_NS, 'image');
    this.nectarImages_[i].setAttribute('id', 'nectar' + (i + 1));
    this.nectarImages_[i].setAttribute('width', 50);
    this.nectarImages_[i].setAttribute('height', 50);
    this.nectarImages_[i].setAttribute('x', i * 50);
    this.nectarImages_[i].setAttribute('y', 0);
    this.nectarImages_[i].setAttribute('clip-path', 'url(#nectarClip' + (i + 1) + ')');
    this.nectarImages_[i].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      this.skin_.nectar);
    svg.insertBefore(this.nectarImages_[i], pegmanElement);
  }

  this.nectarImages_.forEach(function (image, index) {
    image.setAttribute('display', index < self.nectar_ ? 'block' : 'none');
  });
};


Bee.prototype.animateMakeHoney = function () {
  var col = this.maze_.pegmanX;
  var row = this.maze_.pegmanY;

  if (this.nectar_ === 0 || !this.isHive(row, col)) {
    throw new Error("Shouldn't be able to end up with a honey animation if " +
      "we arent at a hive or dont have nectar");
  }

  this.makeHoneyAt(row, col);

  this.maze_.updateDirt(row, col);

  this.updateNectarImages_();
  this.updateHoneyImages_();
};

Bee.prototype.updateHoneyImages_ = function () {
  var self = this;

  var svg = document.getElementById('svgMaze');
  var pegmanElement = document.getElementsByClassName('pegman-location')[0];

  // create any needed images
  for (var i = this.honeyImages_.length; i < this.honey_; i++) {
    // Create clip path.
    var clip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
    clip.setAttribute('id', 'honeyClip' + (i + 1));
    var rect = document.createElementNS(Blockly.SVG_NS, 'rect');
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 50);
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', 50);
    clip.appendChild(rect);
    svg.insertBefore(clip, pegmanElement);

    this.honeyImages_[i] = document.createElementNS(Blockly.SVG_NS, 'image');
    this.honeyImages_[i].setAttribute('id', 'honey' + (i + 1));
    this.honeyImages_[i].setAttribute('width', 50);
    this.honeyImages_[i].setAttribute('height', 50);
    this.honeyImages_[i].setAttribute('x', i * 50);
    this.honeyImages_[i].setAttribute('y', 50);
    this.honeyImages_[i].setAttribute('clip-path', 'url(#honeyClip' + (i + 1) + ')');
    this.honeyImages_[i].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      this.skin_.honey);
    svg.insertBefore(this.honeyImages_[i], pegmanElement);
  }

  this.honeyImages_.forEach(function (image, index) {
    image.setAttribute('display', index < self.honey_ ? 'block' : 'none');
  });
};

/**
 * When successfully completing a level, maze gradually fades out paths.  It
 * assumes all dirt is at 0. For now we'll just set all dirt to 0 so that hives
 * get hidden.  There may be a better long term approach.
 */
Bee.prototype.setTilesTransparent = function () {
  for (var row = 0; row < this.initialDirt_.length; row++) {
    for (var col = 0; col < this.initialDirt_[row].length; col++) {
      if (this.isHive(row, col)) {
        this.maze_.removeDirt(row, col);
      }
    }
  }
};
