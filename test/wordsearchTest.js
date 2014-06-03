var testUtils = require('./util/testUtils');
var WordSearch = testUtils.requireWithGlobalsCheckSrcFolder('maze/wordsearch');
var assert = testUtils.assert;

describe("wordsearch: letterValue", function () {
  var letterValue = WordSearch.__testonly__.letterValue;

  it("letterValue, dont include numbers", function () {
    assert.equal(letterValue('A', false), 'A');
    assert.equal(letterValue('B', false), 'B');
    assert.equal(letterValue('Z', false), 'Z');

    assert.equal(letterValue('Ax', false), 'A');
    assert.equal(letterValue('Bx', false), 'B');
    assert.equal(letterValue('Zx', false), 'Z');

    assert.equal(letterValue(2, false), undefined);
  });

  it("letterValue, dont include numbers", function () {
    assert.equal(letterValue('A', true), 'A');
    assert.equal(letterValue('B', true), 'B');
    assert.equal(letterValue('Z', true), 'Z');

    assert.equal(letterValue('Ax', true), 'A');
    assert.equal(letterValue('Bx', true), 'B');
    assert.equal(letterValue('Zx', true), 'Z');

    assert.equal(letterValue(2, true), 2);
  });
});

describe("wordsearch: randomLetter", function () {
  var randomLetter = WordSearch.__testonly__.randomLetter;

  it ("randomLetter without restrictions", function () {
    for (var i = 0; i < 100; i++) {
      assert((/^[A-Z]$/).test(randomLetter()));
    }
  });

  it ("randomLetter with restrictions", function () {
    var allChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
      "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var letter = randomLetter(allChars.slice(0, -1));
    assert.equal(letter, 'Z', 'all other chars were restricted');

    for (var i = 0; i < 200; i++) {
      letter = randomLetter(['A']);
      assert((/^[B-Z]$/).test(letter), "failed on : " + letter);
    }
  });
});
