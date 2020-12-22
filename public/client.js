$(function () {
  // Create socket
  var socket = io();
  let gameJoined = false;
  let getUsername = () => $("#player-name").val();
  let opponent = "";

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

  // When receiving reject message
  socket.on("reject", function (msg) {
    console.log("Rejected game: ", msg);
    $("#game-status").html(msg);
  });

  // Game related actions

  // Get table rows
  let tableRows = $("tr");

  // Get cells and slots
  let tableCells = $("td");
  let tableSlots = $(".slot");

  // Player turn
  const playerTurn = $("#player-turn");
  // const reset = $("#reset");

  // Add event listener to each table cell to
  // find row and column location of cell
  $("td").click(function (e) {
    console.log(
      "Row, Column of clicked: ",
      `${e.target.parentElement.rowIndex}, ${e.target.cellIndex}`
    );
  });

  // Handle players
  let playerOne = "";
  let playerTwo = "";

  playerOneColor = "red";
  playerTwoColor = "yellow";

  // while (!playerOne) {
  //   playerOne = prompt("Player One: Enter your name (Red)");
  // }

  // while (!playerTwo) {
  //   playerTwo = prompt("Player Two: Enter your name (Yellow)");
  // }

  // TODO: Set current player and turn after receiving
  //       game info at start of game
  let currentPlayer = -1;
  // playerTurn.text(`${playerOne}'s turn`);

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
          playerTurn.text(`${playerTwo}'s turn`);
          return (currentPlayer = 2);
        } else {
          row[0].style.backgroundColor = playerTwoColor;
          playerTurn.text(`${playerOne}'s turn`);
          return (currentPlayer = 1);
        }
      }
    }
  }

  function handleMove(event) {
    // Send a message to the server to move this piece.
    socket.emit("move", { username, column: event.target.cellIndex });

    // Change the colour of the cell.
    changeColor(event);
  }

  // Change the colour of each cell
  tableCells.each(function () {
    if (currentPlayer != -1) {
      $(this).click(handleMove);
      $(this).css("backgroundColor", "white");
    }
  });
});
