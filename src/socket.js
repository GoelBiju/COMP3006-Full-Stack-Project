const {
  addGamePlayer,
  getRandomPlayer,
  getGamePlayerCount,
  getGamePlayers,
  switchMove,
  updateNextMove,
} = require("./controllers/Game");
const { makeMove } = require("./logic");

// TODO: Implement rooms based on game
const gameId = "5fe570db883ea74b84e9fe3b";

// Handle socket events.
function handleConnection(socket) {
  // Emit a connection success to client
  socket.emit("connection", "success");

  // Handle Join events.
  socket.on("join", (userInfo) => handleJoin(socket, userInfo));

  // Handle Move events.
  socket.on("move", (moveInfo) => handleMove(socket, moveInfo));
}

async function handleJoin(socket, username) {
  console.log("User join request: ", username);

  // Add the user to the game.
  const res = await addGamePlayer(gameId, username);
  console.log("Add result: ", res);
  if (res) {
    console.log("Added game player: ", username);

    const count = await getGamePlayerCount(gameId);
    console.log("Game count: ", count);

    if (count == 2) {
      console.log("Game now full");
      // Choose a random player to start
      nextMove = await getRandomPlayer(gameId);

      // Update next move
      const updated = await updateNextMove(gameId, nextMove);
      if (updated) {
        console.log("Updated next move to: ", nextMove);

        // Get all the players in this game.
        let gamePlayers = await getGamePlayers(gameId);
        console.log("Game players: ", gamePlayers);

        // Send to other player
        socket.broadcast.emit("game", {
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
        socket.emit("game", { status: "error" });
        console.log("Could not initialise next move to: ", nextMove);
      }
    } else {
      socket.emit("game", { status: "wait" });
      console.log("Waiting for another player");
    }
  } else {
    // Reject if already full
    socket.emit("reject", "Game full, try again later");
    console.log(`Connection from ${username} rejected, game full`);
  }
}

async function handleMove(socket, moveInfo) {
  console.log(`Move info from ${moveInfo.id}: `, moveInfo);

  // Get id and column from move.
  const { id, column } = moveInfo;

  // Check if player has the next move.
  const row = await makeMove(gameId, id, column);
  console.log("Moved row: ", row);
  if (row != -1) {
    // Update next player
    const nextMove = await switchMove(gameId, id);
    if (nextMove != -1) {
      let moveInfo = {
        confirm: true,
        row,
        column,
        // TODO: colour should be associated to players
        colour: id == 0 ? "red" : "yellow",
        // Return next move
        nextMove,
      };

      // Send move to other player
      socket.broadcast.emit("move", moveInfo);

      // Send back a confirmation to change client board
      socket.emit("move", moveInfo);
    } else {
      socket.emit("move", {
        confirm: "false",
        reason: "Issue switching player",
      });
    }
  } else {
    socket.emit("move", { confirm: false, reason: "Rejected move" });
  }
}

module.exports = {
  handleConnection,
};
