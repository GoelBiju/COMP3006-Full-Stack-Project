const Game = require("../../src/models/Game");
const { getGame, addGamePlayer } = require("../../src/controllers/game");

const chai = require("chai");
const sinon = require("sinon");

suite("Game", () => {
  let mockGameData;

  suiteSetup(() => {
    // Create expected game data
    mockGameData = {
      _id: "1",
      board: [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [1, 1, -1, -1, -1, -1, -1],
        [0, 0, -1, -1, -1, -1, -1],
        [0, 1, -1, -1, -1, -1, -1],
      ],
      players: ["player 1"],
      nextMove: 1,
    };

    // amendedGameData = {
    //   ...mockGameData,
    //   players: ["player 1", "player 2"],
    // };

    // let mockFindById = {
    //   exec: function () {
    //     Promise.resolve(mockGameData);
    //   },
    // };

    // Stub the findById Game model call
    // gameStub = sinon.stub(Game, "findById").returns(mockFindById);

    // saveStub = sinon.stub(Game.prototype, "save").callsFake(function () {
    //   return Promise.resolve(this);
    // });
  });

  // test.skip("gets a game by ID", async (done) => {
  //   let game = await getGame(1);

  //   console.log("return game: ", game);
  //   chai.expect(game).to.eq(mockGameData);
  // });

  // test.skip("adds a game player", async () => {
  //   let added = await addGamePlayer("player 2");

  //   chai.expect(added).to.eq(true);
  // });

  // test.skip("gets a game player count", () => {});

  // test.skip("gets game players", () => {});

  // test.skip("gets a random player from a game", () => {});

  // test.skip("does not add a player for a full game", () => {});

  suiteTeardown(() => {
    // Restore stubbed functions
    gameStub.restore();
  });
});
