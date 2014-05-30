var testUtils = require('./util/testUtils');
var buildDir = '../build';
var xml = require(buildDir + '/js/xml');
var utils = require(buildDir + '/js/utils');
var requiredBlockUtils = require(buildDir + '/js/required_block_utils');
var blockUtils = require(buildDir + '/js/block_utils');
var assert = testUtils.assert;
var _ = require(buildDir + '/js/lodash');

beforeEach(function () {
  testUtils.setupTestBlockly();
});

describe("utils", function() {
  it("can debounce a repeated function call", function() {
    var counter = 0;
    var incrementCounter = function () { counter++; };
    var debounced = _.debounce(incrementCounter, 2000, true);
    debounced();
    debounced();
    debounced();
    debounced();
    assert(counter === 1);
    incrementCounter();
    assert(counter === 2);
  });
});

describe("blockUtils", function () {
  it("can create a block from XML", function () {
    var blockXMLString = '<block type="math_number"><title name="NUM">10</title></block>';
    assert(Blockly.mainWorkspace.getBlockCount() === 0);
    var newBlock = blockUtils.domStringToBlock(blockXMLString);
    assert(Blockly.mainWorkspace.getBlockCount() === 1);
    assert(newBlock.getTitleValue('NUM') === '10');
    assert(newBlock.getTitles().length === 1);
  });

  it("can create a block from XML and remove it from the workspace", function () {
    var blockXMLString = '<block type="math_number"><title name="NUM">10</title></block>';
    assert(Blockly.mainWorkspace.getBlockCount() === 0);
    var newBlock = blockUtils.domStringToBlock(blockXMLString);
    assert(Blockly.mainWorkspace.getBlockCount() === 1);
    newBlock.dispose();
    assert(Blockly.mainWorkspace.getBlockCount() === 0);
  });
});

describe("requiredBlockUtils", function () {
  it("can recognize matching titles in blocks", function () {
    var blockUserString = '<block type="math_number"><title name="NUM">10</title></block>';
    var blockUser = blockUtils.domStringToBlock(blockUserString);
    var blockRequiredString = '<block type="math_number"><title name="NUM">10</title></block>';
    var blockRequired = blockUtils.domStringToBlock(blockRequiredString);
    assert(blockUser.getTitles().length === 1);
    assert(blockRequired.getTitles().length === 1);
    assert(requiredBlockUtils.blockTitlesMatch(blockUser, blockRequired));
  });

  it("can recognize non-matching titles in blocks", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">10</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">11</title></block>');
    assert(!requiredBlockUtils.blockTitlesMatch(blockUser, blockRequired));
    assert(!requiredBlockUtils.blocksMatch(blockUser, blockRequired));
  });

  it("can recognize matching entire blocks", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">10</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">10</title></block>');
    assert(requiredBlockUtils.blocksMatch(blockUser, blockRequired));
  });

  it("can recognize mismatching block types", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="logic_boolean"></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">10</title></block>');
    assert(!requiredBlockUtils.blocksMatch(blockUser, blockRequired));
  });

  it("can recognize matching titles in blocks with multiple titles", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">1</title><title name="B">2</title><title name="C">3</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="C">3</title><title name="B">2</title><title name="A">1</title></block>');
    assert(requiredBlockUtils.blockTitlesMatch(blockUser, blockRequired));
  });

  it("can recognize mis-matching titles in blocks with differing Aber of titles", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">1</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">1</title><title name="B">2</title><title name="C">3</title></block>');
    assert(!requiredBlockUtils.blockTitlesMatch(blockUser, blockRequired));
    assert(!requiredBlockUtils.blockTitlesMatch(blockRequired, blockUser));
  });

  it("can recognize mis-matching titles in with multiple titles", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">1</title><title name="B">2</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="block_with_3_titles"><title name="A">2</title><title name="B">1</title></block>');
    assert(!requiredBlockUtils.blockTitlesMatch(blockUser, blockRequired));
  });
});
