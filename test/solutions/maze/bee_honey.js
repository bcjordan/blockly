var blockUtils = require('../../../src/block_utils');

// Honey goal of 2.  No specific hive goals
var levelDef = {
  honeyGoal: 2,
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
    [ 0, 0,  0, 0, 0, 0, 0, 0 ],
    [ 0, 0,  0, 0, 0, 0, 0, 0 ],
    [ 0, 0,  0, 0, 0, 0, 0, 0 ],
    [ 0, 0,  0, 0, 0, 0, 0, 0 ],
    [ 0, 3, -1, 0, 0, 0, 0, 0 ],
    [ 0, 0,  0, 0, 0, 0, 0, 0 ],
    [ 0, 0,  0, 0, 0, 0, 0, 0 ],
    [ 0, 0,  0, 0, 0, 0, 0, 0 ]
  ]
};

module.exports = {
  app: "maze",
  skinId: 'bee',
  levelDefinition: levelDef,
  tests: [
    {
      description: "Get two nectar, make two honey",
      expected: {
        result: true,
        testResult: 100
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 0 && Maze.bee.honey_ === 2;
      },
      xml: '<xml>' +
        blockUtils.blockWithNext('maze_moveForward',
          blockUtils.blockWithNext('maze_nectar',
            blockUtils.blockWithNext('maze_nectar',
              blockUtils.blockWithNext('maze_moveForward',
                blockUtils.blockWithNext('maze_honey',
                  blockUtils.blockOfType('maze_honey')
                )
              )
            )
          )
        ) +
        '</xml>'
    },
    {
      description: "Try making honey without nectar",
      expected: {
        result: false,
        testResult: 2
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 0 && Maze.bee.honey_ === 0;
      },
      xml: '<xml>' +
        blockUtils.blockWithNext('maze_moveForward',
          blockUtils.blockWithNext('maze_moveForward',
            blockUtils.blockWithNext('maze_honey',
              blockUtils.blockOfType('maze_honey')
            )
          )
        ) +
        '</xml>'
    },
    {
      description: "Collect three nectar, make two honey",
      expected: {
        result: true,
        testResult: 100
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 1 && Maze.bee.honey_ === 2;
      },
      xml: '<xml>' +
        blockUtils.blockWithNext('maze_moveForward',
          blockUtils.blockWithNext('maze_nectar',
            blockUtils.blockWithNext('maze_nectar',
              blockUtils.blockWithNext('maze_nectar',
                blockUtils.blockWithNext('maze_moveForward',
                  blockUtils.blockWithNext('maze_honey',
                    blockUtils.blockOfType('maze_honey')
                  )
                )
              )
            )
          )
        ) +
        '</xml>'
    },
    {
      description: "Make only one honey",
      expected: {
        result: false,
        testResult: 2
      },
      customValidator: function () {
        return Maze.bee.nectar_ === 1 && Maze.bee.honey_ === 1;
      },
      xml: '<xml>' +
        blockUtils.blockWithNext('maze_moveForward',
          blockUtils.blockWithNext('maze_nectar',
            blockUtils.blockWithNext('maze_nectar',
              blockUtils.blockWithNext('maze_moveForward',
                blockUtils.blockOfType('maze_honey')
              )
            )
          )
        ) +
        '</xml>'
    }
  ]
};
