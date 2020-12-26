$(function () {
  // Create socket
  var socket = io();
  let gameJoined = false;
  let getUsername = () => $("#player-name").val();

  // Game related actions

  // Get table rows
  let tableRows = $("tr");

  // Get cells and slots
  let tableCells = $("td");
  // let tableSlots = $(".slot");

  // List of players
  let gamePlayers = [];

  let currentPlayer = -1;

  // Get next move
  let getPlayerTurn = () => {
    return gamePlayers[currentPlayer];
  };

  // Check if it my turn
  let myTurn = () => {
    if (gamePlayers.length == 2 && currentPlayer != -1) {
      if (getPlayerTurn() == getUsername()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  playerOneColor = "red";
  playerTwoColor = "yellow";

  // const reset = $("#reset");

  $("#join").click(function () {
    // Send some user info
    socket.emit("join", getUsername());
    console.log("Sent join");
  });

  // Connection message from server
  socket.on("connection", function (msg) {
    console.log("Connection message: ", msg);
    $("#conn-status").html("Connection: " + msg);
  });

  // receiving game info
  socket.on("game", function (gameInfo) {
    console.log("Game info: ", gameInfo);

    if (gameInfo.status == "start") {
      // Set up the players
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
    }
  });

  // When receiving reject message
  socket.on("reject", function (msg) {
    console.log("Rejected game: ", msg);
    $("#game-status").text(msg);
  });

  function changeColor(e) {
    let column = e.target.cellIndex;
    let row = [];

    //
    for (let i = 5; i > -1; i--) {
      //
      if (tableRows[i].children[column].style.backgroundColor == "white") {
        //
        row.push(tableRows[i].children[column]);

        // Assign correct colour depending on the player
        if (currentPlayer == 1) {
          row[0].style.backgroundColor = playerOneColor;
          // playerTurn.text(`${playerTwo}'s turn`);

          return (currentPlayer = 2);
        } else {
          row[0].style.backgroundColor = playerTwoColor;
          // playerTurn.text(`${playerOne}'s turn`);
          return (currentPlayer = 1);
        }
      }
    }
  }

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
        username: getUsername(),
        column: event.target.cellIndex,
      });

      // Change the colour of the cell.
      changeColor(event);
    }
  }

  // Reset all the table cells and assign handler
  tableCells.each(function () {
    $(this).click(handleMove);
    $(this).css("backgroundColor", "white");
  });
});
