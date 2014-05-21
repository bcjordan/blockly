/**
 * Stores information about a current Maze execution.  Execution consists of a
 * series of steps, where each step may contain one or more actions.
 */
var ExecutionInfo = function (options) {
  options = options || {};
  this.terminated_ = false;
  this.terminationValue_ = null;
  this.steps_ = [];
  this.ticks = options.ticks || Infinity;
  this.collection_ = null;
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
  var action = {command: command, blockId: blockId};
  if (this.collection_) {
    this.collection_.push(action);
  } else {
    // single action step (most common case)
    this.steps_.push([action]);
  }
};

ExecutionInfo.prototype.dequeueStep = function () {
  return this.steps_.shift();
};


/**
 * If we have no steps left, or our only remaining step is a single finish action
 * we're done executing, and if we're in step mode won't want to wait around
 * for another step press.
 */
ExecutionInfo.prototype.onLastStep = function () {
  if (this.steps_.length === 0) {
    return true;
  }

  if (this.steps_.length === 1) {
    var step = this.steps_[0];
    if (step.length === 1 && step[0].command === 'finish') {
      return true;
    }
  }
  return false;
};

/**
 * Collect all actions queued up between now and the call to stopCollecting,
 * and put them in a single step
 */
ExecutionInfo.prototype.collectActions = function () {
  if (this.collection_) {
    throw new Error("Already collecting");
  }
  this.collection_ = [];
};

ExecutionInfo.prototype.stopCollecting = function () {
  if (!this.collecting_) {
    throw new Error("Not currently collecting");
  }
  this.steps_.push(this.collection_);
  this.collection_ = null;
};

/**
 * If the user has executed too many actions, we're probably in an infinite
 * loop.  Set termination value to Infinity
 */
ExecutionInfo.prototype.checkTimeout = function() {
  if (this.ticks-- < 0) {
    this.terminateWithValue(Infinity);
  }
};
