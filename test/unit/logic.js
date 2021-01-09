let chai = require("chai");
const {
  coinMatchCheck,
  horizontalCheck,
  verticalCheck,
  diagonalChecks,
  drawCheck,
  isBoardFull,
} = require("../../src/logic");

suite("Logic", () => {
  let board;
  let fullBoard = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
  ];

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

  test.skip("it can make a move on the board");

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

  test("check full board", () => {
    let result = isBoardFull(fullBoard);
    chai.expect(result).to.eq(true);
  });
});