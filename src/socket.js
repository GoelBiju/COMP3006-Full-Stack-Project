const {
  addGamePlayer,
  getRandomPlayer,
  getGamePlayerCount,
  getGamePlayers,
  switchMove,
  updateNextMove,
  updateState,
  getPlayerScores,
  updateWinner,
  getGamePlayer,
} = require("./controllers/GameController");
const { makeMove, performChecks } = require("./logic");

// Handle socket events.
function handleConnection(socket) {
  // Emit a connection success to client
  socket.emit("connection", "success");

  // Handle game events.
  socket.on("game", (gameData) => handleGame(socket, gameData));
}

// Handles all game related events.
function handleGame(socket, gameData) {
  console.log("Game data: ", gameData);

  // Get game action and data.
  const { gameId, action, data } = gameData;
  switch (action) {
    case "join":
      handleJoin(socket, gameId, data);
      break;

    case "move":
      handleMove(socket, gameId, data);
      break;
  }
}

// Handle a join request to a game with the game ID and username
async function handleJoin(socket, gameId, username) {
  console.log("User join request: ", username, gameId);

  // Add the user to the game.
  const res = await addGamePlayer(gameId, username);
  console.log("Add result: ", res);
  if (res) {
    // Add the player to game.
    socket.join(gameId);
    console.log(`Added player (${username}) to game ${gameId}`);

    const count = await getGamePlayerCount(gameId);
    console.log("Game count: ", count);
    if (count == 2) {
      console.log("Game now full");

      // Set the game state to 0
      const updated = await updateState(gameId, 0);
      if (updated) {
        // Choose a random player to start
        const nextMove = await getRandomPlayer(gameId);

        // Update next move
        const updated = await updateNextMove(gameId, nextMove);
        if (updated) {
          console.log("Updated next move to: ", nextMove);

          // Get all the players in this game.
          let gamePlayers = await getGamePlayers(gameId);
          console.log("Game players: ", gamePlayers);

          // Send to other player
          socket.to(gameId).emit("game", {
            status: "start",
            opponent: username,
            id: gamePlayers.findIndex((player) => player != username),
            gamePlayers,
            nextMove,
          });

          // Send back to client
          socket.emit("game", {
            status: "start",
            // Find the other players username
            opponent: gamePlayers.find((player) => player != username),
            id: gamePlayers.findIndex((player) => player == username),
            gamePlayers,
            nextMove,
          });
          console.log("Sent game start, start player: ", nextMove);
        } else {
          socket.emit("game", {
            status: "error, unable to initialise game (server)",
          });
          console.log("Could not initialise next move to: ", nextMove);
        }
      } else {
        socket.emit("game", {
          status: "error, unable to set initial game state (server)",
        });
      }
    } else {
      socket.emit("game", { status: "wait" });
      console.log("Waiting for another player");
    }
  } else {
    // Reject if already full
    socket.emit("reject", "Game unavailable or full");
    console.log(`Connection from ${username} rejected, game full`);
  }
}

// Handle move actions in a game
async function handleMove(socket, gameId, moveInfo) {
  console.log(`Move info from ${moveInfo.id} (${gameId}): `, moveInfo);

  // Get id and column from move.
  const { id, column } = moveInfo;

  // Check if player has the next move.
  const row = await makeMove(gameId, id, column);
  console.log("Moved row: ", row);
  if (row != -1) {
    // Check current state of the board
    const state = await performChecks(gameId);

    // Update the current game state.
    const updated = await updateState(gameId, state);
    if (state != -1 && updated) {
      console.log("Current game state updated: ", state, updated);

      // Get the current players score.
      const playerScores = await getPlayerScores(gameId);
      console.log("Current player scores: ", playerScores);
      if (playerScores[0] != -1 && playerScores[1] != -1) {
        // Generate move info to send back to client
        let info = {
          confirm: true,
          state,
          row,
          column,
          // TODO: colour should be associated to players
          colour: id == 0 ? "red" : "yellow",
          // Return both player scores
          playerScores,
        };

        // Check if states match a win
        if ([1, 2, 3].includes(state)) {
          // get the username of the winning player
          const username = await getGamePlayer(gameId, id);
          console.log(`Win ${state} for ${username} (${id})`);

          // Update winner in game.
          const updated = await updateWinner(gameId, username);
          if (updated) {
            // Send win/lost results to both clients
            socket.to(gameId).emit("move", {
              ...info,
              lost: true,
            });

            socket.emit("move", {
              ...info,
              win: true,
            });
          } else {
            socket.emit("move", {
              confirm: false,
              reason: "Issue updating winner of game (server)",
            });
          }
        } else if (state == 4) {
          // Send draw result to both players
          socket.to(gameId).emit("move", {
            ...info,
            result: -1,
          });

          socket.emit("move", {
            ...info,
            result: -1,
          });
        } else {
          // Update next player
          const nextMove = await switchMove(gameId, id);
          if (nextMove != -1) {
            let moveInfo = {
              ...info,

              // Return next move
              nextMove,
            };
            // Send move to other player
            socket.to(gameId).emit("move", moveInfo);

            // Send back a confirmation to change client board
            socket.emit("move", moveInfo);
          } else {
            socket.emit("move", {
              confirm: false,
              reason: "Issue switching player (server)",
            });
          }
        }
      } else {
        socket.emit("move", {
          confirm: false,
          reason: "Unable to set player scores (server)",
        });
      }
    } else {
      socket.emit("move", {
        confirm: false,
        reason: "Unable to get new game state or update it (server)",
      });
    }
  } else {
    socket.emit("move", { confirm: false, reason: "Rejected move" });
  }
}

module.exports = {
  handleConnection,
};
