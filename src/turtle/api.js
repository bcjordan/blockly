var BlocklyApps = require('../base');

exports.executionInfo = null;

exports.moveForward = function(distance, id) {
  this.executionInfo.log.push(['FD', distance, id]);
};

exports.moveBackward = function(distance, id) {
  this.executionInfo.log.push(['FD', -distance, id]);
};

exports.moveUp = function(distance, id) {
  this.executionInfo.log.push(['MV', distance, 0, id]);
};

exports.moveDown = function(distance, id) {
  this.executionInfo.log.push(['MV', distance, 180, id]);
};

exports.moveLeft = function(distance, id) {
  this.executionInfo.log.push(['MV', distance, 270, id]);
};

exports.moveRight = function(distance, id) {
  this.executionInfo.log.push(['MV', distance, 90, id]);
};

exports.jumpUp = function(distance, id) {
  this.executionInfo.log.push(['JD', distance, 0, id]);
};

exports.jumpDown = function(distance, id) {
  this.executionInfo.log.push(['JD', distance, 180, id]);
};

exports.jumpLeft = function(distance, id) {
  this.executionInfo.log.push(['JD', distance, 270, id]);
};

exports.jumpRight = function(distance, id) {
  this.executionInfo.log.push(['JD', distance, 90, id]);
};

exports.jumpForward = function(distance, id) {
  this.executionInfo.log.push(['JF', distance, id]);
};

exports.jumpBackward = function(distance, id) {
  this.executionInfo.log.push(['JF', -distance, id]);
};

exports.turnRight = function(angle, id) {
  this.executionInfo.log.push(['RT', angle, id]);
};

exports.turnLeft = function(angle, id) {
  this.executionInfo.log.push(['RT', -angle, id]);
};

exports.penUp = function(id) {
  this.executionInfo.log.push(['PU', id]);
};

exports.penDown = function(id) {
  this.executionInfo.log.push(['PD', id]);
};

exports.penWidth = function(width, id) {
  this.executionInfo.log.push(['PW', Math.max(width, 0), id]);
};

exports.penColour = function(colour, id) {
  this.executionInfo.log.push(['PC', colour, id]);
};

exports.hideTurtle = function(id) {
  this.executionInfo.log.push(['HT', id]);
};

exports.showTurtle = function(id) {
  this.executionInfo.log.push(['ST', id]);
};
