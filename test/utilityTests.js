var testUtils = require('./util/testUtils');
var buildDir = '../build';
var xml = require(buildDir + '/js/xml');
var requiredBlockUtils = require(buildDir + '/js/required_block_utils');
var blockUtils = require(buildDir + '/js/block_utils');
var assert = testUtils.assert;

beforeEach(function () {
  testUtils.setupTestBlockly();
});

describe("blockUtils", function () {
  it("can create a block from XML", function () {
    var blockXMLString = '<block type="math_number"><title name="NUM">10</title></block>';
    assert(Blockly.mainWorkspace.getBlockCount() === 0);
    var newBlock = blockUtils.domStringToBlock(blockXMLString);
    assert(Blockly.mainWorkspace.getBlockCount() === 1);
    var titleValue = newBlock.getTitleValue('NUM');
    assert(titleValue == '10');
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
    assert(requiredBlockUtils.titlesMatch(blockUser, blockRequired));
  });

  it("can recognize non-matching titles in blocks", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="math_number"><title name="NUM">10</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="math_number"><title name="NUM">11</title></block>');
    assert(!requiredBlockUtils.titlesMatch(blockUser, blockRequired));
    assert(!requiredBlockUtils.blockMeetsRequirements(blockUser, blockRequired));
  });

  it("can recognize matching entire blocks", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="math_number"><title name="NUM">10</title></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="math_number"><title name="NUM">10</title></block>');
    assert(requiredBlockUtils.blockMeetsRequirements(blockUser, blockRequired));
  });

  it("can recognize mismatching block types", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="logic_boolean"></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="math_number"><title name="NUM">10</title></block>');
    assert(!requiredBlockUtils.blockMeetsRequirements(blockUser, blockRequired));
  });

  it("can generate tests from a required blocks XML blob", function () {
    var blockUser = blockUtils.domStringToBlock('<block type="logic_boolean"></block>');
    var blockRequired = blockUtils.domStringToBlock('<block type="math_number"><title name="NUM">10</title></block>');
    assert(!requiredBlockUtils.blockMeetsRequirements(blockUser, blockRequired));
  });
});
