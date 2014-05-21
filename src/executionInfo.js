var ExecutionInfo = function (options) {
  options = options || {};
  this.terminated_ = false;
  this.terminationValue_ = null;
  this.log_ = [];
  this.ticks = options.ticks || Infinity;
};

module.exports = ExecutionInfo;

ExecutionInfo.prototype.terminateWithValue = function (value) {
  this.terminated_ = true;
  this.terminationValue_ = value;
};

ExecutionInfo.prototype.isTerminated = function () {
  return this.terminated_;
};

ExecutionInfo.prototype.terminationValue = function () {
  return this.terminationValue_;
};

ExecutionInfo.prototype.queueAction = function (command, blockId) {
  this.log_.push({command: command, blockId: blockId});
};

ExecutionInfo.prototype.dequeueAction = function () {
  return this.log_.shift();
};

ExecutionInfo.prototype.onLastStep = function () {
  return this.log_.length === 0 || (this.log_.length === 1 && this.log_.command === "finish");
};

/**
 * If the user has executed too many actions, we're probably in an infinite
 * loop.  Sadly I wasn't able to solve the Halting Problem.
 * @param {?string} opt_id ID of loop block to highlight.
 * @throws {Infinity} Throws an error to terminate the user's program.
 */
ExecutionInfo.prototype.checkTimeout = function(opt_id) {
  if (opt_id) {
    this.log_.push([null, opt_id]);
  }
  if (this.ticks-- < 0) {
    this.terminateWithValue(Infinity);
  }
};
