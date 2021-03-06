module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "2_9",
  tests: [
    {
      description: "Verify solution",
      expected: {
        result: true,
        testResult: 100
      },
      xml: '<xml><block type="maze_forever" x="27" y="47"><statement name="DO"><block type="maze_moveForward" /></statement></block></xml>'
    },
    {
      description: "Infinite loop",
      expected: {
        result: false,
        testResult: 3
      },
      customValidator: function () {
        return Maze.result === 2;
      },
      xml: '<xml><block type="maze_forever"><statement name="DO"><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnLeft</title><next><block type="maze_turn"><title name="DIR">turnLeft</title></block></next></block></next></block></statement></block></xml>'
    }
  ]
};
