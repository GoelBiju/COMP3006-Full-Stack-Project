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
  gamePlayerExists,
  getGameInfo,
  getGameState,
} = require("./controllers/GameController");
const { makeMove, performChecks } = require("./logic");

let streamPeers = {};

// Handle socket events.
function handleConnection(socket) {
  // Emit a connection success to client
  socket.emit("connection", "success");

  // Handle game events.
  socket.on("game", (gameData) => handleGame(socket, gameData));

  // Handle stream events.
  socket.on("streamSetup", (streamData) => handleStream(socket, streamData));
}

// TODO: Can we replace streamPeers with socket.io rooms?
function handleStream(socket, streamData) {
  // Get game id and stream action/data
  const { gameId, action, data } = streamData;

  console.log(`Stream setup message from ${socket.id} for ${gameId}`);
  console.log(`Game ${gameId}, action: ${action}, data: `, data);

  // Handle stream actions
  switch (action) {
    case "join":
      console.log(`Client ${socket.id} connecting to game stream: ${gameId}`);

      // Initiate a connect to the client
      streamPeers[socket.id] = socket;

      // Ask other clients to setup peer connection receiver
      for (let id in streamPeers) {
        if (id !== socket.id) {
          console.log("Sending init receive to: ", id);
          streamPeers[id].emit("initReceive", socket.id);
        }
      }
      // socket.to(`stream-${gameId}`).emit("initReceive", socket.id);
      break;

    // Relay peer connection signal to a specific socket
    case "signal":
      console.log(`Sending signal from ${socket.id} to ${data}`);
      if (streamPeers[data.socket_id]) {
        streamPeers[data.socket_id].emit("signal", {
          socket_id: socket.id,
          signal: data.signal,
        });
      }
      break;

    case "initSend":
      console.log(`initSend by ${socket.id} for ${data.init_socket_id}`);

      streamPeers[data.init_socket_id].emit("initSend", socket.id);
      break;

    case "disconnect":
      console.log("socket disconnected: ", socket.id);

      // TODO: Replace with rooms
      // socket.broadcast.emit("removePeer", socket.id);
      socket.to(`stream-${gameId}`).emit("removePeer", socket.id);
      delete streamPeers[socket.id];

    default:
      console.log("Unhandled action and data: ", action, data);
      break;
  }
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

  // TODO: Check if the player already exists in this game,
  //       if so join them without adding otherwise add them
  const exists = await gamePlayerExists(gameId, username);
  console.log(`Game player ${username} exists in ${gameId}: `, exists);
  if (!exists) {
    // Try adding the user to the game.
    const res = await addGamePlayer(gameId, username);
    console.log("Add result: ", res);

    if (res) {
      // Add the player to game.
      socket.join(gameId);
      console.log(`Added player (${username}) to game ${gameId}`);

      // get the current player count
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
  } else {
    // Check if the game is full and in progress
    const state = await getGameState(gameId);
    console.log("Current game state: ", state);
    if (state === 0) {
      // Send the current game information for the client to update
      const gameInfo = await getGameInfo(gameId);
      console.log("Game info: ", gameInfo);

      if (gameInfo) {
        // Add the player to game.
        socket.join(gameId);
        console.log(`Added player (${username}) to game ${gameId}`);

        socket.emit("game", {
          ...gameInfo,

          // Fill in extra details to enable game to resume
          status: "resume",
          opponent: gameInfo.gamePlayers.find((player) => player != username),
          id: gameInfo.gamePlayers.findIndex((player) => player == username),
        });
      } else {
        socket.emit("game", {
          status: "error, unable to retrieve game info (server)",
        });
      }
    } else if (state === -1) {
      // Add the player to game.
      socket.join(gameId);
      console.log(`Added player (${username}) to game ${gameId}`);

      socket.emit("game", { status: "wait" });
    } else {
      // Reject if already full
      socket.emit("reject", "Game unavailable or full");
      console.log(`Connection from ${username} rejected, game full`);
    }
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
