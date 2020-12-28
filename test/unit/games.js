let chai = require("chai");
const { connectTestDb, disconnectTestDb } = require("../testDb");

const Game = require("../../src/models/Game");
const {
  getGame,
  addGamePlayer,
  getGamePlayerCount,
  getRandomPlayer,
  getGamePlayer,
  updateNextMove,
  switchMove,
  getGamePlayers,
} = require("../../src/controllers/games");

suite("Game - Controller/Model", () => {
  let gameData;

  suiteSetup(async () => {
    // Start test database
    await connectTestDb();

    // Create expected game data
    gameData = {
      _id: 1,
      board: [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
      ],
      players: [],
      nextMove: -1,
    };
  });

  setup(async () => {
    // Create an default game
    const g = await Game.create({ _id: "1" });
    await g.save();
  });

  teardown(async () => {
    await Game.deleteOne({ _id: "1" });
  });

  test("gets a default game by ID", async () => {
    // Find a game with ID 1
    await getGame("1").then((game) => {
      // Assert all fields are set to default
      chai.expect(game._id).to.equal(gameData._id);
      chai.expect(game.board).to.eql(gameData.board);
      chai.expect(game.players).to.eql(gameData.players);
      chai.expect(game.nextMove).to.equal(gameData.nextMove);
    });
  });

  test("adds a game player", async () => {
    let addedOne = await addGamePlayer("1", "player 1");
    chai.expect(addedOne).to.eq(true);

    let addedTwo = await addGamePlayer("1", "player 2");
    chai.expect(addedTwo).to.eq(true);

    // Adding a third player which should not be accepted
    let addedThree = await addGamePlayer("1", "player 3");
    chai.expect(addedThree).to.eq(false);
  });

  test("gets a game player count", async () => {
    // Check initial count
    let cntNone = await getGamePlayerCount("1");
    chai.expect(cntNone).to.eq(0);

    // Add some players to the game
    await Game.findById("1", async (err, game) => {
      game.players = ["player 1", "player 2"];
      await game.save();
    });

    // Check count after adding two players
    let cntTwo = await getGamePlayerCount("1");
    chai.expect(cntTwo).to.eq(2);
  });

  // test("gets a random player from a game", async () => {
  //   // Add some players to the game
  //   await Game.findById("1", async (err, game) => {
  //     game.players = ["player 1", "player 2"];
  //     await game.save();
  //   });

  //   let counter = 0;
  //   for (let i = 0; i < 100; i++) {
  //     let p = await getRandomPlayer("1");

  //     chai.assert.include([0, 1], p, "Player not found");
  //     if (p == 1) {
  //       counter++;
  //     }
  //   }

  //   // Counter selects player 1 approximately 50 times (+/- 10)
  //   chai.assert.approximately(50, counter, 20);
  // });

  // test("gets game player username by ID and index", async () => {
  //   // Add some players to the game
  //   await Game.findById("1", async (err, game) => {
  //     game.players = ["test"];
  //     await game.save();
  //   });

  //   const player = await getGamePlayer("1", 0);
  //   chai.expect(player).to.eq("test");
  // });

  // test("get all game players", async () => {
  //   // Add some players to the game
  //   await Game.findById("1", async (err, game) => {
  //     game.players = ["test 1", "test 2"];
  //     await game.save();
  //   });

  //   // Get all the players
  //   const players = await getGamePlayers("1");
  //   chai.expect(players).to.eql(["test 1", "test 2"]);
  // });

  // test("update next move", async () => {
  //   // Check game is set to -1
  //   await Game.findById("1", async (err, game) => {
  //     chai.expect(game.nextMove).to.eq(-1);
  //   });

  //   // Set game next move to 1
  //   const updated = await updateNextMove("1", 1);
  //   chai.expect(updated).to.eq(true);

  //   // Check game is set to 1
  //   const game = await Game.findById("1").exec();
  //   chai.assert.equal(game.nextMove, 1, "Next move not updated to 1");
  // });

  // test("switch moves ", async () => {
  //   // Set nextMove to 0
  //   let game;
  //   game = await Game.findById("1").exec();
  //   game.nextMove = 0;
  //   await game.save();

  //   // Check game is set to -1
  //   game = await Game.findById("1").exec();
  //   chai.assert.equal(game.nextMove, 0, "Next move not set to 0");

  //   // Switch move to 1
  //   let nextPlayer = -1;
  //   nextPlayer = await switchMove("1", 0);
  //   chai.assert.equal(nextPlayer, 1, "Next move not updated to 1");

  //   // Switch move to 0
  //   nextPlayer = await switchMove("1", 1);
  //   chai.assert.equal(nextPlayer, 0, "Next move not updated to 0");
  // });

  suiteTeardown(async () => {
    await disconnectTestDb();
  });
});
