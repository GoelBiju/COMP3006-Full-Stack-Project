let chai = require("chai");
// const { connectTestDb, disconnectTestDb } = require("../testDb");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

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
  getGameState,
  updateState,
  updateWinner,
  getPlayerScores,
  getGameInfo,
  gamePlayerExists,
} = require("../../src/controllers/GameController");

let mongoServer;

suite("Game - Controller/Model", () => {
  let gameData;
  let gameId;

  suiteSetup(async () => {
    // Start test database
    // await connectTestDb();
    // Create Mongo memory server
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();

    await mongoose
      .connect(mongoUri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        // Disable any debugging information from showing.
        mongoose.set("debug", false);
      });

    // Create expected game data
    gameData = {
      _id: -1,
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
      scoreOne: 0,
      scoreTwo: 0,
    };
  });

  setup(async () => {
    // Create an default game
    const game = new Game();
    await game.save();
    gameId = game._id;

    // Update our gameId array
    gameData._id = gameId;
  });

  teardown(async () => {
    await Game.deleteOne({ _id: gameId });
  });

  suiteTeardown(async () => {
    // await disconnectTestDb();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // test("test", () => {
  //   console.log("running test");
  // });

  test("gets a default game by ID", async () => {
    // Find a game with ID 1
    await getGame(gameId).then((game) => {
      // Assert all fields are set to default
      chai.expect(game._id).to.eql(gameData._id);
      chai.expect(game.board).to.eql(gameData.board);
      chai.expect(game.players).to.eql(gameData.players);
      chai.expect(game.nextMove).to.equal(gameData.nextMove);
    });
  });

  test("adds a game player", async () => {
    let addedOne = await addGamePlayer(gameId, "player 1");
    chai.expect(addedOne).to.eq(true);

    let addedTwo = await addGamePlayer(gameId, "player 2");
    chai.expect(addedTwo).to.eq(true);

    // Adding a third player which should not be accepted
    let addedThree = await addGamePlayer(gameId, "player 3");
    chai.expect(addedThree).to.eq(false);
  });

  test("gets a game player count", async () => {
    // Check initial count
    let cntNone = await getGamePlayerCount(gameId);
    chai.expect(cntNone).to.eq(0);

    // Add some players to the game
    await Game.findById(gameId, async (err, game) => {
      game.players = ["player 1", "player 2"];
      await game.save();
    });

    // Check count after adding two players
    let cntTwo = await getGamePlayerCount(gameId);
    chai.expect(cntTwo).to.eq(2);
  });

  test("gets a random player from a game", async () => {
    // Add some players to the game
    await Game.findById(gameId, async (err, game) => {
      game.players = ["player 1", "player 2"];
      await game.save();
    });

    let counter = 0;
    for (let i = 0; i < 100; i++) {
      let p = await getRandomPlayer(gameId);

      chai.assert.include([0, 1], p, "Player not found");
      if (p == 1) {
        counter++;
      }
    }

    // Counter selects player 1 approximately 50 times (+/- 10)
    chai.assert.approximately(50, counter, 20);
  });

  test("gets game player username by ID and index", async () => {
    // Add some players to the game
    await Game.findById(gameId, async (err, game) => {
      game.players = ["test"];
      await game.save();
    });

    const player = await getGamePlayer(gameId, 0);
    chai.expect(player).to.eq("test");
  });

  test("get all game players", async () => {
    // Add some players to the game
    // await Game.findById(gameId, async (err, game) => {
    //   game.players = ["test 1", "test 2"];
    //   await game.save();
    // });
    let game = await Game.findById(gameId).exec();
    game.players = ["test 1", "test 2"];
    await game.save();

    // Get all the players
    const players = await getGamePlayers(gameId);
    chai.expect(players).to.eql(["test 1", "test 2"]);
  });

  test("update next move", async () => {
    // Check game is set to -1
    await Game.findById(gameId, async (err, game) => {
      chai.expect(game.nextMove).to.eq(-1);
    });

    // Set game next move to 1
    const updated = await updateNextMove(gameId, 1);
    chai.expect(updated).to.eq(true);

    // Check game is set to 1
    const game = await Game.findById(gameId).exec();
    chai.assert.equal(game.nextMove, 1, "Next move not updated to 1");
  });

  test("switch moves ", async () => {
    // Set nextMove to 0
    let game;
    game = await Game.findById(gameId).exec();
    game.nextMove = 0;
    await game.save();

    // Check game is set to -1
    game = await Game.findById(gameId).exec();
    chai.assert.equal(game.nextMove, 0, "Next move not set to 0");

    // Switch move to 1
    let nextPlayer = -1;
    nextPlayer = await switchMove(gameId, 0);
    chai.assert.equal(nextPlayer, 1, "Next move not updated to 1");

    // Switch move to 0
    nextPlayer = await switchMove(gameId, 1);
    chai.assert.equal(nextPlayer, 0, "Next move not updated to 0");
  });

  test("it gets the state of a game", async () => {
    // Set state to 1
    let game;
    game = await Game.findById(gameId).exec();
    game.state = 1;
    await game.save();

    const state = await getGameState(gameId);
    chai.assert.equal(state, 1, "Game state is not equal to 1");
  });

  test("it updates the state of a game", async () => {
    const updated = await updateState(gameId, 2);
    chai.assert.equal(updated, true, "State has not been updated");

    // Check updated state
    let game = await Game.findById(gameId).exec();
    chai.assert.equal(game.state, 2, "Game state has not been updated to 2");
  });

  test("it updates the winner of a game", async () => {
    const updated = await updateWinner(gameId, "new player 1");
    chai.assert.equal(updated, true, "Winner has not been updated");

    // Check updated state
    let game = await Game.findById(gameId).exec();
    chai.assert.equal(
      game.winner,
      "new player 1",
      "Game winner has not been updated to new player 1"
    );
  });

  test("it gets the players scores from a game", async () => {
    let scores;

    // Check updated state
    scores = await getPlayerScores(gameId);
    chai.expect(scores).to.eql([0, 0]);

    // Change the scores to [1, 2] and check
    let game = await Game.findById(gameId).exec();
    game.scoreOne = 1;
    game.scoreTwo = 2;
    await game.save();

    // Check updated state
    scores = await getPlayerScores(gameId);
    chai.expect(scores).to.eql([1, 2]);
  });

  test("it gets the game information given a game id", async () => {
    const gameInfo = await getGameInfo(gameId);
    chai.expect(gameInfo).to.not.equal(null);

    // Expect the default values
    chai.expect(gameInfo.board).eql(gameData.board);
    chai.expect(gameInfo.nextMove).eql(gameData.nextMove);
    chai.expect(gameInfo.scores).eql([gameData.scoreOne, gameData.scoreTwo]);
    chai.expect(gameInfo.gamePlayers).eql([]);
  });

  test("it checks if a player is already present in the game", async () => {
    // Add some game players
    let game = await Game.findById(gameId).exec();
    game.players = ["test user 1", "test user 2"];
    await game.save();

    // Check if the player exists
    const exists = await gamePlayerExists(gameId, "test user 2");
    chai.expect(exists).equal(true);
  });
});
