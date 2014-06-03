var Direction = require('./tiles').Direction;
var reqBlocks = require('./requiredBlocks');
var blockUtils = require('../block_utils');

var wordSearchToolbox = function () {
  return blockUtils.createToolbox(
    blockUtils.blockOfType('maze_moveNorth') +
    blockUtils.blockOfType('maze_moveSouth') +
    blockUtils.blockOfType('maze_moveEast') +
    blockUtils.blockOfType('maze_moveWest')
  );
};

/*
 * Configuration for all levels.
 */
module.exports = {

  // Formerly Page 2

  'k_1': {
    'toolbox': wordSearchToolbox(),
    'ideal': 3,
    'requiredBlocks': [
      [reqBlocks.moveEast],
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 'R', 'U', 'Nx', 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': blockUtils.blockOfType('maze_moveEast')
  },
  'k_2': {
    'toolbox': wordSearchToolbox(),
    'ideal': 3,
    'requiredBlocks': [
      [reqBlocks.moveSouth],
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 'S', 0, 0, 0, 0],
      [0, 0, 0, 'E', 0, 0, 0, 0],
      [0, 0, 0, 'Tx', 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': blockUtils.blockOfType('maze_moveSouth')
  },
  'k_3': {
    'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 'M', 'O', 'V', 'Ex', 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'startBlocks': blockUtils.blockOfType('maze_moveEast')
  },
  'k_4': {
    'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveSouth]
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 12, 0, 0, 0, 0, 0],
      [0, 0, 24, 0, 0, 0, 0, 0],
      [0, 0, 13, 0, 0, 0, 0, 0],
      [0, 0, 44, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_5': {
    'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveNorth],
    ],
    'startDirection': Direction.NORTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 62, 0, 0, 0, 0, 0, 0],
      [0, 10, 0, 0, 0, 0, 0, 0],
      [0, 27, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_6': {
      'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 19, 30, 22, 0, 0],
      [0, 0, 0, 0, 0, 55, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_7': {
    'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 59, 0, 0, 0],
      [0, 0, 0, 0, 33, 0, 0, 0],
      [0, 0, 2, 23, 14, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_8': {
    'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 32, 0, 0, 0, 0],
      [0, 0, 0, 14, 28, 59, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_9': {
    'toolbox': wordSearchToolbox(),
    'ideal': 4,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 28, 59, 0, 0, 0],
      [0, 2, 14, 10, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_10': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveSouth],
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 23, 0, 0, 0, 0, 0],
      [0, 0, 24, 0, 0, 0, 0, 0],
      [0, 0, 27, 0, 0, 0, 0, 0],
      [0, 0, 29, 0, 0, 0, 0],
      [0, 0, 47, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_11': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 28, 24, 0, 0, 0],
      [0, 0, 0, 0, 30, 0, 0, 0],
      [0, 0, 0, 0, 29, 0, 0, 0],
      [0, 0, 0, 0, 47, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_12': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.NORTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 24, 21, 24, 57, 0, 0, 0],
      [0, 12, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_13': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 13, 14, 0, 0, 0, 0],
      [0, 0, 0, 11, 0, 0, 0, 0],
      [0, 0, 0, 30, 46, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_14': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveEast],
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 28, 14, 59, 0, 0],
      [0, 0, 0, 14, 0, 0, 0, 0],
      [0, 0, 2, 27, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_15': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 10, 0, 0, 0, 0, 0],
      [0, 0, 11, 24, 0, 0, 0, 0],
      [0, 0, 0, 31, 44, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_16': {
    'toolbox': wordSearchToolbox(),
    'ideal': 5,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 62, 0, 0, 0],
      [0, 0, 0, 0, 24, 0, 0, 0],
      [0, 0, 0, 14, 21, 0, 0, 0],
      [0, 0, 2, 11, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_17': {
    'toolbox': wordSearchToolbox(),
    'ideal': 6,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.SOUTH,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 28, 26, 0, 0, 0, 0],
      [0, 0, 0, 30, 10, 0, 0, 0],
      [0, 0, 0, 0, 27, 0, 0, 0],
      [0, 0, 0, 0, 44, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  'k_18': {
    'toolbox': wordSearchToolbox(),
    'ideal': 7,
    'requiredBlocks': [
      [reqBlocks.moveEast]
    ],
    'startDirection': Direction.EAST,
    'map': [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 10, 52, 0],
      [0, 0, 0, 0, 0, 27, 0, 0],
      [0, 0, 0, 27, 24, 16, 0, 0],
      [0, 0, 2, 25, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }
};
