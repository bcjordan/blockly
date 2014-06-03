/**
 * Blockly App: Studio
 *
 * Copyright 2014 Code.org
 *
 */

'use strict';

var Studio = require('./studio');
var tiles = require('./tiles');
var Direction = tiles.Direction;

//
// Sprite constructor (currently used for Studio projectiles only)
//
// opts.image (URL)
// opts.width (pixels)
// opts.height (pixels)
// opts.x (x position)
// opts.y (y position)
// opts.dir (direction)
// opts.speed (speed)
//

exports.Sprite = function (opts) {
  for (var prop in opts) {
    this[prop] = opts[prop];
  }
  this.flags = 0;
  this.collisionMask = 0;
  this.widthCoord = this.width / Studio.SQUARE_SIZE;
  this.heightCoord = this.height / Studio.SQUARE_SIZE;
};

exports.Sprite.prototype.createElement = function (parentElement) {
  this.element = document.createElementNS(Blockly.SVG_NS, 'image');
  this.element.setAttributeNS('http://www.w3.org/1999/xlink',
                              'xlink:href',
                              this.image);
  this.element.setAttribute('height', this.height);
  this.element.setAttribute('width', this.width);
  this.element.setAttribute('visibility', 'hidden');
  parentElement.appendChild(this.element);
};

exports.Sprite.prototype.removeElement = function () {
  if (this.element) {
    this.element.parentElement.removeChild(this.element);
    this.element = null;
  }
};

exports.Sprite.prototype.setPosition = function (x, y) {
  this.x = x;
  this.y = y;
};

exports.Sprite.prototype.setDirection = function (dir) {
  this.dir = dir;
};

exports.Sprite.prototype.setSpeed = function (speed) {
  this.speed = speed;
};

exports.Sprite.prototype.startCollision = function (i) {
  if (0 === (this.collisionMask & Math.pow(2, i))) {
    this.collisionMask |= Math.pow(2, i);
    return true;
  }
  return false;
};

exports.Sprite.prototype.markNotColliding = function (i) {
  this.collisionMask &= ~(Math.pow(2, i));
};

var calcMoveDistance = function (sprite, yAxis) {
  var scaleFactor;
  switch (sprite.dir) {
    case Direction.NORTH:
      scaleFactor = yAxis ? -1 : 0;
      break;
    case Direction.WEST:
      scaleFactor = yAxis ? 0: -1;
      break;
    case Direction.SOUTH:
      scaleFactor = yAxis ? 1 : 0;
      break;
    case Direction.EAST:
      scaleFactor = yAxis ? 0: 1;
      break;
  }
  return sprite.speed * scaleFactor;
};

exports.Sprite.prototype.getNextPosition = function (yAxis) {
  var curPos = yAxis ? this.y : this.x;
  return curPos + calcMoveDistance(this, yAxis);
};

exports.Sprite.prototype.moveToNextPosition = function () {
  this.x = this.getNextPosition(false);
  this.y = this.getNextPosition(true);
};

exports.Sprite.prototype.bounce = function () {
  switch (this.dir) {
    case Direction.NORTH:
      this.dir = Direction.SOUTH;
      break;
    case Direction.WEST:
      this.dir = Direction.EAST;
      break;
    case Direction.SOUTH:
      this.dir = Direction.NORTH;
      break;
    case Direction.EAST:
      this.dir = Direction.WEST;
      break;
  }
};

exports.Sprite.prototype.outOfBounds = function () {
  return (this.x < -(this.widthCoord / 2)) ||
         (this.x > Studio.COLS + (this.widthCoord / 2)) ||
         (this.y < -(this.heightCoord / 2)) ||
         (this.y > Studio.ROWS + (this.heightCoord / 2));
};

exports.Sprite.prototype.display = function () {
  var xCoord = (this.x - (this.widthCoord / 2)) * Studio.SQUARE_SIZE;
  var yCoord = (this.y - (this.heightCoord / 2)) * Studio.SQUARE_SIZE;

  this.element.setAttribute('x', xCoord);
  this.element.setAttribute('y', yCoord);

  if (!this.visible) {
    this.element.setAttribute('visibility', 'visible');
    this.visible = true;
  }
};

