// todo - should ticks also be in here?
var ExecutionInfo = function () {
  this.terminated_ = false;
  this.terminationValue_ = null;
  this.log = [];
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
