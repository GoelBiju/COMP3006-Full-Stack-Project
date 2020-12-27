$(function () {
  // Create socket
  var socket = io();

  // Game settings
  let gameJoined = false;
  let getUsername = () => $("#player-name").val();

  // Get table rows
  let tableRows = $("tr");

  // Get cells and slots
  let tableCells = $("td");
  // let tableSlots = $(".slot");

  // Player information
  let gamePlayers = [];
  let myId = -1;
  let currentPlayer = -1;
  let playerOneColor = "red";
  let playerTwoColor = "yellow";

  // Get next move
  const getPlayerTurn = () => gamePlayers[currentPlayer];

  // Check if it my turn
  const myTurn = () => {
    if (gamePlayers.length == 2 && currentPlayer != -1 && myId != -1) {
      if (myId == currentPlayer) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // Join a game
  $("#join").click(function () {
    // Reset other fields
    gameJoined = false;

    // Set game status
    $("#game-status").text("No game");

    // Set opponent and player turn
    $("#opponent-name").text("No opponent");
    $("#player-turn").text("");

    // Send some user info
    socket.emit("join", getUsername());
    console.log("Sent join");
  });

  // Connection message from server
  socket.on("connection", function (msg) {
    console.log("Connection message: ", msg);
    $("#conn-status").html("Connection: " + msg);
  });

  // Receiving game information
  socket.on("game", function (gameInfo) {
    console.log("Game info: ", gameInfo);

    if (gameInfo.status == "start") {
      // Set up the players
      myId = gameInfo.id;
      currentPlayer = gameInfo.nextMove;
      gamePlayers = gameInfo.gamePlayers;

      // Set game status
      $("#game-status").text("Game: Play");

      // Set opponent and player turn
      $("#opponent-name").text(`Your opponent: ${gameInfo.opponent}`);
      $("#player-turn").text(`Player Turn: ${getPlayerTurn()}`);

      // Set game joined to allow moves
      gameJoined = true;
    } else if (gameInfo.status == "wait") {
      $("#game-status").text("Waiting for another player");
    } else {
      $("#game-status").text(gameInfo.status);
    }
  });

  // When receiving reject message
  socket.on("reject", function (msg) {
    console.log("Rejected game: ", msg);
    $("#game-status").text(msg);
  });

  socket.on("move", function (moveInfo) {
    console.log("Move response: ", moveInfo);

    // Check if the move was made
    if (moveInfo.confirm) {
      console.log(
        `Move confirmed: ${moveInfo.row} (row), ${moveInfo.column} (column) (colour: ${moveInfo.colour})`
      );

      // Change the colour of the cell.
      console.log("Got table row: ", tableRows[moveInfo.row][moveInfo.column]);
      // tableRows[moveInfo.row][moveInfo.column].style.backgroundColor =
      //   moveInfo.colour;

      // Update next move
      currentPlayer = moveInfo.nextMove;
    } else {
      console.log("Unable to move: ", moveInfo.reason);
    }
  });

  // Add event listener to each table cell to
  // find row and column location of cell
  $("td").click(function (e) {
    console.log(
      "Row, Column of clicked: ",
      `${e.target.parentElement.rowIndex}, ${e.target.cellIndex}`
    );
  });

  function handleMove(event) {
    if (gameJoined && myTurn()) {
      // Send a message to the server to move this piece.
      socket.emit("move", {
        id: myId,
        column: event.target.cellIndex,
      });
    }
  }

  // Reset all the table cells and assign handler
  tableCells.each(function () {
    $(this).click(handleMove);
    $(this).css("backgroundColor", "white");
  });
});
