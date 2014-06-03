/**
 * Blockly App: Studio
 *
 * Copyright 2014 Code.org
 *
 */

'use strict';

var BlocklyApps = require('../base');
var commonMsg = require('../../locale/current/common');
var studioMsg = require('../../locale/current/studio');
var skins = require('../skins');
var tiles = require('./tiles');
var codegen = require('../codegen');
var api = require('./api');
var blocks = require('./blocks');
var page = require('../templates/page.html');
var feedback = require('../feedback.js');
var dom = require('../dom');
var Sprite = require('./sprite').Sprite;

var Direction = tiles.Direction;
var NextTurn = tiles.NextTurn;
var SquareType = tiles.SquareType;
var Emotions = tiles.Emotions;

/**
 * Create a namespace for the application.
 */
var Studio = module.exports;

Studio.keyState = {};
Studio.btnState = {};

var ButtonState = {
  UP: 0,
  DOWN: 1
};

var SpriteFlags = {
  EMOTIONS: 4,
  ANIMATION: 8,
  TURNS: 16,
};

var SF_SKINS_MASK =
  SpriteFlags.EMOTIONS | SpriteFlags.ANIMATION | SpriteFlags.TURNS;

var SpriteCounts = {
  NORMAL: 1,
  ANIMATION: 1,
  TURNS: 7,
  EMOTIONS: 3,
};

var ArrowIds = {
  LEFT: 'leftButton',
  UP: 'upButton',
  RIGHT: 'rightButton',
  DOWN: 'downButton'
};

var Keycodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

var ProjectileClassNames = [
  'fireball',
  'flower'
];

var level;
var skin;
var onSharePage;

/**
 * Milliseconds between each animation frame.
 */
var stepSpeed;

//TODO: Make configurable.
BlocklyApps.CHECK_FOR_EMPTY_BLOCKS = true;

//The number of blocks to show as feedback.
BlocklyApps.NUM_REQUIRED_BLOCKS_TO_FLAG = 1;

// Default Scalings
Studio.scale = {
  'snapRadius': 1,
  'stepSpeed': 33
};

Studio.TITLE_SCREEN_TIMEOUT = 5000;
var TITLE_SCREEN_TITLE_Y_POSITION = 60; // bottom of title text
var TITLE_SCREEN_TEXT_Y_POSITION = 100; // top of text group
var TITLE_SCREEN_TEXT_SIDE_MARGIN = 20;
var TITLE_SCREEN_TEXT_LINE_HEIGHT = 24;
var TITLE_SCREEN_TEXT_MAX_LINES = 7;
var TITLE_SCREEN_TEXT_TOP_MARGIN = 5;
var TITLE_SCREEN_TEXT_V_PADDING = 15;
var TITLE_SCREEN_TEXT_WIDTH = 360;
var TITLE_SCREEN_TEXT_HEIGHT =
      TITLE_SCREEN_TEXT_TOP_MARGIN + TITLE_SCREEN_TEXT_V_PADDING +
      (TITLE_SCREEN_TEXT_MAX_LINES * TITLE_SCREEN_TEXT_LINE_HEIGHT);

var TITLE_SPRITE_X_POS = 3;
var TITLE_SPRITE_Y_POS = 6;

Studio.SPEECH_BUBBLE_TIMEOUT = 3000;
var SPEECH_BUBBLE_RADIUS = 20;
var SPEECH_BUBBLE_H_OFFSET = 50;
var SPEECH_BUBBLE_PADDING = 5;
var SPEECH_BUBBLE_SIDE_MARGIN = 10;
var SPEECH_BUBBLE_LINE_HEIGHT = 20;
var SPEECH_BUBBLE_MAX_LINES = 4;
var SPEECH_BUBBLE_TOP_MARGIN = 5;
var SPEECH_BUBBLE_WIDTH = 180;
var SPEECH_BUBBLE_HEIGHT = 20 +
      (SPEECH_BUBBLE_MAX_LINES * SPEECH_BUBBLE_LINE_HEIGHT);

var SCORE_TEXT_Y_POSITION = 60; // bottom of text

var twitterOptions = {
  text: studioMsg.shareStudioTwitter(),
  hashtag: "StudioCode"
};

var loadLevel = function() {
  // Load maps.
  Studio.map = level.map;
  Studio.timeoutFailureTick = level.timeoutFailureTick || Infinity;
  Studio.minWorkspaceHeight = level.minWorkspaceHeight;
  Studio.spriteStartingImage = level.spriteStartingImage;
  Studio.spritesHiddenToStart = level.spritesHiddenToStart;
  Studio.softButtons_ = level.softButtons || [];
  Studio.spriteFinishIndex = level.spriteFinishIndex || 0;

  // Override scalars.
  for (var key in level.scale) {
    Studio.scale[key] = level.scale[key];
  }

  // Measure maze dimensions and set sizes.
  // ROWS: Number of tiles down.
  Studio.ROWS = Studio.map.length;
  // COLS: Number of tiles across.
  Studio.COLS = Studio.map[0].length;
  // Pixel height and width of each maze square (i.e. tile).
  Studio.SQUARE_SIZE = 50;
  Studio.SPRITE_HEIGHT = skin.spriteHeight;
  Studio.SPRITE_WIDTH = skin.spriteWidth;
  Studio.SPRITE_Y_OFFSET = skin.spriteYOffset;
  // Height and width of the goal and obstacles.
  Studio.MARKER_HEIGHT = 100;
  Studio.MARKER_WIDTH = 100;

  Studio.MAZE_WIDTH = Studio.SQUARE_SIZE * Studio.COLS;
  Studio.MAZE_HEIGHT = Studio.SQUARE_SIZE * Studio.ROWS;
};

var drawMap = function() {
  var svg = document.getElementById('svgStudio');
  var i, x, y, k;

  // Adjust outer element size.
  svg.setAttribute('width', Studio.MAZE_WIDTH);
  svg.setAttribute('height', Studio.MAZE_HEIGHT);

  // Attach click handler.
  dom.addMouseDownTouchEvent(svg, Studio.onSvgClicked);

  // Adjust visualization and belowVisualization width.
  var visualization = document.getElementById('visualization');
  visualization.style.width = Studio.MAZE_WIDTH + 'px';
  var belowVisualization = document.getElementById('belowVisualization');
  belowVisualization.style.width = Studio.MAZE_WIDTH + 'px';
  if (!BlocklyApps.noPadding &&
      (Studio.minWorkspaceHeight > Studio.MAZE_HEIGHT)) {
    belowVisualization.style.minHeight =
      (Studio.minWorkspaceHeight - Studio.MAZE_HEIGHT) + 'px';
  }

  // Adjust button table width.
  var buttonTable = document.getElementById('gameButtons');
  buttonTable.style.width = Studio.MAZE_WIDTH + 'px';

  var hintBubble = document.getElementById('bubble');
  hintBubble.style.width = Studio.MAZE_WIDTH + 'px';

  if (skin.background) {
    var tile = document.createElementNS(Blockly.SVG_NS, 'image');
    tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                        skin.background);
    tile.setAttribute('id', 'background');
    tile.setAttribute('height', Studio.MAZE_HEIGHT);
    tile.setAttribute('width', Studio.MAZE_WIDTH);
    tile.setAttribute('x', 0);
    tile.setAttribute('y', 0);
    svg.appendChild(tile);
  }

  if (Studio.spriteStart_) {
    for (i = 0; i < Studio.spriteCount; i++) {
      // Sprite clipPath element, whose (x, y) is reset by Studio.displaySprite
      var spriteClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      spriteClip.setAttribute('id', 'spriteClipPath' + i);
      var spriteClipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      spriteClipRect.setAttribute('id', 'spriteClipRect' + i);
      spriteClipRect.setAttribute('width', Studio.SPRITE_WIDTH);
      spriteClipRect.setAttribute('height', Studio.SPRITE_HEIGHT);
      spriteClip.appendChild(spriteClipRect);
      svg.appendChild(spriteClip);

      // Add sprite (not setting href attribute or width until displaySprite).
      var spriteIcon = document.createElementNS(Blockly.SVG_NS, 'image');
      spriteIcon.setAttribute('id', 'sprite' + i);
      spriteIcon.setAttribute('height', Studio.SPRITE_HEIGHT);
      spriteIcon.setAttribute('clip-path', 'url(#spriteClipPath' + i + ')');
      svg.appendChild(spriteIcon);

      dom.addMouseDownTouchEvent(spriteIcon,
                                 delegate(this,
                                          Studio.onSpriteClicked,
                                          i));
    }
    for (i = 0; i < Studio.spriteCount; i++) {
      var spriteSpeechBubble = document.createElementNS(Blockly.SVG_NS, 'g');
      spriteSpeechBubble.setAttribute('id', 'speechBubble' + i);
      spriteSpeechBubble.setAttribute('visibility', 'hidden');

      var speechRect = document.createElementNS(Blockly.SVG_NS, 'path');
      speechRect.setAttribute('id', 'speechBubblePath' + i);
      speechRect.setAttribute('class', 'studio-speech-bubble-path');

      var speechText = document.createElementNS(Blockly.SVG_NS, 'text');
      speechText.setAttribute('id', 'speechBubbleText' + i);
      speechText.setAttribute('class', 'studio-speech-bubble');

      spriteSpeechBubble.appendChild(speechRect);
      spriteSpeechBubble.appendChild(speechText);
      svg.appendChild(spriteSpeechBubble);
    }
  }

  if (Studio.spriteFinish_) {
    for (i = 0; i < Studio.spriteFinishCount; i++) {
      // Add finish markers.
      var spriteFinishMarker = document.createElementNS(
          Blockly.SVG_NS,
          'image');
      spriteFinishMarker.setAttribute('id', 'spriteFinish' + i);
      spriteFinishMarker.setAttributeNS('http://www.w3.org/1999/xlink',
                                        'xlink:href',
                                        skin.goal);
      spriteFinishMarker.setAttribute('height', Studio.MARKER_HEIGHT);
      spriteFinishMarker.setAttribute('width', Studio.MARKER_WIDTH);
      svg.appendChild(spriteFinishMarker);
    }
  }

  var score = document.createElementNS(Blockly.SVG_NS, 'text');
  score.setAttribute('id', 'score');
  score.setAttribute('class', 'studio-score');
  score.setAttribute('x', Studio.MAZE_WIDTH / 2);
  score.setAttribute('y', SCORE_TEXT_Y_POSITION);
  score.appendChild(document.createTextNode(''));
  score.setAttribute('visibility', 'hidden');
  svg.appendChild(score);

  var titleScreenTitle = document.createElementNS(Blockly.SVG_NS, 'text');
  titleScreenTitle.setAttribute('id', 'titleScreenTitle');
  titleScreenTitle.setAttribute('class', 'studio-ts-title');
  titleScreenTitle.setAttribute('x', Studio.MAZE_WIDTH / 2);
  titleScreenTitle.setAttribute('y', TITLE_SCREEN_TITLE_Y_POSITION);
  titleScreenTitle.appendChild(document.createTextNode(''));
  titleScreenTitle.setAttribute('visibility', 'hidden');
  svg.appendChild(titleScreenTitle);

  var titleScreenTextGroup = document.createElementNS(Blockly.SVG_NS, 'g');
  var xPosTextGroup = (Studio.MAZE_WIDTH - TITLE_SCREEN_TEXT_WIDTH) / 2;
  titleScreenTextGroup.setAttribute('id', 'titleScreenTextGroup');
  titleScreenTextGroup.setAttribute('x', xPosTextGroup);
  titleScreenTextGroup.setAttribute('y', TITLE_SCREEN_TEXT_Y_POSITION);
  titleScreenTextGroup.setAttribute(
      'transform',
      'translate(' + xPosTextGroup + ',' + TITLE_SCREEN_TEXT_Y_POSITION + ')');
  titleScreenTextGroup.setAttribute('visibility', 'hidden');

  var titleScreenTextRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  titleScreenTextRect.setAttribute('id', 'titleScreenTextRect');
  titleScreenTextRect.setAttribute('x', 0);
  titleScreenTextRect.setAttribute('y', 0);
  titleScreenTextRect.setAttribute('width', TITLE_SCREEN_TEXT_WIDTH);
  titleScreenTextRect.setAttribute('class', 'studio-ts-text-rect');

  var titleScreenText = document.createElementNS(Blockly.SVG_NS, 'text');
  titleScreenText.setAttribute('id', 'titleScreenText');
  titleScreenText.setAttribute('class', 'studio-ts-text');
  titleScreenText.setAttribute('x', TITLE_SCREEN_TEXT_WIDTH / 2);
  titleScreenText.setAttribute('y', 0);
  titleScreenText.appendChild(document.createTextNode(''));

  titleScreenTextGroup.appendChild(titleScreenTextRect);
  titleScreenTextGroup.appendChild(titleScreenText);
  svg.appendChild(titleScreenTextGroup);
};

var essentiallyEqual = function(float1, float2, opt_variance) {
  var variance = opt_variance || 0.01;
  return (Math.abs(float1 - float2) < variance);
};

/**
 * @param scope Object :  The scope in which to execute the delegated function.
 * @param func Function : The function to execute
 * @param data Object or Array : The data to pass to the function. If the function is also passed arguments, the data is appended to the arguments list. If the data is an Array, each item is appended as a new argument.
 */
var delegate = function(scope, func, data)
{
  return function()
  {
    var args = Array.prototype.slice.apply(arguments).concat(data);
    func.apply(scope, args);
  };
};

var calcMoveDistanceFromQueues = function (index, yAxis, modifyQueues) {
  var totalDistance = 0;

  Studio.eventHandlers.forEach(function (handler) {
    var cmd = handler.cmdQueue ? handler.cmdQueue[0] : null;
    if (cmd && cmd.name === 'moveDistance' && cmd.opts.spriteIndex === index) {
      var scaleFactor;
      var distThisMove = Math.min(cmd.opts.queuedDistance,
                                  Studio.sprite[cmd.opts.spriteIndex].speed);
      switch (cmd.opts.dir) {
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
      if (modifyQueues && (0 !== scaleFactor)) {
        cmd.opts.queuedDistance -= distThisMove;
        if ("0.00" === Math.abs(cmd.opts.queuedDistance).toFixed(2)) {
          cmd.opts.queuedDistance = 0;
        }
      }
      totalDistance += distThisMove * scaleFactor;
    }
  });

  return totalDistance;
};


var cancelQueuedMovements = function (index, yAxis) {
  Studio.eventHandlers.forEach(function (handler) {
    var cmd = handler.cmdQueue ? handler.cmdQueue[0] : null;
    if (cmd && cmd.name === 'moveDistance' && cmd.opts.spriteIndex === index) {
      var dir = cmd.opts.dir;
      if (yAxis && (dir === Direction.NORTH || dir === Direction.SOUTH)) {
        cmd.opts.queuedDistance = 0;
      } else if (!yAxis && (dir === Direction.EAST || dir === Direction.WEST)) {
        cmd.opts.queuedDistance = 0;
      }
    }
  });
};

//
// Return the next position for this sprite on a given coordinate axis
// given the queued moves (yAxis == false means xAxis)
// NOTE: position values returned are not clamped to playspace boundaries
//

var getNextPosition = function (i, yAxis, modifyQueues) {
  var curPos = yAxis ? Studio.sprite[i].y : Studio.sprite[i].x;
  return curPos + calcMoveDistanceFromQueues(i, yAxis, modifyQueues);
};

//
// Perform Queued Moves in the X and Y axes (called from inside onTick)
//
var performQueuedMoves = function (i) {
  // Make queued moves in the X axis (fixed to .01 values):
  var nextX = getNextPosition(i, false, true);
  // Clamp nextX to boundaries as newX:
  var newX = Math.min(Studio.COLS - 2, Math.max(0, nextX));
  if (nextX != newX) {
    cancelQueuedMovements(i, false);
  }
  Studio.sprite[i].x = newX;

  // Make queued moves in the Y axis (fixed to .01 values):
  var nextY = getNextPosition(i, true, true);
  // Clamp nextY to boundaries as newY:
  var newY = Math.min(Studio.ROWS - 2, Math.max(0, nextY));
  if (nextY != newY) {
    cancelQueuedMovements(i, true);
  }
  Studio.sprite[i].y = newY;
};

//
// Set text into SVG text tspan elements (manual word wrapping)
// Thanks http://stackoverflow.com/questions/
//        7046986/svg-using-getcomputedtextlength-to-wrap-text
//
// opts.svgText: existing svg 'text' element
// opts.text: full-length text string
// opts.width: total width
// opts.fullHeight: total height (fits maxLines of text)
// opts.maxLines: max number of text lines
// opts.lineHeight: height per line of text
// opts.topMargin: top margin
// opts.sideMargin: left & right margin (deducted from total width)
//

var setSvgText = function(opts) {
  // Remove any children from the svgText node:
  while (opts.svgText.firstChild) {
    opts.svgText.removeChild(opts.svgText.firstChild);
  }

  var words = opts.text.split(' ');
  // Create first tspan element
  var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
  tspan.setAttribute("x", opts.width / 2);
  tspan.setAttribute("dy", opts.lineHeight + opts.topMargin);
  // Create text in tspan element
  var text_node = document.createTextNode(words[0]);

  // Add text to tspan element
  tspan.appendChild(text_node);
  // Add tspan element to DOM
  opts.svgText.appendChild(tspan);
  var tSpansAdded = 1;

  for (var i = 1; i < words.length; i++) {
    // Find number of letters in string
    var len = tspan.firstChild.data.length;
    // Add next word
    tspan.firstChild.data += " " + words[i];

    if (tspan.getComputedTextLength() >
        opts.width - 2 * opts.sideMargin) {
      // Remove added word
      tspan.firstChild.data = tspan.firstChild.data.slice(0, len);

      if (opts.maxLines === tSpansAdded) {
        return opts.fullHeight;
      }
      // Create new tspan element
      tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute("x", opts.width / 2);
      tspan.setAttribute("dy", opts.lineHeight);
      text_node = document.createTextNode(words[i]);
      tspan.appendChild(text_node);
      opts.svgText.appendChild(tspan);
      tSpansAdded++;
    }
  }
  var linesLessThanMax = opts.maxLines - Math.max(1, tSpansAdded);
  return opts.fullHeight - linesLessThanMax * opts.lineHeight;
};

//
// Execute the code for all of the event handlers that match an event name
//

var callHandler = function (name, allowQueueExtension) {
  Studio.eventHandlers.forEach(function (handler) {
    // Note: we skip executing the code if we have not completed executing
    // the cmdQueue on this handler (checking for non-zero length)
    if (handler.name === name &&
        (allowQueueExtension ||
         (!handler.cmdQueue || 0 === handler.cmdQueue.length))) {
      if (!handler.cmdQueue) {
        handler.cmdQueue = [];
      }
      Studio.currentCmdQueue = handler.cmdQueue;
      try { handler.func(BlocklyApps, api, Studio.Globals); } catch (e) { }
      Studio.currentCmdQueue = null;
    }
  });
};

Studio.onTick = function() {
  Studio.tickCount++;

  if (Studio.tickCount === 1) {
    callHandler('whenGameStarts');
  }
  Studio.executeQueue('whenGameStarts');

  callHandler('repeatForever');
  Studio.executeQueue('repeatForever');

  for (var i = 0; i < Studio.spriteCount; i++) {
    Studio.executeQueue('whenSpriteClicked-' + i);
  }

  // Run key event handlers for any keys that are down:
  for (var key in Keycodes) {
    if (Studio.keyState[Keycodes[key]] &&
        Studio.keyState[Keycodes[key]] == "keydown") {
      switch (Keycodes[key]) {
        case Keycodes.LEFT:
          callHandler('whenLeft');
          break;
        case Keycodes.UP:
          callHandler('whenUp');
          break;
        case Keycodes.RIGHT:
          callHandler('whenRight');
          break;
        case Keycodes.DOWN:
          callHandler('whenDown');
          break;
      }
    }
  }

  for (var btn in ArrowIds) {
    if (Studio.btnState[ArrowIds[btn]] &&
        Studio.btnState[ArrowIds[btn]] == ButtonState.DOWN) {
      switch (ArrowIds[btn]) {
        case ArrowIds.LEFT:
          callHandler('whenLeft');
          break;
        case ArrowIds.UP:
          callHandler('whenUp');
          break;
        case ArrowIds.RIGHT:
          callHandler('whenRight');
          break;
        case ArrowIds.DOWN:
          callHandler('whenDown');
          break;
      }
    }
  }

  Studio.executeQueue('whenLeft');
  Studio.executeQueue('whenUp');
  Studio.executeQueue('whenRight');
  Studio.executeQueue('whenDown');

  // Check for collisions (note that we use the positions they are about
  // to attain with queued moves - this allows the moves to be canceled before
  // the actual movements take place):
  for (i = 0; i < Studio.spriteCount; i++) {
    var nextXPos_i = getNextPosition(i, false, false);
    var nextYPos_i = getNextPosition(i, true, false);
    for (var j = 0; j < Studio.spriteCount; j++) {
      if (i == j) {
        continue;
      }
      if (essentiallyEqual(nextXPos_i,
                           getNextPosition(j, false, false),
                           tiles.SPRITE_COLLIDE_DISTANCE) &&
          essentiallyEqual(nextYPos_i,
                           getNextPosition(j, true, false),
                           tiles.SPRITE_COLLIDE_DISTANCE)) {
        if (0 === (Studio.sprite[i].collisionMask & Math.pow(2, j))) {
          Studio.sprite[i].collisionMask |= Math.pow(2, j);
          callHandler('whenSpriteCollided-' + i + '-' + j);
        }
      } else {
          Studio.sprite[i].collisionMask &= ~(Math.pow(2, j));
      }
      Studio.executeQueue('whenSpriteCollided-' + i + '-' + j);
    }
    var xCenter = nextXPos_i + 1;
    var yCenter = nextYPos_i + 1;
    for (j = 0; j < Studio.projectiles.length; j++) {
      if (essentiallyEqual(xCenter,
                           Studio.projectiles[j].getNextPosition(false),
                           tiles.PROJECTILE_COLLIDE_DISTANCE) &&
          essentiallyEqual(yCenter,
                           Studio.projectiles[j].getNextPosition(true),
                           tiles.PROJECTILE_COLLIDE_DISTANCE)) {
        if (Studio.projectiles[j].startCollision(i)) {
          Studio.currentEventParams = { projectile: Studio.projectiles[j] };
          // Allow cmdQueue extension (pass true) since this handler
          // may be called for multiple projectiles before executing the queue
          // below
          callHandler('whenSpriteCollided-' + i + '-' +
                        Studio.projectiles[j].className,
                      true);
          Studio.currentEventParams = null;
        }
      } else {
        Studio.projectiles[j].markNotColliding(i);
      }
    }
    ProjectileClassNames.forEach(
      function (className) {
        Studio.executeQueue('whenSpriteCollided-' + i + '-' + className);
      }
    );
  }

  for (i = 0; i < Studio.spriteCount; i++) {
    performQueuedMoves(i);

    // Display sprite:
    Studio.displaySprite(i);
  }

  for (i = 0; i < Studio.projectiles.length; i++) {
    Studio.projectiles[i].moveToNextPosition();
    if (Studio.projectiles[i].outOfBounds()) {
      Studio.projectiles[i].removeElement();
      Studio.projectiles.splice(i, 1);
      // decrement i because we just removed an item from the array. We want to
      // keep i as the same value for the next iteration through this loop
      i--;
    } else {
      Studio.projectiles[i].display();
    }
  }

  if (checkFinished()) {
    Studio.onPuzzleComplete();
  }
};

Studio.onKey = function(e) {
  // Store the most recent event type per-key
  Studio.keyState[e.keyCode] = e.type;

  // If we are actively running our tick loop, suppress default event handling
  if (Studio.intervalId &&
      e.keyCode >= Keycodes.LEFT && e.keyCode <= Keycodes.DOWN) {
    e.preventDefault();
  }
};

Studio.onArrowButtonDown = function(e, idBtn) {
  // Store the most recent event type per-button
  Studio.btnState[idBtn] = ButtonState.DOWN;
  e.preventDefault();  // Stop normal events so we see mouseup later.
};

Studio.onSpriteClicked = function(e, spriteIndex) {
  // If we are "running", call the event handler if registered.
  if (Studio.intervalId) {
    callHandler('whenSpriteClicked-' + spriteIndex);
  }
  e.preventDefault();  // Stop normal events.
};

Studio.onSvgClicked = function(e) {
  // If we are "running", check the cmdQueues.
  if (Studio.intervalId) {
    // Check the first command in all of the cmdQueues to see if there is a
    // pending "wait for click" command
    Studio.eventHandlers.forEach(function (handler) {
      var cmd = handler.cmdQueue ? handler.cmdQueue[0] : null;

      if (cmd && cmd.opts.waitForClick && !cmd.opts.complete) {
        if (cmd.opts.waitCallback) {
          cmd.opts.waitCallback();
        }
        cmd.opts.complete = true;
      }
    });
  }
  e.preventDefault();  // Stop normal events.
};

Studio.onArrowButtonUp = function(e, idBtn) {
  // Store the most recent event type per-button
  Studio.btnState[idBtn] = ButtonState.UP;
};

Studio.onMouseUp = function(e) {
  // Reset btnState on mouse up
  Studio.btnState = {};
};

/**
 * Initialize Blockly and the Studio app.  Called on page load.
 */
Studio.init = function(config) {
  Studio.clearEventHandlersKillTickLoop();
  skin = config.skin;
  level = config.level;
  onSharePage = config.share;
  loadLevel();

  window.addEventListener("keydown", Studio.onKey, false);
  window.addEventListener("keyup", Studio.onKey, false);

  config.html = page({
    assetUrl: BlocklyApps.assetUrl,
    data: {
      localeDirection: BlocklyApps.localeDirection(),
      visualization: require('./visualization.html')(),
      controls: require('./controls.html')({assetUrl: BlocklyApps.assetUrl}),
      extraControlRows:
          require('./extraControlRows.html')({assetUrl: BlocklyApps.assetUrl}),
      blockUsed: undefined,
      idealBlockNumber: undefined,
      blockCounterClass: 'block-counter-default'
    }
  });

  config.loadAudio = function() {
    Blockly.loadAudio_(skin.winSound, 'win');
    Blockly.loadAudio_(skin.startSound, 'start');
    Blockly.loadAudio_(skin.failureSound, 'failure');
    Blockly.loadAudio_(skin.rubberSound, 'rubber');
    Blockly.loadAudio_(skin.crunchSound, 'crunch');
    Blockly.loadAudio_(skin.flagSound, 'flag');
    Blockly.loadAudio_(skin.winPointSound, 'winpoint');
    Blockly.loadAudio_(skin.winPoint2Sound, 'winpoint2');
    Blockly.loadAudio_(skin.losePointSound, 'losepoint');
    Blockly.loadAudio_(skin.losePoint2Sound, 'losepoint2');
    Blockly.loadAudio_(skin.goal1Sound, 'goal1');
    Blockly.loadAudio_(skin.goal2Sound, 'goal2');
    Blockly.loadAudio_(skin.woodSound, 'wood');
    Blockly.loadAudio_(skin.retroSound, 'retro');
    Blockly.loadAudio_(skin.slapSound, 'slap');
    Blockly.loadAudio_(skin.hitSound, 'hit');
  };

  config.afterInject = function() {
    // Connect up arrow button event handlers
    for (var btn in ArrowIds) {
      dom.addClickTouchEvent(document.getElementById(ArrowIds[btn]),
                             delegate(this,
                                      Studio.onArrowButtonUp,
                                      ArrowIds[btn]));
      dom.addMouseDownTouchEvent(document.getElementById(ArrowIds[btn]),
                                 delegate(this,
                                          Studio.onArrowButtonDown,
                                          ArrowIds[btn]));
    }
    document.addEventListener('mouseup', Studio.onMouseUp, false);

    /**
     * The richness of block colours, regardless of the hue.
     * MOOC blocks should be brighter (target audience is younger).
     * Must be in the range of 0 (inclusive) to 1 (exclusive).
     * Blockly's default is 0.45.
     */
    Blockly.HSV_SATURATION = 0.6;

    Blockly.SNAP_RADIUS *= Studio.scale.snapRadius;

    drawMap();
  };

  config.getDisplayWidth = function() {
    var visualization = document.getElementById('visualization');
    return visualization.getBoundingClientRect().width;
  };

  // TODO: update this for Studio
  // Block placement default (used as fallback in the share levels)
  config.blockArrangement = {
    'studio_whenGameStarts': { x: 20, y: 20},
    'studio_whenLeft': { x: 20, y: 110},
    'studio_whenRight': { x: 180, y: 110},
  };

  config.twitter = twitterOptions;

  // for this app, show make your own button if on share page
  config.makeYourOwn = config.share;

  config.makeString = studioMsg.makeYourOwn();
  config.makeUrl = "http://code.org/studio";
  config.makeImage = BlocklyApps.assetUrl('media/promo.png');

  config.enableShowCode = false;
  config.varsInGlobals = true;
  config.enableShowBlockCount = false;

  config.preventExtraTopLevelBlocks = true;

  Studio.spriteFinishCount = 0;
  Studio.spriteCount = 0;
  Studio.sprite = [];
  Studio.projectiles = [];

  // Locate the start and finish squares.
  for (var y = 0; y < Studio.ROWS; y++) {
    for (var x = 0; x < Studio.COLS; x++) {
      if (Studio.map[y][x] & SquareType.SPRITEFINISH) {
        if (0 === Studio.spriteFinishCount) {
          Studio.spriteFinish_ = [];
        }
        Studio.spriteFinish_[Studio.spriteFinishCount] = {x: x, y: y};
        Studio.spriteFinishCount++;
      } else if (Studio.map[y][x] & SquareType.SPRITESTART) {
        if (0 === Studio.spriteCount) {
          Studio.spriteStart_ = [];
        }
        Studio.sprite[Studio.spriteCount] = [];
        Studio.spriteStart_[Studio.spriteCount] = {x: x, y: y};
        Studio.spriteCount++;
      }
    }
  }

  // Update the sprite count in the blocks:
  blocks.setSpriteCount(Blockly, Studio.spriteCount);

  if (level.enableProjectileCollisions) {
    blocks.enableProjectileCollisions(Blockly);
  }

  BlocklyApps.init(config);

  if (!onSharePage) {
    var shareButton = document.getElementById('shareButton');
    dom.addClickTouchEvent(shareButton, Studio.onPuzzleComplete);
  }
};

/**
 * Clear the event handlers and stop the onTick timer.
 */
Studio.clearEventHandlersKillTickLoop = function() {
  if (Studio.eventHandlers) {
    // Check the first command in all of the cmdQueues and clear the timeout
    // if there is a pending wait command
    Studio.eventHandlers.forEach(function (handler) {
      var cmd = handler.cmdQueue ? handler.cmdQueue[0] : null;

      if (cmd && cmd.opts.waitTimeout && !cmd.opts.complete) {
        // Note: not calling waitCallback() or setting complete = true
        window.clearTimeout(cmd.opts.waitTimeout);
      }
    });
  }
  Studio.eventHandlers = [];
  if (Studio.intervalId) {
    window.clearInterval(Studio.intervalId);
  }
  Studio.intervalId = 0;
  for (var i = 0; i < Studio.spriteCount; i++) {
    window.clearTimeout(Studio.sprite[i].bubbleTimeout);
  }
};

/**
 * Reset the app to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
BlocklyApps.reset = function(first) {
  var i;
  Studio.clearEventHandlersKillTickLoop();

  // Soft buttons
  var softButtonCount = 0;
  for (i = 0; i < Studio.softButtons_.length; i++) {
    document.getElementById(Studio.softButtons_[i]).style.display = 'inline';
    softButtonCount++;
  }
  if (softButtonCount) {
    var softButtonsCell = document.getElementById('soft-buttons');
    softButtonsCell.className = 'soft-buttons-' + softButtonCount;
  }

  // Reset the dynamic sprites list
  var projectile;
  while (projectile = Studio.projectiles.pop()) {
    projectile.removeElement();
  }

  // Reset the score and title screen.
  Studio.playerScore = 0;
  Studio.opponentScore = 0;
  Studio.scoreText = null;
  document.getElementById('score')
    .setAttribute('visibility', 'hidden');
  document.getElementById('titleScreenTitle')
    .setAttribute('visibility', 'hidden');
  document.getElementById('titleScreenTextGroup')
    .setAttribute('visibility', 'hidden');

  // Reset configurable variables
  Studio.setBackground({'value': 'cave'});

  // Reset currentCmdQueue and various counts:
  Studio.currentCmdQueue = null;
  Studio.sayComplete = 0;
  Studio.playSoundCount = 0;

  // Reset the Globals object used to contain program variables:
  Studio.Globals = [];

  var spriteStartingSkins = [ "dog", "cat", "penguin", "dinosaur", "octopus",
                              "witch" ];
  var numStartingSkins = spriteStartingSkins.length;
  var skinBias = Studio.spriteStartingImage || 0;

  // Move sprites into position.
  for (i = 0; i < Studio.spriteCount; i++) {
    Studio.sprite[i].x = Studio.spriteStart_[i].x;
    Studio.sprite[i].y = Studio.spriteStart_[i].y;
    Studio.sprite[i].speed = tiles.DEFAULT_SPRITE_SPEED;
    Studio.sprite[i].collisionMask = 0;
    Studio.sprite[i].flags = 0;
    Studio.sprite[i].dir = Direction.NONE;
    Studio.sprite[i].displayDir = Direction.SOUTH;
    Studio.sprite[i].emotion = Emotions.NORMAL;

    var opts = {
        'index': i,
        'value': spriteStartingSkins[(i + skinBias) % numStartingSkins]
    };
    if (Studio.spritesHiddenToStart) {
      opts.forceHidden = true;
    }
    Studio.setSprite(opts);
    Studio.displaySprite(i);
    document.getElementById('speechBubble' + i)
      .setAttribute('visibility', 'hidden');
  }

  var svg = document.getElementById('svgStudio');

  if (Studio.spriteFinish_) {
    for (i = 0; i < Studio.spriteFinishCount; i++) {
      // Mark each finish as incomplete.
      Studio.spriteFinish_[i].finished = false;

      // Move the finish icons into position.
      var spriteFinishIcon = document.getElementById('spriteFinish' + i);
      spriteFinishIcon.setAttribute(
          'x',
          Studio.SQUARE_SIZE * Studio.spriteFinish_[i].x);
      spriteFinishIcon.setAttribute(
          'y',
          Studio.SQUARE_SIZE * Studio.spriteFinish_[i].y);
      spriteFinishIcon.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'xlink:href',
          skin.goal);
    }
  }
};

/**
 * Click the run button.  Start the program.
 */
// XXX This is the only method used by the templates!
BlocklyApps.runButtonClick = function() {
  // Only allow a single top block on some levels.
  if (level.singleTopBlock &&
      Blockly.mainWorkspace.getTopBlocks().length > 1) {
    window.alert(commonMsg.oneTopBlock());
    return;
  }
  var runButton = document.getElementById('runButton');
  var resetButton = document.getElementById('resetButton');
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + 'px';
  }
  runButton.style.display = 'none';
  resetButton.style.display = 'inline';
  Blockly.mainWorkspace.traceOn(true);
  BlocklyApps.reset(false);
  BlocklyApps.attempts++;
  Studio.execute();

  if (level.freePlay && !onSharePage) {
    var shareCell = document.getElementById('share-cell');
    shareCell.className = 'share-cell-enabled';
  }

  if (level.showZeroZeroScore) {
    Studio.displayScore();
  }
};

/**
 * Outcomes of running the user program.
 */
var ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2
};

/**
 * App specific displayFeedback function that calls into
 * BlocklyApps.displayFeedback when appropriate
 */
var displayFeedback = function() {
  if (!Studio.waitingForReport) {
    BlocklyApps.displayFeedback({
      app: 'studio', //XXX
      skin: skin.id,
      feedbackType: Studio.testResults,
      response: Studio.response,
      level: level,
      showingSharing: level.freePlay,
      twitter: twitterOptions,
      appStrings: {
        reinfFeedbackMsg: studioMsg.reinfFeedbackMsg(),
        sharingText: studioMsg.shareGame()
      }
    });
  }
};

/**
 * Function to be called when the service report call is complete
 * @param {object} JSON response (if available)
 */
Studio.onReportComplete = function(response) {
  Studio.response = response;
  Studio.waitingForReport = false;
  displayFeedback();
};

var registerEventHandler = function (handlers, name, func) {
  handlers.push({'name': name, 'func': func});
};

var registerHandlers =
      function (handlers, blockName, eventNameBase,
                nameParam1, matchParam1Val,
                nameParam2, matchParam2Val) {
  var blocks = Blockly.mainWorkspace.getTopBlocks();
  for (var x = 0; blocks[x]; x++) {
    var block = blocks[x];
    if (block.type === blockName &&
        (!nameParam1 ||
         matchParam1Val === block.getTitleValue(nameParam1)) &&
        (!nameParam2 ||
         matchParam2Val === block.getTitleValue(nameParam2))) {
      var code = Blockly.Generator.blocksToCode('JavaScript', [ block ]);
      if (code) {
        var func = codegen.functionFromCode(code, {
                                            BlocklyApps: BlocklyApps,
                                            Studio: api,
                                            Globals: Studio.Globals } );
        var eventName = eventNameBase;
        if (nameParam1) {
          eventName += '-' + matchParam1Val;
        }
        if (nameParam2) {
          eventName += '-' + matchParam2Val;
        }
        registerEventHandler(handlers, eventName, func);
      }
    }
  }
};

var registerHandlersWithSpriteParam =
      function (handlers, blockName, eventNameBase, blockParam) {
  for (var i = 0; i < Studio.spriteCount; i++) {
    registerHandlers(handlers, blockName, eventNameBase, blockParam, i);
  }
};

var registerHandlersWithSpriteParams =
      function (handlers, blockName, eventNameBase, blockParam1, blockParam2) {
  for (var i = 0; i < Studio.spriteCount; i++) {
    for (var j = 0; j < Studio.spriteCount; j++) {
      if (i === j) {
        continue;
      }
      registerHandlers(handlers,
                       blockName,
                       eventNameBase,
                       blockParam1,
                       String(i),
                       blockParam2,
                       String(j));
    }
    ProjectileClassNames.forEach(
      function (className) {
        registerHandlers(handlers,
                         blockName,
                         eventNameBase,
                         blockParam1,
                         String(i),
                         blockParam2,
                         className);
      }
    );
  }
};

//
// Generates code with user-generated function definitions and evals that code
// so these can be called from event handlers. This should be called for each
// block type that defines functions.
//

var defineProcedures = function (blockType) {
  var code = Blockly.Generator.workspaceToCode('JavaScript', blockType);
  try { codegen.evalWith(code, {
                         BlocklyApps: BlocklyApps,
                         Studio: api,
                         Globals: Studio.Globals } ); } catch (e) { }
};

/**
 * Execute the story
 */
Studio.execute = function() {
  var code;
  Studio.result = ResultType.UNSET;
  Studio.testResults = BlocklyApps.TestResults.NO_TESTS_RUN;
  Studio.waitingForReport = false;
  Studio.response = null;
  Blockly.Blocks.studio_firstSetSprite = null;
  var i;

  if (level.editCode) {
    var codeTextbox = document.getElementById('codeTextbox');
    code = dom.getText(codeTextbox);
    // Insert aliases from level codeBlocks into code
    if (level.codeFunctions) {
      for (i = 0; i < level.codeFunctions.length; i++) {
        var codeFunction = level.codeFunctions[i];
        if (codeFunction.alias) {
          code = codeFunction.func +
              " = function() { " + codeFunction.alias + " };" + code;
        }
      }
    }
  }

  var handlers = [];
  registerHandlers(handlers, 'studio_whenGameStarts', 'whenGameStarts');
  registerHandlers(handlers, 'studio_whenLeft', 'whenLeft');
  registerHandlers(handlers, 'studio_whenRight', 'whenRight');
  registerHandlers(handlers, 'studio_whenUp', 'whenUp');
  registerHandlers(handlers, 'studio_whenDown', 'whenDown');
  registerHandlers(handlers, 'studio_repeatForever', 'repeatForever');
  registerHandlersWithSpriteParam(handlers,
                                  'studio_whenSpriteClicked',
                                  'whenSpriteClicked',
                                  'SPRITE');
  registerHandlersWithSpriteParams(handlers,
                                   'studio_whenSpriteCollided',
                                   'whenSpriteCollided',
                                   'SPRITE1',
                                   'SPRITE2');

  BlocklyApps.playAudio('start', {volume: 0.5});

  BlocklyApps.reset(false);

  // Define any top-level procedures the user may have created
  // (must be after reset(), which resets the Studio.Globals namespace)
  defineProcedures('procedures_defreturn');
  defineProcedures('procedures_defnoreturn');

  // Set event handlers and start the onTick timer
  Studio.eventHandlers = handlers;
  Studio.tickCount = 0;
  Studio.intervalId = window.setInterval(Studio.onTick, Studio.scale.stepSpeed);
};

Studio.onPuzzleComplete = function() {
  if (level.freePlay) {
    Studio.result = ResultType.SUCCESS;
  }

  // Stop everything on screen
  Studio.clearEventHandlersKillTickLoop();

  // If we know they succeeded, mark levelComplete true
  // Note that we have not yet animated the succesful run
  BlocklyApps.levelComplete = (Studio.result == ResultType.SUCCESS);

  // If the current level is a free play, always return the free play
  // result type
  if (level.freePlay) {
    Studio.testResults = BlocklyApps.TestResults.FREE_PLAY;
  } else {
    Studio.testResults = BlocklyApps.getTestResults();
  }

  if (Studio.testResults >= BlocklyApps.TestResults.FREE_PLAY) {
    BlocklyApps.playAudio('win', {volume : 0.5});
  } else {
    BlocklyApps.playAudio('failure', {volume : 0.5});
  }

  if (level.editCode) {
    Studio.testResults = BlocklyApps.levelComplete ?
      BlocklyApps.TestResults.ALL_PASS :
      BlocklyApps.TestResults.TOO_FEW_BLOCKS_FAIL;
  }

  if (level.failForOther1Star && !BlocklyApps.levelComplete) {
    Studio.testResults = BlocklyApps.TestResults.OTHER_1_STAR_FAIL;
  }

  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var textBlocks = Blockly.Xml.domToText(xml);

  Studio.waitingForReport = true;

  // Report result to server.
  BlocklyApps.report({
                     app: 'studio',
                     level: level.id,
                     result: Studio.result === ResultType.SUCCESS,
                     testResult: Studio.testResults,
                     program: encodeURIComponent(textBlocks),
                     onComplete: Studio.onReportComplete
                     });
};

var frameDirTable = {};
frameDirTable[Direction.SOUTHEAST]  = 0;
frameDirTable[Direction.EAST]       = 1;
frameDirTable[Direction.NORTHEAST]  = 2;
frameDirTable[Direction.NORTH]      = 3;
frameDirTable[Direction.NORTHWEST]  = 4;
frameDirTable[Direction.WEST]       = 5;
frameDirTable[Direction.SOUTHWEST]  = 6;

var ANIM_RATE = 6;
var ANIM_OFFSET = 7; // Each sprite animates at a slightly different time
var ANIM_AFTER_NUM_NORMAL_FRAMES = 8;

var spriteFrameNumber = function (index) {
  var sprite = Studio.sprite[index];
  var showThisAnimFrame = 0;
  if ((sprite.flags & SpriteFlags.TURNS) &&
      (sprite.displayDir !== Direction.SOUTH)) {
    return sprite.firstTurnFrameNum + frameDirTable[sprite.displayDir];
  }
  if ((sprite.flags & SpriteFlags.ANIMATION) &&
      Studio.tickCount &&
      (1 ===
       Math.round((Studio.tickCount + index * ANIM_OFFSET) / ANIM_RATE) %
                  ANIM_AFTER_NUM_NORMAL_FRAMES)) {
    // we only support two-frame animation for now, the 2nd frame is only up
    // for 1/8th of the time (since it is a blink of the eyes)
    showThisAnimFrame = sprite.firstAnimFrameNum;
  }
  if (sprite.emotion !== Emotions.NORMAL &&
      sprite.flags & SpriteFlags.EMOTIONS) {
    return showThisAnimFrame ?
            showThisAnimFrame :
            sprite.firstEmotionFrameNum + (sprite.emotion - 1);
  }
  return showThisAnimFrame;
};

var spriteTotalFrames = function (index) {
  var frames = SpriteCounts.NORMAL;
  if (Studio.sprite[index].flags & SpriteFlags.ANIMATION) {
    frames += SpriteCounts.ANIMATION;
  }
  if (Studio.sprite[index].flags & SpriteFlags.TURNS) {
    frames += SpriteCounts.TURNS;
  }
  if (Studio.sprite[index].flags & SpriteFlags.EMOTIONS) {
    frames += SpriteCounts.EMOTIONS;
  }
  return frames;
};

var updateSpeechBubblePath = function (element) {
  var height = +element.getAttribute('height');
  var onTop = 'true' === element.getAttribute('onTop');
  var onRight = 'true' === element.getAttribute('onRight');
  element.setAttribute('d',
                       createSpeechBubblePath(0,
                                              0,
                                              SPEECH_BUBBLE_WIDTH,
                                              height,
                                              SPEECH_BUBBLE_RADIUS,
                                              onTop,
                                              onRight));
};

Studio.displaySprite = function(i) {
  var xCoord = Studio.sprite[i].x * Studio.SQUARE_SIZE;
  var yCoord = Studio.sprite[i].y * Studio.SQUARE_SIZE + Studio.SPRITE_Y_OFFSET;

  var xOffset = Studio.SPRITE_WIDTH * spriteFrameNumber(i);

  var spriteIcon = document.getElementById('sprite' + i);
  var spriteClipRect = document.getElementById('spriteClipRect' + i);

  var xCoordPrev = spriteClipRect.getAttribute('x');
  var yCoordPrev = spriteClipRect.getAttribute('y');

  var dirPrev = Studio.sprite[i].dir;
  if (dirPrev === Direction.NONE) {
    // direction not yet set, start at SOUTH (forward facing)
    Studio.sprite[i].dir = Direction.SOUTH;
  }
  else if ((xCoord != xCoordPrev) || (yCoord != yCoordPrev)) {
    Studio.sprite[i].dir = Direction.NONE;
    if (xCoord < xCoordPrev) {
      Studio.sprite[i].dir |= Direction.WEST;
    } else if (xCoord > xCoordPrev) {
      Studio.sprite[i].dir |= Direction.EAST;
    }
    if (yCoord < yCoordPrev) {
      Studio.sprite[i].dir |= Direction.NORTH;
    } else if (yCoord > yCoordPrev) {
      Studio.sprite[i].dir |= Direction.SOUTH;
    }
  }

  if (Studio.sprite[i].dir !== Studio.sprite[i].displayDir) {
    // Every other frame, assign a new displayDir from state table
    // (only one turn at a time):
    if (Studio.tickCount && (0 === Studio.tickCount % 2)) {
      Studio.sprite[i].displayDir =
          NextTurn[Studio.sprite[i].displayDir][Studio.sprite[i].dir];
    }
  }

  spriteIcon.setAttribute('x', xCoord - xOffset);
  spriteIcon.setAttribute('y', yCoord);

  spriteClipRect.setAttribute('x', xCoord);
  spriteClipRect.setAttribute('y', yCoord);

  var speechBubble = document.getElementById('speechBubble' + i);
  var speechBubblePath = document.getElementById('speechBubblePath' + i);
  var bblHeight = +speechBubblePath.getAttribute('height');
  var wasOnTop = 'true' === speechBubblePath.getAttribute('onTop');
  var wasOnRight = 'true' === speechBubblePath.getAttribute('onRight');
  var nowOnTop = true;
  var nowOnRight = true;
  var ySpeech = yCoord - (bblHeight + SPEECH_BUBBLE_PADDING);
  if (ySpeech < 0) {
    ySpeech = yCoord + Studio.SPRITE_HEIGHT + SPEECH_BUBBLE_PADDING;
    nowOnTop = false;
  }
  var xSpeech = xCoord + SPEECH_BUBBLE_H_OFFSET;
  if (xSpeech > Studio.MAZE_WIDTH - SPEECH_BUBBLE_WIDTH) {
    xSpeech = xCoord + Studio.SPRITE_WIDTH -
                (SPEECH_BUBBLE_WIDTH + SPEECH_BUBBLE_H_OFFSET);
    nowOnRight = false;
  }
  speechBubblePath.setAttribute('onTop', nowOnTop);
  speechBubblePath.setAttribute('onRight', nowOnRight);

  if (wasOnTop !== nowOnTop || wasOnRight !== nowOnRight) {
    updateSpeechBubblePath(speechBubblePath);
  }

  speechBubble.setAttribute('transform',
                            'translate(' + xSpeech + ',' + ySpeech + ')');
};

Studio.displayScore = function() {
  var score = document.getElementById('score');
  if (Studio.scoreText) {
    score.textContent = Studio.scoreText;
  } else {
    score.textContent = studioMsg.scoreText({
      playerScore: Studio.playerScore,
      opponentScore: Studio.opponentScore
    });
  }
  score.setAttribute('visibility', 'visible');
};

var skinTheme = function (value) {
  if (value === 'witch') {
    return skin;
  }
  return skin[value];
};

Studio.queueCmd = function (id, name, opts) {
  var cmd = {
      'id': id,
      'name': name,
      'opts': opts,
  };
  if (Studio.currentEventParams) {
    for (var prop in Studio.currentEventParams) {
      cmd.opts[prop] = Studio.currentEventParams[prop];
    }
  }
  Studio.currentCmdQueue.push(cmd);
};

Studio.executeQueue = function (name) {
  Studio.eventHandlers.forEach(function (handler) {
    if (handler.name === name && handler.cmdQueue) {
      for (var cmd = handler.cmdQueue[0]; cmd; cmd = handler.cmdQueue[0]) {
        if (Studio.callCmd(cmd)) {
          // Command executed immediately, remove from queue and continue
          handler.cmdQueue.shift();
        } else {
          break;
        }
      }
    }
  });
};

//
// Execute a command from a command queue
//
// Return false if the command is not complete (it will remain in the queue)
// and this function will be called again with the same command later
//
// Return true if the command is complete
//

Studio.callCmd = function (cmd) {
  switch (cmd.name) {
    case 'setBackground':
      BlocklyApps.highlight(cmd.id);
      Studio.setBackground(cmd.opts);
      break;
    case 'setSprite':
      BlocklyApps.highlight(cmd.id);
      Studio.setSprite(cmd.opts);
      break;
    case 'saySprite':
      if (!cmd.opts.started) {
        BlocklyApps.highlight(cmd.id);
      }
      return Studio.saySprite(cmd.opts);
    case 'setSpriteEmotion':
      BlocklyApps.highlight(cmd.id);
      Studio.setSpriteEmotion(cmd.opts);
      break;
    case 'setSpriteSpeed':
      BlocklyApps.highlight(cmd.id);
      Studio.setSpriteSpeed(cmd.opts);
      break;
    case 'setSpritePosition':
      BlocklyApps.highlight(cmd.id);
      Studio.setSpritePosition(cmd.opts);
      break;
    case 'playSound':
      BlocklyApps.highlight(cmd.id);
      BlocklyApps.playAudio(cmd.opts.soundName, {volume: 0.5});
      Studio.playSoundCount++;
      break;
    case 'showTitleScreen':
      if (!cmd.opts.started) {
        BlocklyApps.highlight(cmd.id);
      }
      return Studio.showTitleScreen(cmd.opts);
    case 'move':
      BlocklyApps.highlight(cmd.id);
      Studio.moveSingle(cmd.opts);
      break;
    case 'moveDistance':
      if (!cmd.opts.started) {
        BlocklyApps.highlight(cmd.id);
      }
      return Studio.moveDistance(cmd.opts);
    case 'stop':
      BlocklyApps.highlight(cmd.id);
      Studio.stop(cmd.opts);
      break;
    case 'throwProjectile':
      BlocklyApps.highlight(cmd.id);
      Studio.throwProjectile(cmd.opts);
      break;
    case 'makeProjectile':
      BlocklyApps.highlight(cmd.id);
      Studio.makeProjectile(cmd.opts);
      break;
    case 'incrementScore':
      BlocklyApps.highlight(cmd.id);
      Studio.incrementScore(cmd.opts);
      break;
    case 'setScoreText':
      BlocklyApps.highlight(cmd.id);
      Studio.setScoreText(cmd.opts);
      break;
    case 'wait':
      if (!cmd.opts.started) {
        BlocklyApps.highlight(cmd.id);
      }
      return Studio.wait(cmd.opts);
  }
  return true;
};

Studio.setSpriteEmotion = function (opts) {
  Studio.sprite[opts.spriteIndex].emotion = opts.value;
};

Studio.setSpriteSpeed = function (opts) {
  Studio.sprite[opts.spriteIndex].speed = opts.value;
};

Studio.incrementScore = function (opts) {
  if (opts.player == "opponent") {
    Studio.opponentScore++;
  } else {
    Studio.playerScore++;
  }
  Studio.displayScore();
};

Studio.setScoreText = function (opts) {
  Studio.scoreText = opts.text;
  Studio.displayScore();
};

Studio.setBackground = function (opts) {
  var element = document.getElementById('background');
  element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
    skinTheme(opts.value).background);
};

var computeSpriteFrameNums = function (index) {
  var flags = Studio.sprite[index].flags;
  Studio.sprite[index].firstAnimFrameNum = SpriteCounts.NORMAL;
  Studio.sprite[index].firstTurnFrameNum = SpriteCounts.NORMAL +
      ((flags & SpriteFlags.ANIMATION) ? SpriteCounts.ANIMATION : 0);
  Studio.sprite[index].firstEmotionFrameNum =
      Studio.sprite[index].firstTurnFrameNum +
      ((flags & SpriteFlags.TURNS) ? SpriteCounts.TURNS : 0);
};

Studio.setSprite = function (opts) {
  // Inherit some flags from the skin:
  if (opts.value !== 'hidden' && opts.value !== 'visible') {
    Studio.sprite[opts.index].flags &= ~SF_SKINS_MASK;
    Studio.sprite[opts.index].flags |= skinTheme(opts.value).spriteFlags;
  }
  Studio.sprite[opts.index].value = opts.forceHidden ? 'hidden' : opts.value;

  var element = document.getElementById('sprite' + opts.index);
  element.setAttribute(
      'visibility',
      (opts.value === 'hidden' || opts.forceHidden) ? 'hidden' : 'visible');
  if ((opts.value !== 'hidden') && (opts.value !== 'visible')) {
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                           skinTheme(opts.value).sprite);
    element.setAttribute('width',
                         Studio.SPRITE_WIDTH * spriteTotalFrames(opts.index));
    computeSpriteFrameNums(opts.index);
    // call display right away since the frame number may have changed:
    Studio.displaySprite(opts.index);
  }
};

var p = function (x,y) {
  return x + " " + y + " ";
};

var TIP_HEIGHT = 15;
var TIP_WIDTH = 25;
var TIP_X_SHIFT = 10;

//
// createSpeechBubblePath creates a SVG path that looks like a rounded rect
// plus a 'tip' that points back to the sprite.
//
// x, y is the top left position. w, h, r are width/height/radius (for corners)
// onTop, onRight are booleans that are used to tell this function if the
//     bubble is appearing on top and on the right of the sprite.
//
// Thanks to Remy for the original rounded rect path function
/*
http://www.remy-mellet.com/blog/179-draw-rectangle-with-123-or-4-rounded-corner/
*/

var createSpeechBubblePath = function (x, y, w, h, r, onTop, onRight) {
  var strPath = "M"+p(x+r,y); //A
  if (!onTop) {
    if (onRight) {
      strPath+="L"+p(x+r-TIP_X_SHIFT,y-TIP_HEIGHT)+"L"+p(x+r+TIP_WIDTH,y);
    } else {
      strPath+="L"+p(x+w-r-TIP_WIDTH,y)+"L"+p(x+w-TIP_X_SHIFT,y-TIP_HEIGHT);
    }
  }
  strPath+="L"+p(x+w-r,y);
  strPath+="Q"+p(x+w,y)+p(x+w,y+r); //B
  strPath+="L"+p(x+w,y+h-r)+"Q"+p(x+w,y+h)+p(x+w-r,y+h); //C
  if (onTop) {
    if (onRight) {
      strPath+="L"+p(x+r+TIP_WIDTH,y+h)+"L"+p(x+r-TIP_X_SHIFT,y+h+TIP_HEIGHT);
    } else {
      strPath+="L"+p(x+w-TIP_X_SHIFT,y+h+TIP_HEIGHT)+"L"+p(x+w-r-TIP_WIDTH,y+h);
    }
  }
  strPath+="L"+p(x+r,y+h);
  strPath+="Q"+p(x,y+h)+p(x,y+h-r); //D
  strPath+="L"+p(x,y+r)+"Q"+p(x,y)+p(x+r,y); //A
  strPath+="Z";
  return strPath;
};

var onWaitComplete = function (opts) {
  if (!opts.complete) {
    if (opts.waitCallback) {
      opts.waitCallback();
    }
    opts.complete = true;
  }
};

Studio.wait = function (opts) {
  if (!opts.started) {
    opts.started = true;

    // opts.value is the number of milliseconds to wait - or zero which means
    // "wait for click"
    if (0 === opts.value) {
      opts.waitForClick = true;
    } else {
      opts.waitTimeout = window.setTimeout(
        delegate(this, onWaitComplete, opts),
        opts.value);
    }
  }

  return opts.complete;
};

//
// setSpritePositionInstant is used internally so a sprite can be moved
// instantly, without waiting for the next onTick - and optionally overriding
// the displayDir after movement (otherwise it will revert to SOUTH)
//

var setSpritePositionInstant = function (i, x, y, displayDir) {
  var sprite = Studio.sprite[i];
  Studio.setSpritePosition({'spriteIndex': i, 'x': x, 'y': y});
  if (displayDir) {
      sprite.dir = displayDir;
      sprite.displayDir = displayDir;
  }

  // Move the spriteClipRect manually so that the next ontick() doesn't
  // interpret this change in position as one that requires rotating
  // the sprite through various directions
  var spriteClipRect = document.getElementById('spriteClipRect' + i);
  var xCoord = sprite.x * Studio.SQUARE_SIZE;
  var yCoord = sprite.y * Studio.SQUARE_SIZE + Studio.SPRITE_Y_OFFSET;
  spriteClipRect.setAttribute('x', xCoord);
  spriteClipRect.setAttribute('y', yCoord);
};

Studio.hideTitleScreen = function (opts) {
  if (opts.titleSprite) {
    // If we have displayed a title sprite and nobody has moved or changed
    // it while the title screen was displayed, then restore it now:
    var sprite = Studio.sprite[opts.titleSprite.index];
    if (sprite.x === TITLE_SPRITE_X_POS &&
        sprite.y === TITLE_SPRITE_Y_POS &&
        (sprite.value === opts.titleSprite.value) ||
         ((sprite.value !== 'hidden') &&
           (opts.titleSprite.value === 'visible'))) {
      Studio.setSprite({'index': opts.titleSprite.index,
                        'value': opts.titleSprite.prevValue});
      setSpritePositionInstant(opts.titleSprite.index,
                               opts.titleSprite.prevX,
                               opts.titleSprite.prevY,
                               opts.titleSprite.prevDisplayDir);

    }
  }

  var tsTitle = document.getElementById('titleScreenTitle');
  var tsTextGroup = document.getElementById('titleScreenTextGroup');
  tsTitle.setAttribute('visibility', 'hidden');
  tsTextGroup.setAttribute('visibility', 'hidden');

  opts.complete = true;
};

Studio.showTitleScreen = function (opts) {
  if (!opts.started) {
    opts.started = true;
    var tsTitle = document.getElementById('titleScreenTitle');
    var tsTextGroup = document.getElementById('titleScreenTextGroup');
    var tsText = document.getElementById('titleScreenText');
    var tsTextRect = document.getElementById('titleScreenTextRect');
    tsTitle.textContent = opts.title;
    var svgTextOpts = {
      'svgText': tsText,
      'text': opts.text,
      'width': TITLE_SCREEN_TEXT_WIDTH,
      'lineHeight': TITLE_SCREEN_TEXT_LINE_HEIGHT,
      'topMargin': TITLE_SCREEN_TEXT_TOP_MARGIN,
      'sideMargin': TITLE_SCREEN_TEXT_SIDE_MARGIN,
      'maxLines': TITLE_SCREEN_TEXT_MAX_LINES,
      'fullHeight': TITLE_SCREEN_TEXT_HEIGHT,
    };
    var tsTextHeight = setSvgText(svgTextOpts);
    tsTextRect.setAttribute('height', tsTextHeight);

    tsTitle.setAttribute('visibility', 'visible');
    tsTextGroup.setAttribute('visibility', 'visible');

    if (Blockly.Blocks.studio_firstSetSprite) {
      // If we sniffed out some knowledge around the first setSprite call,
      // then we will borrow that sprite and show it temporarily at the bottom
      // of the title screen (storing its previous state for later recovery):
      var fSS = Blockly.Blocks.studio_firstSetSprite;
      var sprite = Studio.sprite[fSS.index];
      opts.titleSprite = {
        'index': fSS.index,
        'value': fSS.value,
        'prevX': sprite.x,
        'prevY': sprite.y,
        'prevDisplayDir': sprite.displayDir,
        'prevValue': sprite.value,
      };
      Studio.setSprite({'index': fSS.index, 'value': fSS.value});
      setSpritePositionInstant(fSS.index,
                               TITLE_SPRITE_X_POS,
                               TITLE_SPRITE_Y_POS,
                               Direction.SOUTH);
    }

    // Wait for a click or a timeout
    opts.waitForClick = true;
    opts.waitCallback = delegate(this, Studio.hideTitleScreen, opts);
    opts.waitTimeout = window.setTimeout(
        delegate(this, onWaitComplete, opts),
        Studio.TITLE_SCREEN_TIMEOUT);
  }

  return opts.complete;
};

Studio.hideSpeechBubble = function (opts) {
  var speechBubble = document.getElementById('speechBubble' + opts.spriteIndex);
  speechBubble.setAttribute('visibility', 'hidden');
  speechBubble.removeAttribute('onTop');
  speechBubble.removeAttribute('onRight');
  speechBubble.removeAttribute('height');
  opts.complete = true;
  Studio.sayComplete++;
};

Studio.saySprite = function (opts) {
  if (!opts.started) {
    opts.started = true;
    var bblText =
        document.getElementById('speechBubbleText' + opts.spriteIndex);

    var svgTextOpts = {
      'svgText': bblText,
      'text': opts.text,
      'width': SPEECH_BUBBLE_WIDTH,
      'lineHeight': SPEECH_BUBBLE_LINE_HEIGHT,
      'topMargin': SPEECH_BUBBLE_TOP_MARGIN,
      'sideMargin': SPEECH_BUBBLE_SIDE_MARGIN,
      'maxLines': SPEECH_BUBBLE_MAX_LINES,
      'fullHeight': SPEECH_BUBBLE_HEIGHT,
    };
    var bblHeight = setSvgText(svgTextOpts);
    var speechBubblePath =
        document.getElementById('speechBubblePath' + opts.spriteIndex);
    var speechBubble =
        document.getElementById('speechBubble' + opts.spriteIndex);

    speechBubblePath.setAttribute('height', bblHeight);
    updateSpeechBubblePath(speechBubblePath);

    // displaySprite will reposition the bubble
    Studio.displaySprite(opts.spriteIndex);
    speechBubble.setAttribute('visibility', 'visible');

    window.clearTimeout(Studio.sprite[opts.spriteIndex].bubbleTimeout);
    Studio.sprite[opts.spriteIndex].bubbleTimeout = window.setTimeout(
        delegate(this, Studio.hideSpeechBubble, opts),
        Studio.SPEECH_BUBBLE_TIMEOUT);
  }

  return opts.complete;
};

Studio.stop = function (opts) {
  cancelQueuedMovements(opts.spriteIndex, true);
  cancelQueuedMovements(opts.spriteIndex, false);

  if (!opts.dontResetCollisions) {
    // Reset collisionMasks so the next movement will fire another collision
    // event against the same sprite if needed. This makes it easier to write code
    // that says "when sprite X touches Y" => "stop sprite X", and have it do what
    // you expect it to do...
    Studio.sprite[opts.spriteIndex].collisionMask = 0;
    for (var i = 0; i < Studio.spriteCount; i++) {
      if (i === opts.spriteIndex) {
        continue;
      }
      Studio.sprite[i].collisionMask &= ~(Math.pow(2, opts.spriteIndex));
    }
  }
};

Studio.throwProjectile = function (opts) {
  var optsInit = {
    className: opts.className,
    height: 50,
    width: 50,
    dir: opts.dir,
    speed: tiles.DEFAULT_SPRITE_SPEED
  };

  var fromSprite = Studio.sprite[opts.spriteIndex];
  optsInit.image = opts.className === "fireball" ? skin.goal : skin.goalSuccess;

  // Choose point of origin based on direction
  // assumes fromSprite is always 2x2 in size
  // assumes projectile is always 1x1 in size
  // fromSprite coords are left, top
  // projectile coords are center, center
  switch (opts.dir) {
    case Direction.NORTH:
      optsInit.x = fromSprite.x + 1;
      optsInit.y = fromSprite.y - 0.5;
      break;
    case Direction.WEST:
      optsInit.x = fromSprite.x - 0.5;
      optsInit.y = fromSprite.y + 1;
      break;
    case Direction.SOUTH:
      optsInit.x = fromSprite.x + 1;
      optsInit.y = fromSprite.y + 2.5;
      break;
    case Direction.EAST:
      optsInit.x = fromSprite.x + 2.5;
      optsInit.y = fromSprite.y + 1;
      break;
  }

  var projectile = new Sprite(optsInit);
  projectile.createElement(document.getElementById('svgStudio'));
  Studio.projectiles.push(projectile);
};

//
// Internal helper to handle makeProjectile calls on a single projectile
//
// Return value: true if projectile was removed from the projectiles array
//

var doMakeProjectile = function (projectile, action) {
  if (action === 'bounce') {
    projectile.bounce();
  } else if (action === 'disappear') {
    projectile.removeElement();
    var pos = Studio.projectiles.indexOf(projectile);
    if (-1 !== pos) {
      Studio.projectiles.splice(pos, 1);
      return true;
    }
  } else {
    throw "unknown action in doMakeProjectile";
  }
  return false;
};

Studio.makeProjectile = function (opts) {
  if (opts.projectile) {
    doMakeProjectile(opts.projectile, opts.action);
  } else {
    // No "current" projectile, so apply action to all of them of this class
    for (var i = 0; i < Studio.projectiles.length; i++) {
      if (Studio.projectiles[i].className === opts.className &&
          doMakeProjectile(Studio.projectiles[i], opts.action)) {
        // if this returned true, the projectile was deleted

        // decrement i because we just removed an item from the array. We want
        // to keep i as the same value for the next iteration through this loop
        i--;
      }
    }
  }
};

Studio.setSpritePosition = function (opts) {
  var sprite = Studio.sprite[opts.spriteIndex];
  var samePosition = (sprite.x === opts.x && sprite.y === opts.y);

  // Don't reset collisions inside stop() if we're in the same position
  Studio.stop({'spriteIndex': opts.spriteIndex,
               'dontResetCollisions': samePosition});
  sprite.x = opts.x;
  sprite.y = opts.y;
  // Reset to "no direction" so no turn animation will take place
  sprite.dir = Direction.NONE;
};

Studio.moveSingle = function (opts) {
  var sprite = Studio.sprite[opts.spriteIndex];
  switch (opts.dir) {
    case Direction.NORTH:
      sprite.y -= sprite.speed;
      if (sprite.y < 0) {
        sprite.y = 0;
      }
      break;
    case Direction.EAST:
      sprite.x += sprite.speed;
      if (sprite.x > (Studio.COLS - 2)) {
        sprite.x = Studio.COLS - 2;
      }
      break;
    case Direction.SOUTH:
      sprite.y += sprite.speed;
      if (sprite.y > (Studio.ROWS - 2)) {
        sprite.y = Studio.ROWS - 2;
      }
      break;
    case Direction.WEST:
      sprite.x -= sprite.speed;
      if (sprite.x < 0) {
        sprite.x = 0;
      }
      break;
  }
};

Studio.moveDistance = function (opts) {
  if (!opts.started) {
    opts.started = true;
    opts.queuedDistance = opts.distance / Studio.SQUARE_SIZE;
  }

  return (0 === opts.queuedDistance);
};

Studio.timedOut = function() {
  return Studio.tickCount > Studio.timeoutFailureTick;
};

Studio.allFinishesComplete = function() {
  var i;
  if (Studio.spriteFinish_) {
    var finished, playSound;
    for (i = 0, finished = 0; i < Studio.spriteFinishCount; i++) {
      if (!Studio.spriteFinish_[i].finished) {
        if (essentiallyEqual(Studio.sprite[Studio.spriteFinishIndex].x,
                             Studio.spriteFinish_[i].x,
                             tiles.FINISH_COLLIDE_DISTANCE) &&
            essentiallyEqual(Studio.sprite[Studio.spriteFinishIndex].y,
                             Studio.spriteFinish_[i].y,
                             tiles.FINISH_COLLIDE_DISTANCE)) {
          Studio.spriteFinish_[i].finished = true;
          finished++;
          playSound = true;

          // Change the finish icon to goalSuccess.
          var spriteFinishIcon = document.getElementById('spriteFinish' + i);
          spriteFinishIcon.setAttributeNS(
              'http://www.w3.org/1999/xlink',
              'xlink:href',
              skin.goalSuccess);
        }
      } else {
        finished++;
      }
    }
    if (playSound && finished != Studio.spriteFinishCount) {
      // Play a sound unless we've hit the last flag
      BlocklyApps.playAudio('flag', {volume: 0.5});
    }
    return (finished == Studio.spriteFinishCount);
  }
  return false;
};

var checkFinished = function () {
  // if we have a succcess condition and have accomplished it, we're done and successful
  if (level.goal && level.goal.successCondition && level.goal.successCondition()) {
    Studio.result = ResultType.SUCCESS;
    return true;
  }

  // if we have a failure condition, and it's been reached, we're done and failed
  if (level.goal && level.goal.failureCondition && level.goal.failureCondition()) {
    Studio.result = ResultType.FAILURE;
    return true;
  }

  if (Studio.allFinishesComplete()) {
    Studio.result = ResultType.SUCCESS;
    return true;
  }

  if (Studio.timedOut()) {
    Studio.result = ResultType.FAILURE;
    return true;
  }

  return false;
};
