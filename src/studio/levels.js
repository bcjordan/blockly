/*jshint multistr: true */

var msg = require('../../locale/current/studio');
var utils = require('../utils');
var blockUtils = require('../block_utils');
var tiles = require('./tiles');
var Direction = tiles.Direction;
var Emotions = tiles.Emotions;
var tb = blockUtils.createToolbox;
var blockOfType = blockUtils.blockOfType;
var createCategory = blockUtils.createCategory;

/*
 * Configuration for all levels.
 */
module.exports = {

  '1': {
    'requiredBlocks': [
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 16,0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'goal': {
      successCondition: function () {
        return (Studio.sayComplete > 0);
      }
    },
    'timeoutFailureTick': 100,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '2': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'timeoutFailureTick': 100,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '3': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}],
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'goal': {
      successCondition: function () {
        return ((Studio.sayComplete > 0) &&
                (Studio.sprite[0].collisionMask & 2));
      }
    },
    'timeoutFailureTick': 200,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenSpriteCollided" deletable="false" x="20" y="120"></block>'
  },
  '4': {
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 2,
    'toolbox':
      tb(blockOfType('studio_move') +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"></block> \
      <block type="studio_whenRight" deletable="false" x="180" y="20"></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="120"></block> \
      <block type="studio_whenDown" deletable="false" x="180" y="120"></block>'
  },
  '5': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0,16, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 3,
    'timeoutFailureTick': 200,
    'toolbox':
      tb(blockOfType('studio_moveDistance') +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_repeatForever" deletable="false" x="20" y="20"></block>'
  },
  '6': {
    'requiredBlocks': [
      [{'test': 'move', 'type': 'studio_move'}],
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [16,0, 0, 0,16, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 2,
    'toolbox':
      tb(blockOfType('studio_moveDistance') +
         blockOfType('studio_move') +
         blockOfType('studio_saySprite')),
    'minWorkspaceHeight': 600,
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"> \
        <next><block type="studio_move"> \
                <title name="DIR">8</title></block> \
        </next></block> \
      <block type="studio_whenRight" deletable="false" x="20" y="100"> \
        <next><block type="studio_move"> \
                <title name="DIR">2</title></block> \
        </next></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="180"> \
        <next><block type="studio_move"> \
                <title name="DIR">1</title></block> \
        </next></block> \
      <block type="studio_whenDown" deletable="false" x="20" y="260"> \
        <next><block type="studio_move"> \
                <title name="DIR">4</title></block> \
        </next></block> \
      <block type="studio_repeatForever" deletable="false" x="20" y="340"> \
        <statement name="DO"><block type="studio_moveDistance"> \
                <title name="SPRITE">1</title> \
                <title name="DISTANCE">400</title> \
          <next><block type="studio_moveDistance"> \
                  <title name="SPRITE">1</title> \
                  <title name="DISTANCE">400</title> \
                  <title name="DIR">4</title></block> \
          </next></block> \
      </statement></block> \
      <block type="studio_whenSpriteCollided" deletable="false" x="20" y="450"></block>'
  },
  '7': {
    'requiredBlocks': [
      [{'test': 'saySprite', 'type': 'studio_saySprite'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0,16, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'goal': {
      successCondition: function () {
        return (Studio.sayComplete > 1);
      }
    },
    'timeoutFailureTick': 200,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_saySprite')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '8': {
    'requiredBlocks': [
      [{'test': 'setSpriteEmotion', 'type': 'studio_setSpriteEmotion'}]
    ],
    'scale': {
      'snapRadius': 2
    },
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 16,0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 4,
    'goal': {
      successCondition: function () {
        return (Studio.sprite[0].emotion === Emotions.HAPPY) &&
               (Studio.tickCount >= 50);
      }
    },
    'timeoutFailureTick': 100,
    'toolbox':
      tb('<block type="studio_moveDistance"><title name="DIR">2</title></block>' +
         blockOfType('studio_setSpriteEmotion')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '9': {
    'requiredBlocks': [
      [{'test': 'moveDistance', 'type': 'studio_moveDistance'}],
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'map': [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [16,0, 0, 0,16, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 2,
    'spriteFinishIndex': 1,
    'minWorkspaceHeight': 500,
    'toolbox':
      tb('<block type="studio_moveDistance"> \
           <title name="DISTANCE">400</title> \
           <title name="SPRITE">1</title></block>' +
         '<block type="studio_saySprite"> \
           <title name="SPRITE">1</title></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"> \
        <next><block type="studio_move"> \
                <title name="DIR">8</title></block> \
        </next></block> \
      <block type="studio_whenRight" deletable="false" x="20" y="100"> \
        <next><block type="studio_move"> \
                <title name="DIR">2</title></block> \
        </next></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="180"> \
        <next><block type="studio_move"> \
                <title name="DIR">1</title></block> \
        </next></block> \
      <block type="studio_whenDown" deletable="false" x="20" y="260"> \
        <next><block type="studio_move"> \
                <title name="DIR">4</title></block> \
        </next></block> \
      <block type="studio_repeatForever" deletable="false" x="20" y="340"></block>'
  },
  '10': {
    'requiredBlocks': [
      [{'test': 'playSound', 'type': 'studio_playSound'}],
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [16,0, 0, 0,16, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'spriteStartingImage': 2,
    'spriteFinishIndex': 1,
    'minWorkspaceHeight': 600,
    'goal': {
      successCondition: function () {
        return (Studio.playSoundCount > 0) &&
               (Studio.tickCount >= 120);
      }
    },
    'timeoutFailureTick': 300,
    'toolbox':
      tb('<block type="studio_moveDistance"> \
           <title name="DISTANCE">400</title> \
           <title name="SPRITE">1</title></block>' +
         '<block type="studio_saySprite"> \
           <title name="SPRITE">1</title></block>' +
         '<block type="studio_playSound"> \
           <title name="SOUND">crunch</title></block>'),
    'startBlocks':
     '<block type="studio_whenLeft" deletable="false" x="20" y="20"> \
        <next><block type="studio_move"> \
                <title name="DIR">8</title></block> \
        </next></block> \
      <block type="studio_whenRight" deletable="false" x="20" y="100"> \
        <next><block type="studio_move"> \
                <title name="DIR">2</title></block> \
        </next></block> \
      <block type="studio_whenUp" deletable="false" x="20" y="180"> \
        <next><block type="studio_move"> \
                <title name="DIR">1</title></block> \
        </next></block> \
      <block type="studio_whenDown" deletable="false" x="20" y="260"> \
        <next><block type="studio_move"> \
                <title name="DIR">4</title></block> \
        </next></block> \
      <block type="studio_repeatForever" deletable="false" x="20" y="340"> \
        <statement name="DO"><block type="studio_moveDistance"> \
                <title name="SPRITE">1</title> \
                <title name="DISTANCE">400</title> \
          <next><block type="studio_moveDistance"> \
                  <title name="SPRITE">1</title> \
                  <title name="DISTANCE">400</title> \
                  <title name="DIR">4</title></block> \
          </next></block> \
      </statement></block> \
      <block type="studio_whenSpriteCollided" deletable="false" x="20" y="450"></block>'
  },
  '99': {
    'requiredBlocks': [
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'minWorkspaceHeight': 1300,
    'spritesHiddenToStart': true,
    'freePlay': true,
    'map': [
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb(blockOfType('studio_setSprite') +
         blockOfType('studio_setBackground') +
         blockOfType('studio_whenGameStarts') +
         blockOfType('studio_whenLeft') +
         blockOfType('studio_whenRight') +
         blockOfType('studio_whenUp') +
         blockOfType('studio_whenDown') +
         blockOfType('studio_whenSpriteClicked') +
         blockOfType('studio_whenSpriteCollided') +
         blockOfType('studio_repeatForever') +
         blockOfType('studio_showTitleScreen') +
         blockOfType('studio_move') +
         blockOfType('studio_moveDistance') +
         blockOfType('studio_stop') +
         blockOfType('studio_wait') +
         blockOfType('studio_playSound') +
         blockOfType('studio_incrementScore') +
         blockOfType('studio_saySprite') +
         blockOfType('studio_setSpritePosition') +
         blockOfType('studio_setSpriteSpeed') +
         blockOfType('studio_setSpriteEmotion')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
  '100': {
    'requiredBlocks': [
    ],
    'scale': {
      'snapRadius': 2
    },
    'softButtons': [
      'leftButton',
      'rightButton',
      'downButton',
      'upButton'
    ],
    'minWorkspaceHeight': 1000,
    'spritesHiddenToStart': true,
    'freePlay': true,
    'map': [
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,16, 0, 0, 0,16, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'toolbox':
      tb(createCategory(msg.catActions(),
                          blockOfType('studio_setSprite') +
                          blockOfType('studio_setBackground') +
                        '<block type="studio_showTitleScreenParams"> \
                          <value name="TITLE"><block type="text"></block> \
                          </value> \
                          <value name="TEXT"><block type="text"></block> \
                          </value></block>' +
                          blockOfType('studio_move') +
                      '<block type="studio_moveDistanceParams" inline="true"> \
                        <value name="DISTANCE"><block type="math_number"> \
                                <title name="NUM">25</title></block> \
                        </value></block>' +
                          blockOfType('studio_stop') +
                        '<block type="studio_waitParams" inline="true"> \
                          <value name="VALUE"><block type="math_number"> \
                                  <title name="NUM">1</title></block> \
                          </value></block>' +
                          blockOfType('studio_playSound') +
                        '<block type="studio_setScoreText" inline="true"> \
                          <value name="TEXT"><block type="text"></block> \
                          </value></block>' +
                        '<block type="studio_saySpriteParams" inline="true"> \
                          <value name="TEXT"><block type="text"></block> \
                          </value></block>' +
                          blockOfType('studio_setSpritePosition') +
                          blockOfType('studio_setSpriteSpeed') +
                          blockOfType('studio_setSpriteEmotion')) +
         createCategory(msg.catEvents(),
                          blockOfType('studio_whenGameStarts') +
                          blockOfType('studio_whenLeft') +
                          blockOfType('studio_whenRight') +
                          blockOfType('studio_whenUp') +
                          blockOfType('studio_whenDown') +
                          blockOfType('studio_whenSpriteClicked') +
                          blockOfType('studio_whenSpriteCollided')) +
         createCategory(msg.catControl(),
                          blockOfType('studio_repeatForever') +
                         '<block type="controls_repeat_ext"> \
                            <value name="TIMES"> \
                              <block type="math_number"> \
                                <title name="NUM">10</title> \
                              </block> \
                            </value> \
                          </block>' +
                          blockOfType('controls_whileUntil') +
                         '<block type="controls_for"> \
                            <value name="FROM"> \
                              <block type="math_number"> \
                                <title name="NUM">1</title> \
                              </block> \
                            </value> \
                            <value name="TO"> \
                              <block type="math_number"> \
                                <title name="NUM">10</title> \
                              </block> \
                            </value> \
                            <value name="BY"> \
                              <block type="math_number"> \
                                <title name="NUM">1</title> \
                              </block> \
                            </value> \
                          </block>' +
                          blockOfType('controls_flow_statements')) +
         createCategory(msg.catLogic(),
                          blockOfType('controls_if') +
                          blockOfType('logic_compare') +
                          blockOfType('logic_operation') +
                          blockOfType('logic_negate') +
                          blockOfType('logic_boolean')) +
         createCategory(msg.catMath(),
                          blockOfType('math_number') +
                         '<block type="math_change"> \
                            <value name="DELTA"> \
                              <block type="math_number"> \
                                <title name="NUM">1</title> \
                              </block> \
                            </value> \
                          </block>' +
                         '<block type="math_random_int"> \
                            <value name="FROM"> \
                              <block type="math_number"> \
                                <title name="NUM">1</title> \
                              </block> \
                            </value> \
                            <value name="TO"> \
                              <block type="math_number"> \
                                <title name="NUM">100</title> \
                              </block> \
                            </value> \
                          </block>' +
                          blockOfType('math_arithmetic')) +
         createCategory(msg.catText(),
                          blockOfType('text') +
                          blockOfType('text_join') +
                         '<block type="text_append"> \
                            <value name="TEXT"> \
                              <block type="text"></block> \
                            </value> \
                          </block>') +
         createCategory(msg.catVariables(), '', 'VARIABLE') +
         createCategory(msg.catProcedures(), '', 'PROCEDURE')),
    'startBlocks':
     '<block type="studio_whenGameStarts" deletable="false" x="20" y="20"></block>'
  },
};

// K-1 levels:
module.exports.k1_1 = utils.extend(module.exports['1'],  {'is_k1': true});
module.exports.k1_2 = utils.extend(module.exports['7'],  {'is_k1': true});
module.exports.k1_3 = utils.extend(module.exports['2'],  {'is_k1': true});
module.exports.k1_4 = utils.extend(module.exports['3'],  {'is_k1': true});
module.exports.k1_5 = utils.extend(module.exports['8'],  {'is_k1': true});
module.exports.k1_6 = utils.extend(module.exports['4'],  {'is_k1': true});
module.exports.k1_7 = utils.extend(module.exports['9'],  {'is_k1': true});
module.exports.k1_8 = utils.extend(module.exports['10'], {'is_k1': true});
