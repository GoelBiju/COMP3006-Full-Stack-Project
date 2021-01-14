let chai = require("chai");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const {
  makeMove,
  performChecks,
  coinMatchCheck,
  horizontalCheck,
  verticalCheck,
  diagonalChecks,
  isBoardFull,
} = require("../../src/logic");
const Game = require("../../src/models/Game");

let mongoServer;

suite("Logic", () => {
  let gameId;
  let board;
  let fullBoard = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 0, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 0, 0],
    [1, 0, 0, 1, 1, 0, 1],
    [0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1],
  ];

  suiteSetup(async () => {
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

    // Create an default game
    const game = new Game();
    await game.save();
    gameId = game._id;
  });

  setup(() => {
    board = [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
    ];
  });

  suiteTeardown(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("it can make a move on the board", async () => {
    let game;
    let row;

    // Update next move to point to player 0
    game = await Game.findById(gameId).exec();
    game.nextMove = 0;
    game.state = 0;
    await game.save();

    // No previous data, expect move to return bottom (5th row).
    row = await makeMove(gameId, 0, 1);
    chai.assert.equal(row, 5, "The row is not equal to 5");

    game = await Game.findById(gameId).exec();
    game.nextMove = 1;
    game.state = 0;
    await game.save();

    // No previous data, expect move to return bottom (5th row).
    row = await makeMove(gameId, 1, 1);
    chai.assert.equal(row, 4, "The row is not equal to 4");
  });

  test("it can perform checks on a given game to find horizontal win", async () => {
    // Perform checks to continue playing
    let checkResult;
    checkResult = await performChecks(gameId);
    chai.assert.equal(
      checkResult,
      0,
      "The check result is not equal to 0 (horizontal win)"
    );

    // Set board to win horizontally
    board[5][0] = 1;
    board[5][1] = 1;
    board[5][2] = 1;
    board[5][3] = 1;

    game = await Game.findById(gameId).exec();
    game.board = board;
    game.markModified("board");
    await game.save();

    // Perform checks for win
    checkResult = await performChecks(gameId);
    chai.assert.equal(
      checkResult,
      1,
      "The check result is not equal to 1 (horizontal win)"
    );
  });

  test("it can perform checks on a given game to find vertical win", async () => {
    // Set board to win vertically
    board[5][0] = 0;
    board[4][0] = 0;
    board[3][0] = 0;
    board[2][0] = 0;

    game = await Game.findById(gameId).exec();
    game.board = board;
    game.markModified("board");
    await game.save();

    // Perform checks for win
    const checkResult = await performChecks(gameId);
    chai.assert.equal(
      checkResult,
      2,
      "The check result is not equal to 2 (vertical win)"
    );
  });

  test("it can perform checks on a given game to find diagonal win", async () => {
    // Set board to win diagonally
    board[5][0] = 1;
    board[4][1] = 1;
    board[3][2] = 1;
    board[2][3] = 1;

    game = await Game.findById(gameId).exec();
    game.board = board;
    game.markModified("board");
    await game.save();

    // Perform checks for win
    const checkResult = await performChecks(gameId);
    chai.assert.equal(
      checkResult,
      3,
      "The check result is not equal to 3 (diagonal win)"
    );
  });

  test("it can perform checks on a given game to find a full board", async () => {
    game = await Game.findById(gameId).exec();
    game.board = fullBoard;
    game.markModified("board");
    await game.save();

    // Perform checks for a full board
    const checkResult = await performChecks(gameId);
    chai.assert.equal(
      checkResult,
      4,
      "The check result is not equal to 4 (full board)"
    );
  });

  test("coin match check", () => {
    let result;

    // Test result when all equal 1.
    result = coinMatchCheck(1, 1, 1, 1);
    chai.expect(result).to.eq(true);

    // Test result when all do not match.
    result = coinMatchCheck(1, 1, 0, -1);
    chai.expect(result).to.eq(false);
  });

  test("horizontal coin check", () => {
    let result;

    // Test with an empty board
    result = horizontalCheck(board);
    chai.expect(result).to.eq(false);

    // Add columns which match.
    board[0][1] = 1;
    board[0][2] = 1;
    board[0][3] = 1;
    board[0][4] = 1;

    // Test with a winning board
    result = horizontalCheck(board);
    chai.expect(result).to.eq(true);
  });

  test("vertical coin check", () => {
    let result;

    // Test with an empty board
    result = verticalCheck(board);
    chai.expect(result).to.eq(false);

    // Add rows which match.
    board[0][0] = 0;
    board[1][0] = 0;
    board[2][0] = 0;
    board[3][0] = 0;

    // Test with a winning board
    result = verticalCheck(board);
    chai.expect(result).to.eq(true);
  });

  test("diagonal coin checks", () => {
    let result;

    // Test with an empty board
    result = diagonalChecks(board);
    chai.expect(result).to.eq(false);

    // Add rows/columns which match.
    board[0][0] = 1;
    board[1][1] = 1;
    board[2][2] = 1;
    board[3][3] = 1;

    // Test with a winning board
    result = diagonalChecks(board);
    chai.expect(result).to.eq(true);

    // Reset previously changed columns.
    board[0][0] = -1;
    board[1][1] = -1;
    board[2][2] = -1;
    board[3][3] = -1;

    // Add rows/columns which match.
    board[0][6] = 0;
    board[1][5] = 0;
    board[2][4] = 0;
    board[3][3] = 0;

    // Test with a winning board
    result = diagonalChecks(board);
    chai.expect(result).to.eq(true);
  });

  test("check if the game board is full", () => {
    let full;
    full = isBoardFull(fullBoard);
    chai.expect(full).to.eq(true);

    // Change to be not full
    fullBoard[0][0] = -1;
    full = isBoardFull(fullBoard);
    chai.expect(full).to.eq(false);
  });
});
