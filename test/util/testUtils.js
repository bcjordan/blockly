var chai = require('chai');
chai.Assertion.includeStack = true;
var assert = chai.assert;
exports.assert = assert;
var SRC = '../../src/';

require('./requireUncache').wrap(require);

var GlobalDiff = require('./globalDiff');
var globalDiff = new GlobalDiff();
var Overloader = require('./overloader');
var mapping = [
  {
    search: /\.\.\/locale\/current\//,
    replace: '../build/locale/en_us/'
  },
  {
    search: /^\.\/templates\//,
    replace: '../build/js/templates/'
  }
];
var overloader = new Overloader(mapping, module);
// overloader.verbose = true;

/**
 * Wrapper around require, potentially also using our overloader, that also
 * validates that any additions to our global namespace are expected.
 */
exports.requireWithGlobalsCheck = function(path, allowedChanges, useOverloader) {
  allowedChanges = allowedChanges || [];
  if (useOverloader === undefined) {
    useOverloader = true;
  }

  globalDiff.cache();
  var result = useOverloader ? overloader.require(path) : require(path);
  var diff = globalDiff.diff(true);
  diff.forEach(function (key) {
    assert.notEqual(allowedChanges.indexOf(key), -1, "unexpected global change\n" +
      "key: " + key + "\n" +
      "require: " + path + "\n");
  });
  return result;
};

exports.requireWithGlobalsCheckSrcFolder = function(path, allowedChanges, useOverloader) {
  return this.requireWithGlobalsCheck(SRC + path, allowedChanges, useOverloader);
};

exports.setupTestBlockly = function() {
  this.requireWithGlobalsCheck('./frame',
  ['document', 'window', 'DOMParser', 'XMLSerializer', 'Blockly'], false);
  assert(global.Blockly, 'Frame loaded Blockly into global namespace');

  // uncache file to force reload
  require.uncache(SRC + '/base');
  // c, n, v, p, s get added to global namespace by messageformat module, which
  // is loaded when we require our locale msg files
  global.BlocklyApps = this.requireWithGlobalsCheckSrcFolder('/base',
    ['c', 'n', 'v', 'p', 's']);
  globalDiff.cache(); // recache since we added global BlocklyApps

  var blocklyAppDiv = document.getElementById('app');
  assert(blocklyAppDiv);

  var options = {
    assetUrl: function (path) {
      return '../lib/blockly/' + path;
    }
  };
  Blockly.inject(blocklyAppDiv, options);

  assert(Blockly.Blocks.text_print, "text_print block exists");
  assert(Blockly.Blocks.text, "text block exists");
  assert(Blockly.Blocks.math_number, "math_number block exists");
  assert(BlocklyApps, "BlocklyApps exists");
  assert(Blockly.mainWorkspace, "Blockly workspace exists");

  Blockly.mainWorkspace.clear();
  assert(Blockly.mainWorkspace.getBlockCount() === 0, "Blockly workspace is empty");
};
