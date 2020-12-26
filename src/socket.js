const {
  addGamePlayer,
  getRandomPlayer,
  getGamePlayerCount,
  getGamePlayers,
} = require("./controllers/Game");

// TODO: Implement rooms based on game

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
  const res = await addGamePlayer(username);
  console.log("Add result: ", res);
  if (res) {
    console.log("Added game player: ", username);

    const count = await getGamePlayerCount();
    console.log("Game count: ", count);

    if (count == 2) {
      console.log("Game now full");
      // Choose a random player to start
      nextMove = await getRandomPlayer();

      // Get all the players in this game.
      let gamePlayers = await getGamePlayers();
      console.log("Game players: ", gamePlayers);

      // Send to other player
      socket.broadcast.emit("game", {
        status: "start",
        opponent: username,
        gamePlayers,
        nextMove,
      });

      // Send back to client
      socket.emit("game", {
        status: "start",
        // Find the other players username
        opponent: gamePlayers.find((player) => player != username),
        gamePlayers,
        nextMove,
      });
      console.log("Sent game start, start player: ", nextMove);
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

// function handleMove(socket, moveInfo) {
//   console.log("Move info: ", moveInfo);
// }

module.exports = {
  handleConnection,
};
