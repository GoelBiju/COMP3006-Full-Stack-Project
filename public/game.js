$(function () {
  // Create socket
  let socket = io();

  // Get gameId
  console.log("Game ID: ", gameId);

  // Game settings
  let gameJoined = false;
  let getUsername = () => $("#player-name").val();

  // Get table rows
  let tableRows = $("tr");
  // console.log("Got table rows: ", tableRows);

  // Get cells and slots
  let tableCells = $("td");
  // console.log("Got table cells: ", tableCells);

  // Player information
  let gamePlayers = [];
  let myId = -1;
  let currentPlayer = -1;

  // Helper to set the modal with information
  function showGameModal(message, redirect = "") {
    // Set the body with the message
    $("#modalBodyMessage").html(message);

    if (!redirect) {
      $("#gameModalBtn").click(function () {
        $("#gameModal").modal("hide");
      });
    } else {
      $("#gameModalBtn").attr("href", redirect);
    }

    // Show the modal
    $("#gameModal").modal("show");
  }

  function showResultModal(scoreOne, scoreTwo, title, colour = "black") {
    // Set the body with the message
    $("#modalBodyTitle").html(title);
    $("#modalBodyTitle").css("color", colour);
    $("#modalBodyTitle").css("font-size", "30px");
    $("#modalBodyTitle").css("text-align", "center");

    // Set the player names
    $("#modalPlayers").css("text-align", "center");
    $("#modalPlayerOne").text("goel");
    $("#modalPlayerOne").css("font-size", "20px");
    $("#modalPlayerOne").css("color", "grey");
    $("#modalPlayerTwo").text("tom");
    $("#modalPlayerTwo").css("font-size", "20px");
    $("#modalPlayerTwo").css("color", "grey");

    // Set the scores
    $("#modalScores").css("text-align", "center");
    $("#modalScoreOne").text(scoreOne);
    $("#modalScoreOne").css("font-size", "25px");
    $("#modalScoreTwo").text(scoreTwo);
    $("#modalScoreTwo").css("font-size", "25px");

    $("#modalScoreDash").text("-");
    $("#modalScoreDash").css("font-size", "25px");

    $("#gameModalBtn").text("Home");
    $("#gameModalBtn").attr("href", "/");

    // Show the modal
    $("#gameModal").modal("show");
  }

  // Set opacity when showing game modal
  $("#gameModal").on("shown.bs.modal", function (e) {
    $("div.modal-backdrop").css("opacity", 0.25);
  });

  function createConfetti(i) {
    var width = Math.random() * 8;
    var height = width * 0.4;
    var colourIdx = Math.ceil(Math.random() * 3);
    var colour = "red";

    switch (colourIdx) {
      case 1:
        colour = "yellow";
        break;

      case 2:
        colour = "blue";
        break;

      default:
        colour = "red";
    }

    // Add the confetti to the wrapper
    $(`<div class="confetti-${i} ${colour}Confetti"></div>`)
      .css({
        width: `${width}px`,
        height: `${height}px`,
        top: `${-Math.random() * 20}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() + 0.5,
        transform: `rotate(${Math.random() * 360}deg)`,
      })
      .appendTo(".wrapper");

    dropConfetti(i);
  }

  function resetConfetti(x) {
    $(`.confetti-${x}`).animate(
      {
        top: `${-Math.random() * 20}%`,
        left: `-=${Math.random() * 15}%`,
      },
      0,
      function () {
        dropConfetti(x);
      }
    );
  }

  function dropConfetti(x) {
    $(`.confetti-${x}`).animate(
      {
        top: "100%",
        left: `+=${Math.random() * 15}%`,
      },
      Math.random() * 2000 + 2000,
      function () {
        resetConfetti(x);
      }
    );
  }

  // showResultModal(10, 10, "You Win", "green");

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

  // Emit game action and data
  function emitGameAction(action, data) {
    socket.emit("game", {
      gameId,
      action,
      data,
    });

    console.log(`Sent game action (${action}): ${data}`);
  }

  // TODO: When document is ready perform a join on the room.
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
    emitGameAction("join", getUsername());
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

    // Redirect back to home
    showGameModal(msg, "/");
  });

  // Handle response to a move.
  socket.on("move", function (moveInfo) {
    const { playerScores } = moveInfo;
    console.log("Move response: ", moveInfo);

    // Check if the move was made
    if (moveInfo.confirm) {
      console.log(
        `Move confirmed: ${moveInfo.row} (row), ${moveInfo.column} (column) (colour: ${moveInfo.colour})`
      );

      // Change the colour of the cell
      console.log(
        "Got table row: ",
        tableRows.eq(moveInfo.row).children().eq(moveInfo.column)
      );
      $(tableRows.eq(moveInfo.row).children().eq(moveInfo.column)).css(
        "backgroundColor",
        moveInfo.colour
      );

      // Update player scores
      $("#my-remaining-coins").text(42 - playerScores[myId]);
      $("#opponent-remaining-coins").text(
        42 - playerScores.find((id) => id != myId)
      );

      // Check if we received a win, lost or draw result.
      if (moveInfo.win) {
        $(".wrapper").css("min-height", "100vh");

        // Create confetti for win
        for (let i = 0; i < 150; i++) {
          createConfetti(i);
        }

        showResultModal(playerScores[0], playerScores[1], "You Win", "green");
      } else if (moveInfo.lost) {
        showResultModal(playerScores[0], playerScores[1], "You Lost", "red");
      } else if (moveInfo.result) {
        showResultModal(playerScores[0], playerScores[1], "Draw");
      } else {
        // Update next move
        currentPlayer = moveInfo.nextMove;
        $("#player-turn").text(`Player Turn: ${getPlayerTurn()}`);
      }
    } else {
      console.log("Unable to move: ", moveInfo.reason);
      showGameModal(`Error: ${moveInfo.reason}`);
    }
  });

  // Add event listener to each table cell to
  // find row and column location of cell
  $(".cell").click(function (e) {
    console.log(
      "Row, Column of clicked: ",
      `${e.target.parentElement.rowIndex}, ${e.target.cellIndex}`
    );
  });

  function handleMove(event) {
    if (gameJoined && myTurn()) {
      // Send a message to the server to move this piece.
      // socket.emit("move", {
      //   id: myId,
      //   column: event.target.cellIndex,
      // });
      emitGameAction("move", {
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
