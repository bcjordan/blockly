var blockUtils = require('../../../src/block_utils');

// Honey goal of 3 and nectar goal of 3
var levelDef = {
  nectarGoal: 3,
  honeyGoal: 3,
  'map': [
    [ 0, 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 1, 1, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 2, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 0, 0, 0, 0 ]
  ],
  'startDirection': 1, // Direction.EAST,
  'initialDirt': [
    [ 0, 0,  0,  0, 0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, 0 ],
    [ 0, 3, -1,  0, 0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, 0 ]
  ]
};

module.exports = {
  app: "maze",
  skinId: 'bee',
  levelDefinition: levelDef,
  tests: [
    {
      description: "Get three nectar, make three honey",
      expected: {
        result: true,
        testResult: 100
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 0 && Maze.bee.honey_ === 3 && Maze.bee.totalNectar_ === 3;
      },
      xml: '<xml>' + blockUtils.blocksFromList([
        'maze_moveForward',
        'maze_nectar',
        'maze_nectar',
        'maze_nectar',
        'maze_moveForward',
        'maze_honey',
        'maze_honey',
        'maze_honey',
      ]) + '</xml>'
    }
  ]
};
