var blockUtils = require('../../../src/block_utils');

// Honey goal of 3.  One hive goal of 2, one of 1.
var levelDef = {
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
    [ 0, 3, -3, -2, -1, 0, 0, 0 ],
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
      description: "Get three nectar, accomplish hive goals",
      expected: {
        result: true,
        testResult: 100
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 0 && Maze.bee.honey_ === 3;
      },
      xml: '<xml>' + blockUtils.blocksFromList([
        'maze_moveForward',
        'maze_nectar',
        'maze_nectar',
        'maze_nectar',
        'maze_moveForward',
        'maze_honey',
        'maze_honey',
        'maze_moveForward',
        'maze_honey',
      ]) + '</xml>'
    },
    {
      description: "Accomplish honey goal, but not hive goals",
      expected: {
        result: false,
        testResult: 2
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 0 && Maze.bee.honey_ === 3;
      },
      xml: '<xml>' + blockUtils.blocksFromList([
        'maze_moveForward',
        'maze_nectar',
        'maze_nectar',
        'maze_nectar',
        'maze_moveForward',
        'maze_moveForward',
        'maze_moveForward',
        'maze_honey',
        'maze_honey',
        'maze_honey',
      ]) + '</xml>'      
    }
  ]
};
