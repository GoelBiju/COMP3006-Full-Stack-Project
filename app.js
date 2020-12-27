let server = require("./server");
let PORT = process.env.PORT || 9000;

// Run the server
let app = server.app;
app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
