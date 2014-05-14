var Bee = function (maze, config) {
  this.maze_ = maze;
  this.skin_ = config.skin;

  this.honeyGoal = config.level.honeyGoal;

  this.initialDirt_ = config.level.initialDirt;

  this.honeyImages_ = [];
  this.nectarImages_ = [];
};

module.exports = Bee;

// todo - there's a bunch of stuff that we use once for the execution, and a
// second time for the animations.  is there a better approach?
Bee.prototype.reset = function () {
  this.honey_ = 0;
  this.nectar_ = 0;
  this.updateNectarImages_();
};

Bee.prototype.checkSuccess = function () {
  return this.honey_ >= this.honeyGoal;

  // todo - also check individual honey goals
};

Bee.prototype.isHive = function (row, col) {
  return this.initialDirt_[row][col] < 0;
};

// API

Bee.prototype.getNectar = function (id) {
  var col = this.maze_.pegmanX;
  var row = this.maze_.pegmanY;

  // Nectar is positive.  Make sure we have it.
  if (this.maze_.dirt_[row][col] <= 0) {
    // todo - rationalize with exception throwing changes
    throw false;
  }

  BlocklyApps.log.push(['nectar', id]);
  this.nectar_ += 1;
};

Bee.prototype.makeHoney = function (id) {
  var col = this.maze_.pegmanX;
  var row = this.maze_.pegmanY;

  if (this.nectar_ === 0 || !this.isHive(row, col)) {
    // todo - rationalize with exception throwing changes
    throw false;
  }

  BlocklyApps.log.push(['honey', id]);
  this.nectar_ -= 1;
  this.honey_ += 1;
};


// ANIMATIONS

Bee.prototype.animateGetNectar = function () {
  var col = Maze.pegmanX;
  var row = Maze.pegmanY;

  if (this.maze_.dirt_[row][col] <= 0) {
    throw new Error("Shouldn't be able to end up with a nectar animation if " +
      "there was no nectar to be had");
  }

  this.maze_.dirt_[row][col] -= 1;
  // todo - i have an improvement for how updateDirt works on a different branch
  if (this.maze_.dirt_[row][col] === 0) {
    Maze.removeDirt(row, col);
  } else {
    Maze.updateDirt(row, col);
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
  var col = Maze.pegmanX;
  var row = Maze.pegmanY;

  if (this.nectar_ === 0 || !this.isHive(row, col)) {
    throw new Error("Shouldn't be able to end up with a honey animation if " +
      "we arent at a hive or dont have nectar");
  }

  // todo - track where we make honey for hive specific goals
  this.nectar_ -= 1;
  this.honey_ += 1;

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
