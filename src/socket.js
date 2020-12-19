// Handle socket events.
function handleConnection(socket) {
  socket.emit("connection", "confirmed");

  // Handle socket events.
  socket.on("join", (userInfo) => handleJoin(userInfo));
}

function handleJoin(userInfo) {
  console.log("User joined: ", userInfo);
}

module.exports = {
  handleConnection,
  handleJoin,
};
